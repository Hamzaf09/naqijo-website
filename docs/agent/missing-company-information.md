# Missing company information & remaining blockers

## A. Information NAQI must supply and an administrator must approve (publish) before the assistant uses it

Until supplied, the assistant says it has no approved details and routes the customer to the team.

1. **Offer A – Filter maintenance (35 JOD):** exact scope (visit, labour, which cartridges/stages included, which filter
   brands/models, duration), validity dates, areas, whether parts are extra, warranty on the service, booking steps.
2. **Offer B – Traditional NAQI Seven-Stage Filter (160 JOD):** what exactly is included (model, stages, accessories),
   confirmation that installation is excluded + the **installation charge/policy**, delivery, warranty, validity dates,
   whether installments are ever offered.
3. **Product catalogue** for each of the 11 listed categories: which are actually available now, models, specifications,
   prices, stock/lead times, images/brochures. (Currently published only as *availability unconfirmed* stubs.)
4. **Installation policy & charges** (per product type), what customers must prepare, typical duration.
5. **Warranty policy:** durations per product/service, what is covered/excluded, claim procedure. (The public site says
   "up to five years" — confirm and approve the exact wording before the assistant may repeat it.)
6. **Service coverage & delivery areas:** list of neighbourhoods/cities served in and around Amman, delivery fees/times.
7. **Maintenance services:** price list, visit/inspection fees, scheduling windows, areas, what is done on each visit.
8. **Confirm or exclude:** boilers/hot-water systems, swimming-pool maintenance, circulation pumps, heating elements,
   solar, kitchens, waterproofing. (Messages about boilers/pools/heating currently go to a person; add the approved
   scope + procedures to enable answers.)
9. **Discount/exception policy** (who decides, any standing rules) and whether any price ever varies.
10. **FAQs** the team answers repeatedly (dialect wording welcome) and the **booking procedure** details.
11. **Opening hours, response-time promises, after-hours handling.** (Not stated by the assistant until approved.)
12. **Safety wording** and the emergency contact/number the assistant should give for gas/electricity/flood cases.
13. **Escalation routing:** who is "sales" vs "technical support", notification e-mails/webhook, SLAs.
14. **Privacy:** retention period, privacy-notice URL, approval of the consent wording, legal review of data handling.
15. **WhatsApp template messages** (follow-up, appointment reminder) written and approved in WhatsApp Manager.
16. **Staff list** with roles (Sales / Support / Administrator) and who may approve knowledge.
17. Brand-voice sign-off on the greeting/intro and the fixed escalation wording (`src/agent/templates.ts`).

## B. Remaining integration blockers (nothing below is done on NAQI's behalf)

| Blocker | Owner |
| --- | --- |
| Meta **Business Verification**; Page, Instagram professional account, WABA + phone number connected to one Business portfolio | NAQI |
| Meta developer app created, products added, **App Review / Advanced Access** for messaging permissions, app switched to Live | NAQI (+ dev support) |
| System-user **permanent tokens**, App secret, verify tokens loaded into production env | NAQI / dev |
| WhatsApp **display-name approval**, message templates approved | NAQI |
| Optional: Meta **Human Agent** feature approval (7-day replies) | NAQI |
| Production hosting: HTTPS domain, Supabase/Postgres, `npm run migrate`, `npm run seed:agent` | NAQI / dev |
| **Anthropic API key** (otherwise offline rules mode only) and a cost budget | NAQI |
| Worker/cron scheduled every minute; notification e-mail/webhook configured | dev |
| **End-to-end test on each real channel** (06-test-plan.md §B) — *no channel is live until this passes* | NAQI + dev |
| Privacy/legal review of conversation storage and consent wording | NAQI |

## C. Suggested next engineering steps (after go-live data exists)

Review *Knowledge gaps* weekly and add answers; tune classifier keywords from real chats; add voice-note
transcription; mirror messages typed in native apps (Messenger Handover Protocol / WhatsApp coexistence);
move the rate limiter to a shared store if running many instances; add a staff-facing offer pause shortcut in the inbox.
