# Test results & demonstration plan

## A. Automated verification — actual results (run 2026-10-09)

```bash
npm run typecheck   # tsc --noEmit                → 0 errors
npx eslint          # whole repo                  → 0 errors / 0 warnings
npm test            # vitest run                  → 4 files, 80 tests passed
npm run build       # next build (production)     → success; routes /api/webhooks/*, /api/inbox/*, /api/agent/jobs, /inbox compiled
```

* **49 unit tests** (`tests/unit`): Arabic normalization/stemming; Jordanian-Arabic + English intent classification and
  forced-escalation rules; HMAC signature + GET handshake; WhatsApp/Messenger/Instagram payload normalization;
  messaging-window rules (24 h, template, HUMAN_AGENT tag); message splitting to platform limits (Instagram bytes);
  retry classification; price/commitment/availability/action-claim guards; knowledge retrieval.
* **31 integration tests** (`tests/integration`, real Payload + database, Meta Graph API mocked at the HTTP boundary):
  verification & forged-signature rejection; WhatsApp end-to-end (request body, bearer token, ids stored); duplicate
  delivery; 160 JOD quote + "installation not included"; unknown offer scope → honest answer + gap + handoff; no-answer
  → handoff, never a guess; delivery statuses (out-of-order, failure with provider error); voice notes; Messenger
  (`/me/messages`, RESPONSE) and Instagram (`graph.instagram.com/{id}/messages`); events for foreign assets ignored;
  complaint/safety/discount/unsupported-service handoffs with AI paused and silent; failed team notification reported
  honestly; human takeover, return-to-AI, pause/resume, human-send auto-takeover; 24 h window blocking + template path;
  500 → backoff retry → delivered, policy error → failed immediately; worker re-processing; invented-price draft blocked;
  provider outage → human handoff; qualification + consent yes/no; appointment *request* vs staff confirmation; draft
  knowledge invisible & non-admin publish rejected; paused offer not quoted; expired offer ignored; analytics only
  counting verified sales/confirmed appointments.
* The same **31 integration tests were also run against a real PostgreSQL 16 database** created from the committed
  migrations (`TEST_DATABASE_URI=postgres://… npx vitest run tests/integration`) — 31/31 passed.
* **Production-build HTTP check** (`next start` + Postgres): GET handshake → `777` echoed / wrong token → 403; signed
  WhatsApp POST → 200; forged signature → 401; replay → 200 with `duplicate_count=1` and no second reply; the outbound
  call really reached `graph.facebook.com` and Meta answered *"Invalid OAuth access token"* (code 190) for the deliberately
  fake token → stored as `failed`, non-retryable; `/api/agent/jobs` 401 without / 200 with the secret; `/api/inbox/*` 401
  without a session.
* Dashboard exercised manually in the browser (login → simulator → conversation thread with handoff summary and
  takeover controls → integration-status page, Arabic RTL). The analytics page is covered by the API-level test only.

**What these do NOT prove:** that a real WhatsApp/Messenger/Instagram account delivers webhooks to the server and
accepts our sends. That is Section B.

## B. Demonstration plan — all three channels (needs NAQI credentials)

Prerequisites: app deployed on HTTPS with Postgres, `npm run migrate && npm run seed:agent`, staff user, env from
`03-meta-setup.md`, worker scheduled, `HANDOFF_NOTIFY_EMAILS` set. Open `/inbox` on a second screen.

| # | Step | Expected | Proves |
| --- | --- | --- | --- |
| 0 | `/inbox → الحالة والتكامل → فحص الاتصال الفعلي` | Each configured channel shows ✔ with the account name | Tokens + asset ids valid |
| 1 | Meta dashboard → *Verify and save* webhook for each channel | Dashboard accepts; *Webhook events* shows `verification` rows | Handshake |
| 2 | **WhatsApp:** from a phone, send «مرحبا» to the business number | Thread appears in inbox (channel واتساب); assistant replies with the intro; ticks go ✓ → ✓✓ → read | Inbound, outbound, statuses |
| 3 | WhatsApp: «بكم الفلتر التقليدي سبع مراحل؟» | Reply quotes **160** and says installation isn't included | Offer grounding |
| 4 | WhatsApp: «شو بيشمل عرض الصيانة بـ 35؟» | Honest "details not approved yet" + handoff + email/webhook notification + entry in *Knowledge gaps* (until NAQI fills the scope) | Missing-info path |
| 5 | WhatsApp: «بدي أحكي مع موظف» | Reply + conversation → **يحتاج موظفًا**, AI paused; further customer messages get no AI reply | Escalation + pause |
| 6 | In `/inbox`: *استلام المحادثة*, reply as staff; customer receives it | Staff message delivered; unread cleared; *إعادة للمساعد الآلي* resumes AI | Human takeover |
| 7 | Send the *same* webhook twice (Meta's *Resend* in the console or repeat the signed `curl`) | One message, one reply | Duplicate prevention |
| 8 | Wait 25 h (or set `lastInboundAt` back in a staging DB), try a staff free-form message | Blocked with the 24 h explanation; template form offered | Window compliance |
| 9 | **Messenger:** repeat 2, 3, 5 from a personal account that has a Page role (Dev mode) | Same behaviour, channel ماسنجر | Messenger |
| 10 | **Instagram:** repeat 2, 3, 5 from a tester IG account that DMs the professional account | Same behaviour, channel إنستغرام | Instagram |
| 11 | Purchase flow: «بدي أشتري فلتر سبع مراحل» → «ساكن بخلدا» | Lead qualified; high-intent handoff to sales; consent question asked; after «نعم» name/phone are stored, after «لا» they are not | Qualification + consent |
| 12 | Maintenance: «بدي صيانة، الضغط ضعيف، ساكن بعبدون» | Appointment **request** (status "مطلوب — غير مؤكد"); staff confirm with a date → "مؤكد", counted in analytics | Appointment honesty |
| 13 | Stop the worker/Meta token → send a message | Message shown as failed/retrying on the status page; recovers when fixed | Failure monitoring |

Record each step's result (date, tester, screenshot) in the go-live checklist; **only then** label a channel "live".
The staff **المحاكي** tab reproduces steps 3–5, 11–12 without Meta (logic test only, marked as such).
