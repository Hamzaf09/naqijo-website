# NaqiJo AI Customer-Service & Sales Assistant

A production-oriented assistant for **NAQI Al Rabieh (نقي الرابية للمياه والطاقة)** that answers
customers on **WhatsApp, Facebook Messenger and Instagram DMs**, qualifies leads, records maintenance
requests, and hands conversations to the team — all managed from one staff inbox.

| Document | What it covers |
| --- | --- |
| **this file** | Audit of the existing project, architecture, data model, behaviour rules |
| [03-meta-setup.md](03-meta-setup.md) | Meta app, business assets, permissions, tokens, webhook subscriptions |
| [04-knowledge-base.md](04-knowledge-base.md) | Knowledge base & offers: what to enter, approval workflow, seeded content |
| [05-deployment-operations.md](05-deployment-operations.md) | Env vars, migrations, worker/cron, notifications, monitoring, privacy |
| [06-test-plan.md](06-test-plan.md) | Actual test results + step-by-step demonstration plan for all three channels |
| [missing-company-information.md](missing-company-information.md) | What NAQI must supply/approve, and the remaining blockers |

> **Status, stated plainly:** the code, database, dashboard, AI engine and the three channel adapters are
> implemented and tested against *simulated Meta payloads* and a real Postgres database. **No channel is
> claimed to be live**: that requires NAQI's Meta credentials and an end-to-end test from a real phone/account
> (see [06-test-plan.md](06-test-plan.md)). Until then the assistant also runs in the staff **simulator**.

---

## 1. Audit of the existing project (what was reused)

| Existing | Used for |
| --- | --- |
| Next.js 16 (App Router, Turbopack) + React 19 + TypeScript strict | Webhook/API route handlers and the `/inbox` dashboard live in the same app |
| **Payload CMS 3** on SQLite (dev) / Postgres (prod, migrations only) | Database, admin UI, auth, drafts/versions, access control — the assistant's data are Payload collections |
| Users + roles (`access/roles.ts`), audit helpers | Extended with `sales` and `support` roles; approvals reuse Payload drafts |
| Docker entrypoint that runs `payload migrate` on boot | The new migration (`20261009_*_ai_assistant`) is applied automatically |
| Brand tokens / Alexandria font | Inbox dashboard styling (Arabic, RTL) |
| `siteConfig` (verified phones, e-mail, address, hours) | Seeds the "verified contact details" knowledge entry |

Changed: `payload.config.ts` (12 new collections), `Users` (2 roles), `proxy.ts` (`/inbox` excluded from the
locale router), `.env.example`, `package.json` (`@anthropic-ai/sdk`, `vitest`, scripts).
Not touched: the public marketing site.

Deliberately **not** added: Prisma, a separate Node service, Redis. The project already has a working ORM,
auth and migrations (Payload/Drizzle); a DB-backed outbox + a cron-called worker gives retries without new
infrastructure. Tenant boundaries are kept as a seam (`tenant` field on every record, `TENANT_ID` in
`src/agent/config.ts`); only NaqiJo is active.

## 2. Architecture

```
Meta (WhatsApp / Messenger / Instagram)
   │  signed webhook POST                         ▲ Graph API send (Bearer token)
   ▼                                              │
/api/webhooks/{whatsapp|messenger|instagram}      │
   1 verify X-Hub-Signature-256 on RAW body       │
   2 parse → NormalizedInbound / NormalizedStatus │
   3 ingest (unique dedupeKey → duplicates dropped)
   4 apply delivery statuses (monotonic)          │
   5 respond 200 immediately ──► after(): run assistant turn
                                                  │
                     ┌────────────────────────────┴───────────────────────────┐
                     │ engine.processConversation                              │
                     │  AI off/paused/human? → store only, never reply         │
                     │  classify (deterministic AR/EN rules)                   │
                     │   ├ forced escalation (safety, human, complaint,        │
                     │   │   warranty dispute, discount, order/appointment,    │
                     │   │   unconfirmed service) → FIXED wording, no LLM      │
                     │   └ otherwise: retrieve APPROVED knowledge + offers     │
                     │        → Claude (structured JSON output)                │
                     │        → guards (prices, promises, availability,        │
                     │          action claims, "I'm human") → 1 regeneration   │
                     │        → else safe handoff                              │
                     │  persist lead / customer (consent-aware) / gaps         │
                     │  handoff (structured summary + team notification)       │
                     │  reply = answer + honest "recorded" line + consent ask  │
                     └────────────────────────────┬───────────────────────────┘
                                                  ▼
                outbound: window check → Graph send → status queued/sent/failed
                          retries with backoff via /api/agent/jobs (cron)
Staff: /inbox (Arabic dashboard)  ⇄  /api/inbox/*  (Payload session + role check)
Knowledge & offers: Payload admin (/admin) — draft → administrator publishes (= approves)
```

