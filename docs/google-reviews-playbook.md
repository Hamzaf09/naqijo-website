# Google Reviews Playbook (NaqiJo)

Internal playbook for earning **honest** Google reviews. Reviews are a strong,
legitimate local-trust signal — but only when genuine. This document never
recommends manipulation.

> **Review link status: REQUIRES OFFICIAL GBP REVIEW LINK.**
> The short "write a review" link is generated inside the verified Google
> Business Profile. Once available, set it in the env var
> `NEXT_PUBLIC_GOOGLE_REVIEW_URL` — the site's `GoogleLocalLinks` component and
> the templates below will then use it. Until then, do not paste any link.

## Hard rules (never break)

- Never buy, incentivize, or trade for reviews (no discounts/gifts "for a review").
- Never post fake reviews, or have staff/family pose as customers.
- Never **gate** reviews (asking only happy customers, filtering out unhappy ones).
- Never review-bomb competitors or your own listing.
- Ask **every** customer the same way, regardless of expected sentiment.

## When to ask

Ask once, at a natural moment of completion, in the customer's own channel:

1. **After a successful installation** — once the system is running and the
   customer has seen it work.
2. **After a maintenance visit** — when the service is done and confirmed.
3. **After a consultation** that the customer found genuinely useful (even with
   no purchase) — their feedback on the advice is valid and valuable.

One ask, plus at most one gentle reminder. No pressure.

## Templates

Replace `[REVIEW_LINK]` with the official GBP review link once it exists.

### After installation
**AR (WhatsApp):**
> شكراً لثقتك بـنقي الرابية 🙏 إن كان تركيب النظام قد نال رضاك، يسعدنا لو تشاركنا
> تجربتك الصادقة بتقييمٍ على خرائط Google — رأيك يساعد عائلاتٍ أخرى في عمّان.
> [REVIEW_LINK]

**EN (WhatsApp):**
> Thank you for trusting Naqi Al Rabia 🙏 If you're happy with your new system,
> we'd be grateful for an honest review on Google Maps — your feedback helps
> other families in Amman. [REVIEW_LINK]

### After maintenance
**AR:**
> نشكرك على اختيار نقي الرابية لصيانة نظامك. إذا كانت الخدمة جيدة، تقييمك الصادق
> على Google يعني لنا الكثير: [REVIEW_LINK]

**EN:**
> Thank you for choosing Naqi Al Rabia for your maintenance. If the service was
> good, an honest Google review would mean a lot to us: [REVIEW_LINK]

### After consultation
**AR:**
> سعدنا بتقديم الاستشارة الهندسية لك. إن وجدتها مفيدة، يسعدنا سماع رأيك الصادق على
> Google: [REVIEW_LINK]

**EN:**
> It was a pleasure providing your engineering consultation. If you found it
> useful, we'd welcome your honest feedback on Google: [REVIEW_LINK]

## QR code / link strategy

- Generate the short review link from the GBP dashboard ("Ask for reviews").
- Turn it into a QR code for: printed service reports, installation handover
  cards, and the office/showroom. The QR and the link must resolve to the **same**
  official GBP review destination — never a third-party form.
- Reuse the same link in the WhatsApp templates above.

## Responding to reviews (respond to all — positive and negative)

- **Positive:** thank the customer by first name if used, briefly and specifically.
  AR: «شكراً لك [الاسم]! سعداء بخدمتك.» EN: "Thank you, [name]! Glad we could help."
- **Negative / critical:** stay calm and professional. Acknowledge, apologize for
  the experience (not necessarily fault), move the detail off-platform to phone.
  AR: «نعتذر عن هذه التجربة. يهمّنا حلّها — تواصل معنا على +962 79 290 0008 لنساعدك.»
  EN: "We're sorry about this experience. We'd like to make it right — please
  reach us at +962 79 290 0008."
- Never argue publicly, never reveal customer private data, never be defensive.

## Authenticity principles

- Reviews must come from real customers about real interactions.
- Do not solicit reviews in bulk bursts (looks unnatural); ask as jobs complete.
- Keep a simple internal log of *when you asked* (not who "should" review) so the
  ask is consistent and no one is pressured twice.
