# Deployment & operations

The assistant ships inside the existing app — same build, same container. Follow `DEPLOYMENT.md` for the base
(Supabase Postgres, env, Vercel/Docker), then:

## 1. Database

```bash
npm run migrate          # applies 20261009_*_ai_assistant (12 collections, versions tables, users.role += sales/support)
npm run seed:agent       # initial approved knowledge + the two offers (idempotent)
```
Docker's entrypoint already runs `npm run migrate` on boot. Migration verified on Postgres 16 (up) and by running the
full integration suite against it. Create staff users in `/admin → Users` with role **Sales (inbox)**,
**Technical support (inbox)** or **Administrator**; staff open **`https://<domain>/inbox`** (logs in through the
CMS login).

## 2. Environment

See the annotated block at the end of `.env.example`. Minimum for a live assistant:
`ANTHROPIC_API_KEY` (+ `AI_PROVIDER=anthropic`), `META_APP_SECRET`, the per-channel ids/tokens/verify tokens,
`HANDOFF_NOTIFY_EMAILS` and/or `HANDOFF_WEBHOOK_URL`, `AGENT_CRON_SECRET` (or `CRON_SECRET` on Vercel), plus an
e-mail provider (Resend/SMTP from `DEPLOYMENT.md`) if you use e-mail notifications.
Without an Anthropic key the assistant runs in **offline rules mode** (only quotes approved knowledge).
Model: `AI_MODEL` (default `claude-opus-5-5`; `AI_EFFORT=low` keeps cost/latency down). Claude is called through the
official `@anthropic-ai/sdk` with structured JSON output; a refusal or provider outage becomes a human handoff.

## 3. Background worker (required)

Webhooks answer Meta immediately and process after the response. A worker retries what failed:

```
GET https://<domain>/api/agent/jobs     Authorization: Bearer <AGENT_CRON_SECRET>
```
Run it **every minute**: Vercel Pro cron (add `{ "crons": [{ "path": "/api/agent/jobs", "schedule": "* * * * *" }] }`
to `vercel.json` — per-minute schedules are rejected on Hobby; set `CRON_SECRET`), an external pinger, or on Docker:
`* * * * * curl -fsS -H "Authorization: Bearer $AGENT_CRON_SECRET" https://<domain>/api/agent/jobs`.
It (1) retries queued outbound messages after backoff, (2) re-runs the assistant for stored-but-unanswered inbound
messages (>60 s old), (3) prunes webhook diagnostics older than 30 days. `/inbox → الحالة والتكامل` shows whether it is configured.

## 4. Team notifications

On every handoff the team is notified by e-mail and/or a signed webhook (`X-NaqiJo-Signature: sha256=…`, JSON body
with `text` and a deep link to the conversation — works with Slack incoming webhooks via an n8n/Zapier bridge or
Teams). The result is stored on the handoff (`sent / partial / failed / not_configured`) and shown in the inbox. If
nothing is configured, handoffs are still in the inbox (conversation marked **يحتاج موظفًا**), and the status page warns.

## 5. Monitoring

* `/inbox → الحالة والتكامل`: per-channel configuration, last webhook, errors in 24 h, failed/retrying messages,
  live token check, AI provider, notification and cron status, last 20 failed/blocked messages.
* Admin → *Webhook events*, *Audit logs*, *Knowledge gaps* (questions to add to the knowledge base).
* `/health` (existing) for uptime checks. Server logs carry structured errors (`LOG_LEVEL`).

## 6. Privacy & data handling

Customer data (messages, names, phones, addresses) are personal data. Collected only with the consent flow;
conversation collections are visible only to inbox roles; deletion is admin-only. **Decide and document:** retention
period, privacy-notice link to give customers, consent wording (see `src/agent/templates.ts → consentNotice`),
and have counsel confirm compliance with Jordan's personal-data-protection law and Meta's platform terms.
Back up the database (Supabase backups) — it holds the conversation history.

## 7. Rollback

Disable the assistant per channel by removing its webhook subscription in Meta (or unset `*_ACCESS_TOKEN`);
conversations stay stored. Pause AI per conversation from the inbox, or set every conversation to human mode.
`npm run migrate:down` runs the generated down-migration (destroys assistant data; the down path has not been exercised — rehearse on a copy first).
