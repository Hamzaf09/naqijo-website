# Meta setup (WhatsApp Cloud API · Messenger · Instagram)

Official APIs only. No scraping or unofficial libraries. Verify each step against Meta's current docs at
setup time (UI labels and review rules change): developers.facebook.com → *WhatsApp Business Platform*,
[Messenger webhooks](https://developers.facebook.com/documentation/business-messaging/messenger-platform/webhooks),
[Instagram messaging webhooks](https://developers.facebook.com/documentation/business-messaging/instagram-messaging/webhooks).
Current Graph API version at the time of writing: **v26.0** (set `META_GRAPH_VERSION`).

## 1. Business assets NAQI must own/control

| Asset | Notes |
| --- | --- |
| Meta **Business portfolio** (Business Manager) | Complete **Business Verification** (needed for higher WhatsApp limits and App Review) |
| Facebook **Page** "نقي الرابية" | Messenger channel; admin access for the setup person |
| Instagram **professional** (Business/Creator) account | Linked to the Page (Facebook-login mode) or connected directly (Instagram-login mode); *Allow access to messages* enabled in IG settings |
| **WhatsApp Business Account (WABA)** + a phone number | Number must be able to receive a verification code; cannot be active on the regular WhatsApp app unless using Meta's coexistence option. Display name must be approved |
| Meta **developer app** (type *Business*) | One app can serve all three channels. Add products: *WhatsApp*, *Messenger*, *Instagram* |
| **System user** (Business settings → Users) | Issues non-expiring tokens; assign the Page, WABA and Instagram account to it |

## 2. Permissions / access

| Channel | Permissions (scopes) |
| --- | --- |
| WhatsApp | `whatsapp_business_messaging`, `whatsapp_business_management` |
| Messenger | `pages_messaging`, `pages_manage_metadata`, `pages_show_list` |
| Instagram (Instagram Login) | `instagram_business_basic`, `instagram_business_manage_messages` |
| Instagram (Facebook Login) | `instagram_basic`, `instagram_manage_messages`, `pages_manage_metadata`, `pages_show_list` |
| Optional | *Human Agent* feature (7-day replies for people on Messenger/IG) — request in App Review, then set `META_HUMAN_AGENT_TAG_ENABLED=true` |

While the app is in **Development** mode only people with an app role (admin/developer/tester) can message it.
To serve the public: switch the app to **Live**, complete Business Verification and request **Advanced
Access** (App Review) for `pages_messaging` and the Instagram messaging permission, with a screencast and the
privacy-policy URL. WhatsApp needs an approved display name and a payment method for conversations beyond free tiers.

## 3. Tokens (never commit; set in the host's environment)

* **WhatsApp:** Business settings → System users → *Generate token* for the app with the two WhatsApp scopes,
  expiry **Never**. → `WHATSAPP_ACCESS_TOKEN`. (The 24-hour token on the API-setup page is for a first smoke test only.)
* **Messenger:** with the system-user token, `GET /{page-id}?fields=access_token` returns a non-expiring **Page
  access token** → `MESSENGER_PAGE_ACCESS_TOKEN`, and `MESSENGER_PAGE_ID`.
* **Instagram:** *Instagram Login* mode → token from the app's Instagram product (long-lived, refresh ≤60 days) →
  `INSTAGRAM_ACCESS_TOKEN`, `INSTAGRAM_ACCOUNT_ID`, `INSTAGRAM_API_MODE=instagram_login`. *Facebook Login* mode →
  use the Page token, `INSTAGRAM_API_MODE=facebook_login`.
* **App secret:** App settings → Basic → *App secret* → `META_APP_SECRET` (used to verify every webhook).
* **Verify tokens:** choose any long random strings → `WHATSAPP_VERIFY_TOKEN`, `MESSENGER_VERIFY_TOKEN`, `INSTAGRAM_VERIFY_TOKEN`.

The dashboard page **الحالة والتكامل → "فحص الاتصال الفعلي مع Meta"** performs a real Graph call per channel to
validate the token/asset ids (it proves the credentials work — it does not prove webhooks arrive).

## 4. Webhooks

Public HTTPS URLs (replace the domain):

| Channel | Callback URL | Verify token env |
| --- | --- | --- |
| WhatsApp | `https://<domain>/api/webhooks/whatsapp` | `WHATSAPP_VERIFY_TOKEN` |
| Messenger | `https://<domain>/api/webhooks/messenger` | `MESSENGER_VERIFY_TOKEN` |
| Instagram | `https://<domain>/api/webhooks/instagram` | `INSTAGRAM_VERIFY_TOKEN` |

Deploy the app **first** (the GET handshake is answered by the app), then save the URL in the Meta dashboard.

Subscriptions:

* **WhatsApp** → app dashboard → WhatsApp → Configuration → webhook fields: **`messages`** (inbound messages *and*
  delivery statuses). Subscribe the WABA to the app: `POST /{waba-id}/subscribed_apps`.
* **Messenger** → Webhooks → *Page*: **`messages`, `messaging_postbacks`, `message_deliveries`, `message_reads`**;
  subscribe the page: `POST /{page-id}/subscribed_apps?subscribed_fields=messages,messaging_postbacks,message_deliveries,message_reads`.
* **Instagram** → Webhooks → *Instagram*: **`messages`, `messaging_postbacks`, `messaging_seen`** (reactions optional;
  they are ignored); subscribe the account: `POST /{ig-id}/subscribed_apps?subscribed_fields=messages,messaging_seen`.

Implemented behaviour: raw-body HMAC (`X-Hub-Signature-256`) check → 401 on mismatch; events for other
numbers/pages are ignored; duplicates dropped by `channel:messageId`; echoes (`is_echo`) and reactions ignored;
statuses `sent/delivered/read/failed` update the outbound message (failure keeps Meta's error code/text).

## 5. Messaging-window policy implemented

* Customer writes → window opens for **24 h** (`conversations.lastInboundAt`, taken from the platform timestamp).
* Inside the window the assistant and staff send free-form text. Outside it:
  * WhatsApp → only **approved templates** (dashboard shows a template form; create/approve templates in WhatsApp Manager first).
  * Messenger/Instagram → blocked, unless a *person* sends within 7 days **and** `META_HUMAN_AGENT_TAG_ENABLED=true`.
* The assistant never initiates conversations or sends marketing; an opt-out phrase stops AI messages.
* Blocked sends are stored with status `blocked` + the reason (visible in the thread and the status page).

## 6. Rate limits / limits handled

Text is split to platform limits (WhatsApp 4000 chars, Messenger 1900 chars, Instagram 950 **bytes**, Arabic = 2
bytes/char). Throttling/5xx/network errors (e.g. Graph codes 4, 17, 32, 613, 80007, 130429, 131000, 131016) are retried
with exponential backoff (30 s → 15 min, 5 attempts); policy/auth errors (e.g. 131047, 131026, 190) fail immediately
and are shown to staff.
