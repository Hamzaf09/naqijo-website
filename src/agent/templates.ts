import type { HandoffReason, Lang } from "./types";

/**
 * Fixed, human-reviewed wording for moments where the reply must never depend
 * on model judgement (safety, escalations, consent, delivery failures).
 */
const t = (lang: Lang, ar: string, en: string) => (lang === "ar" ? ar : en);

export const intro = (lang: Lang) =>
  t(
    lang,
    "أهلًا وسهلًا فيك بنقي الرابية، أنا المساعد الافتراضي للشركة. كيف بنقدر نساعدك؟",
    "Welcome to NAQI Al Rabieh. I'm the company's virtual assistant. How can we help you?",
  );

/** Prefix added to the first AI answer when the customer opened with a question. */
export const introPrefix = (lang: Lang) =>
  t(lang, "أهلًا وسهلًا فيك بنقي الرابية، أنا المساعد الافتراضي للشركة.", "Welcome to NAQI Al Rabieh — I'm the company's virtual assistant.");

export const consentNotice = (lang: Lang) =>
  t(
    lang,
    "عشان نخدمك أسرع، ممكن نسجّل اسمك ورقمك وعنوانك لدى فريق نقي الرابية ونستخدمها فقط لتنسيق طلبك؟ جاوبني بـ «نعم» أو «لا».",
    "To serve you faster, may we record your name, phone and address with the NAQI Al Rabieh team and use them only to arrange your request? Please answer “yes” or “no”.",
  );

export const consentGranted = (lang: Lang) =>
  t(lang, "تمام، شكرًا لثقتك.", "Thank you, noted.");
export const consentDeclined = (lang: Lang) =>
  t(
    lang,
    "ولا يهمك، ما رح نسجّل بياناتك الشخصية، وبنكمل بدونها.",
    "No problem — we won't record your personal details and will continue without them.",
  );

export const mediaReply = (lang: Lang) =>
  t(
    lang,
    "وصلتني رسالتك، بس ما بقدر أفتح الصور أو الرسائل الصوتية هون. ممكن تكتبلي طلبك بالنص؟",
    "I received your message, but I can't open images or voice notes here. Could you write your request as text?",
  );

export const optOutReply = (lang: Lang) =>
  t(
    lang,
    "تمام، ما رح نراسلك بعد هيك إلا إذا بدأت أنت المحادثة. شكرًا لوقتك.",
    "Understood — we won't message you again unless you start the conversation. Thank you.",
  );

export const rateLimited = (lang: Lang) =>
  t(lang, "لحظة من فضلك، بنرد عليك بأقرب وقت.", "One moment please — we'll get back to you shortly.");

export const handoffFailed = (lang: Lang) =>
  t(
    lang,
    "ما قدرت أسجل طلبك للفريق الحين بسبب مشكلة تقنية. ممكن تتواصل معنا مباشرة على الأرقام المعتمدة وبنخدمك فورًا.",
    "I couldn't register your request with the team just now because of a technical problem. Please contact us directly on our official numbers.",
  );

/**
 * Lead-in wording per escalation reason (no model involved). It never claims an
 * action; the system appends `handoffRecorded` only after the handoff is saved.
 */