Source map (`src/agent/`): `channels/` (signature, parse, send, graph client, window rules) · `classifier.ts`
· `knowledge.ts` (approved-only retrieval) · `ai/` (Claude provider, offline rules provider, prompt, schema) ·
`guards.ts` · `engine.ts` · `handoff.ts` · `leads.ts` · `conversations.ts` · `outbound.ts` · `actions.ts`
(staff operations) · `analytics.ts` · `jobs.ts` · `webhook.ts` · `seed.ts`.
Collections: `src/collections/assistant/`.

## 3. Data model (Payload collections, group "Assistant")

`conversations` (one per customer per channel; `aiMode`: ai / human / paused; status open / pending / resolved;
assignee/team; unread; response-time stamps) · `messages` (inbound/outbound, provider id, **unique `dedupeKey`**,
delivery status, retry state, error) · `customers` (identity, consent status, opt-out) · `leads` (qualification
fields, stage, **verified outcome**) · `appointments` (requested → confirmed only by staff) · `handoffs`
(structured summary, notify status) · `internal-notes` · `knowledge-entries` and `offers` (**drafts + admin
publish = approval**) · `knowledge-gaps` (questions we couldn't answer) · `audit-logs` · `webhook-events`.

## 4. Behaviour rules that are enforced in code (not just in the prompt)

* **Only approved knowledge.** The assistant reads the latest *published* knowledge entries and *active, in-date,
  published* offers. Drafts/edits are invisible to customers until an administrator publishes. Non-admins cannot
  publish (server-side hook).
* **Prices are never generated.** Every `JOD/دينار` figure in a reply must equal an approved offer price (or a
  figure written in approved text). Violations → one regeneration → otherwise honest handoff.
* **No invented promises.** "Free", warranty, installments, accessories, availability are blocked unless the
  approved context contains them. Offer 160 JOD states installation is not included (from the offer record).
* **No false claims of action.** The model cannot say it booked/confirmed/forwarded anything. The system appends
  *"your request has been recorded"* **only after the handoff row is saved**; if saving fails the customer is told
  it failed. Appointments are *requests* until staff confirm (hook stamps `confirmedBy/At`; analytics count only those).
* **Escalation never depends on the model:** safety, human request, complaint, warranty dispute, discount,
  existing order/appointment, boiler/pool/heating-type services → fixed wording + handoff.
* **Human takeover** (or a human sending a message) switches AI off immediately; it stays off until "return to AI".
  Handoff reasons that need a person also pause the AI. Messages keep being stored and counted as unread.
* **Consent.** Name/phone/address are stored only after the customer answers "yes" to the consent question
  (asked before collecting, once the conversation turns into a purchase/maintenance request). "No" → never stored.
  Area/need are stored as qualification data. An opt-out phrase stops all AI messaging.
* **Messaging windows.** WhatsApp free-form only ≤24 h after the customer's last message (template otherwise);
  Messenger/Instagram ≤24 h, or ≤7 days with the `HUMAN_AGENT` tag for human-written messages once Meta approves it.
* **Reliability.** Duplicate events are dropped by a DB unique key; outbound failures retry with backoff
  (transient errors only; 5 attempts); unprocessed inbound messages are re-run by the worker; AI outage → a person
  takes over instead of silence or a guess; per-conversation cap on AI replies per minute.

## 5. Security

Webhook HMAC verification on raw bytes (constant-time) · verify-token handshake · secrets only in env vars ·
role-based access (`super-admin`, `admin`, `sales`, `support` for conversations; admins publish knowledge) ·
Payload session cookies (SameSite=Lax, Secure in prod, login lockout) + `Origin` check on dashboard mutations ·
zod validation on every dashboard action · audit log of takeovers, assignments, sends, outcomes, blocked/failed
messages, consent, handoffs · rate limiting (bad-signature log throttle, per-conversation AI cap) · raw provider
payloads kept only for non-text messages · conversation collections are inbox-roles-only, delete is admin-only.

## 6. Analytics definitions (`/inbox` → التحليلات)

Conversations per channel; AI-only vs human-involved; average first-reply time (AI and human); escalation rate
(conversations with ≥1 handoff ÷ conversations); product inquiries (= sales leads) and maintenance requests (=
maintenance leads); qualified leads; **confirmed appointments = confirmed by a staff user**; **sales = leads marked
"won" with invoice/order evidence** (conversion rate shown only when verified won/lost outcomes exist); failed
deliveries, retrying messages, webhook/integration errors.

## 7. Known limitations (honest list)

* The conversation soft-lock and the in-memory limiter are best-effort on multi-instance/serverless hosts (the hard
  guarantees — duplicate suppression, reply caps, window rules — are DB-enforced).
* The assistant cannot read images/voice notes (asks for text; second time → handoff). No speech-to-text yet.
* Replies written by staff directly in the native WhatsApp Business / Facebook / Instagram apps are not mirrored
  (echoes are ignored); staff should answer from `/inbox`.
* Intent/escalation keywords are tuned for Jordanian Arabic + English; extend `classifier.ts` as real chats arrive.
* Delivery-status events that arrive before the send call returns are ignored (very rare).
* Real-channel behaviour is unverified until NAQI's credentials are connected and the demo plan is executed.