export function forcedReply(reason: HandoffReason, lang: Lang): string {
  switch (reason) {
    case "safety":
      return t(
        lang,
        "سلامتك أهم شي. إذا في خطر فوري (رائحة غاز، خطر كهرباء، تسرب كبير أو حريق) ابعد عن المكان وتواصل مع الدفاع المدني فورًا. ما بقدر أنصحك بخطوات إصلاح من هون، ولازم فريقنا المختص يتابع حالتك.",
        "Your safety comes first. If there is immediate danger (gas smell, electrical hazard, major leak or fire) move away and contact the civil defense/emergency services right away. I can't advise repair steps here; our specialist team needs to follow up on your case.",
      );
    case "human_request":
      return t(lang, "أكيد، بتقدر تحكي مع أحد أفراد فريقنا.", "Of course — you can speak with a member of our team.");
    case "complaint":
      return t(lang, "بعتذر منك على الإزعاج، وكلامك مهم عندنا.", "I'm sorry for the trouble — your feedback matters to us.");
    case "warranty_dispute":
      return t(lang, "فهمت عليك. أمور الضمان بيراجعها الفريق المختص بشكل مباشر.", "Understood. Warranty cases are reviewed directly by our specialist team.");
    case "discount_request":
      return t(lang, "طلبات الخصم أو الاستثناءات بيقررها فريق المبيعات.", "Discount and exception requests are decided by our sales team.");
    case "existing_order":
      return t(lang, "عشان أعطيك حالة طلبك بدقة لازم الفريق المختص يراجعه.", "To give you your order status accurately, the responsible team needs to check it.");
    case "appointment_confirmation":
      return t(lang, "تأكيد المواعيد بيتم من الفريق المختص فقط.", "Appointments are confirmed only by our team.");
    case "unsupported_service":
      return t(lang, "هاي الخدمة لسا مش مؤكدة عندي، فما بقدر أعطيك معلومة دقيقة.", "I haven't got confirmation for that service yet, so I can't give you accurate information.");
    case "missing_info":
    case "technical_uncertain":
      return t(lang, "ما عندي معلومة معتمدة كافية عن هالسؤال، وما بحب أعطيك معلومة مش دقيقة.", "I don't have enough approved information on this, and I don't want to give you inaccurate details.");
    case "high_intent_lead":
      return t(lang, "ممتاز!", "Great!");
    case "ai_failure":
      return t(lang, "وصلتني رسالتك.", "I've received your message.");
  }
}

/** Honest confirmation appended ONLY after the handoff record was actually saved. */
export function handoffRecorded(lang: Lang, appointment: boolean): string {
  return appointment
    ? t(
        lang,
        "تم تسجيل طلب الموعد لدى الفريق. الموعد مش مؤكد لحد ما يتواصل معك الفريق ويثبّته.",
        "Your appointment request has been recorded. It is not confirmed until the team contacts you and sets it.",
      )
    : t(
        lang,
        "تم تسجيل طلبك لدى فريق نقي الرابية، وبيتواصل معك أحد المختصين.",
        "Your request has been recorded with the NAQI Al Rabieh team, and a specialist will follow up with you.",
      );
}

/** Next-step suggestion for staff, by reason. */
export function recommendedAction(reason: HandoffReason): string {
  const m: Record<HandoffReason, string> = {
    complaint: "Call/message the customer promptly, apologise, and open a follow-up on the issue.",
    human_request: "Take over the conversation and respond personally.",
    technical_uncertain: "Technical support to answer; add the answer to the knowledge base.",
    missing_info: "Answer the customer's question and add the approved answer to the knowledge base.",
    discount_request: "Sales manager to decide on the discount/exception and reply.",
    warranty_dispute: "Support to check warranty records and contact the customer.",
    appointment_confirmation: "Pick a slot, confirm with the customer, then confirm the appointment in the system.",
    high_intent_lead: "Sales to contact the customer, confirm product/price and close the sale.",
    safety: "URGENT: technical team to contact the customer immediately.",
    unsupported_service: "Confirm whether this service is offered; reply and update the knowledge base.",
    existing_order: "Look up the order/appointment and reply with its real status.",
    ai_failure: "Assistant could not process the message; read the conversation and reply.",
  };
  return m[reason];
}

export const TEAM_BY_REASON: Record<HandoffReason, "sales" | "support"> = {
  complaint: "support",
  human_request: "sales",
  technical_uncertain: "support",
  missing_info: "sales",
  discount_request: "sales",
  warranty_dispute: "support",
  appointment_confirmation: "support",
  high_intent_lead: "sales",
  safety: "support",
  unsupported_service: "support",
  existing_order: "support",
  ai_failure: "support",
};

export const askContact = (lang: Lang, needName: boolean, needPhone: boolean) =>
  t(
    lang,
    needName && needPhone ? "تمام، شكرًا. شو اسمك الكريم ورقم التواصل المفضل؟" : needName ? "تمام، شكرًا. شو اسمك الكريم؟" : needPhone ? "تمام، شكرًا. شو رقم التواصل المفضل؟" : "تمام، شكرًا. بكمل معك هون.",
    needName && needPhone ? "Thank you. May I have your name and preferred contact number?" : needName ? "Thank you. May I have your name?" : needPhone ? "Thank you. What is your preferred contact number?" : "Thank you. I'll continue here with you.",
  );
