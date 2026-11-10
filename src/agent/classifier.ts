import { detectLang, hasAny, normalize } from "./text";
import type { HandoffReason, Intent, Lang } from "./types";

/**
 * Deterministic first-pass understanding of a customer message (Jordanian
 * Arabic + English). It never answers the customer; it (1) hints the LLM,
 * (2) forces escalation for cases that must never depend on model judgement
 * and (3) powers the offline "rules" provider used without an AI key.
 */

const HUMAN = [
  "موظف", "شخص حقيقي", "انسان", "بشري", "ممثل", "مسؤول", "مدير", "خدمه العملاء",
  "احكي مع", "احكي مع شخص", "اتكلم مع", "بدي اكلم", "بدي احكي", "كلمني", "كلموني",
  "اتصلوا", "اتصل فيني", "اتصلو", "رقم المبيعات",
  "human", "real person", "representative", "agent", "speak to someone", "talk to someone",
  "talk to a person", "call me", "customer service",
];
const COMPLAINT = [
  "شكوي", "اشتكي", "سيء", "سيئه", "زفت", "مش راضي", "مو راضي", "غير راضي", "ما رضيت",
  "تاخرتوا", "تاخرتو", "نصب", "نصابين", "احتيال", "استرجاع", "ارجاع", "بدي فلوسي", "مستاء",
  "اسوا", "ما حدا رد", "ما حدا بيرد", "استهتار", "غلط منكم", "خربتو", "خربتوا",
  "complaint", "unacceptable", "terrible", "worst", "refund", "angry", "disappointed", "scam",
];
const DISCOUNT = [
  "خصم", "تخفيض", "اخر سعر", "افضل سعر", "اقل سعر", "نزلولي", "تنزلولي", "بتنزلوا", "اسعار خاصه",
  "عرض خاص", "تقسيط", "اقساط", "بلاش", "مجاني", "مجانا", "ببلاش",
  "discount", "cheaper", "best price", "lowest price", "negotiate", "installment", "free",
];
const WARRANTY = ["ضمان", "كفاله", "warranty", "guarantee"];
const PROBLEM = [
  "خربان", "خربت", "عطلان", "تعطل", "ما اشتغل", "ما بشتغل", "ما بيشتغل", "مشكله", "رفضتوا", "رفضو",
  "ما بتغطي", "منتهي", "انتهي", "broken", "not working", "refused", "denied", "expired", "failed",
];
const SAFETY = [
  "غاز", "تسريب غاز", "ماس كهربايي", "ماس كهربا", "ماس كهرباء", "صعقه", "بتضرب كهربا", "حريق", "دخان", "شرارات", "فيضان",
  "gas", "electric shock", "short circuit", "fire", "smoke", "sparks", "flood",
];
/** Services the company has NOT confirmed — never answer them from assumptions. */
const UNCONFIRMED_SERVICE = [
  "بويلر", "سخان", "سخانات", "مسبح", "حمام سباحه", "طلمبه تدوير", "مضخه تدوير", "تدفئه", "تدفيه",
  "boiler", "water heater", "swimming pool", "pool", "circulation pump", "heating",
];
const EXISTING = [
  "طلبي", "طلبيتي", "موعدي", "حجزي", "اللي حجزته", "اللي طلبته", "حجزت", "طلبت", "وين وصل",
  "متي بتجو", "متي رح تجو", "تاكيد الموعد", "اكد الموعد", "اكدوا", "my order", "my appointment",
  "my booking", "order status", "where is my order", "confirm my appointment",
];
const APPOINTMENT = [
  "بدي موعد", "احجز", "حجز", "زياره", "يجي الفني", "يجو الفني", "ياخذ موعد", "موعد صيانه", "فني", "كشف",
  "book", "appointment", "schedule", "technician visit", "send a technician",
];
const MAINTENANCE = [
  "صيانه", "تغيير فلاتر", "تغيير الفلاتر", "تبديل فلاتر", "تبديل الشمعات", "تغيير شمعات", "شمعات", "شمعه",
  "فحص", "كارتردج", "cartridge", "maintenance", "service", "filter change", "replace filter", "inspection",
];
const INSTALL = ["تركيب", "تنصيب", "تمديد", "install", "installation", "fitting"];
const TECHNICAL = [
  "ضغط", "ضعيف", "طعم", "ريحه", "رايحه", "تسرب", "بنقط", "بقطر", "صوت", "عطل", "ما بيشتغل", "ما بشتغل",
  "ما بنزل", "تعكير", "عكره", "رواسب", "مويه", "ماي", "نزل ماي",
  "pressure", "leak", "noise", "not working", "taste", "smell", "cloudy", "dripping", "no water",
];
const PRICE = [
  "سعر", "اسعار", "بكم", "كم سعر", "كم بتكلف", "كم بكلف", "كم الثمن", "تكلفه", "تكلف", "كم بيكلف", "اجره",
  "price", "cost", "how much", "pricing", "rate", "fee",
];
const PURCHASE = [
  "بدي اشتري", "بدي اطلب", "بدي فلتر", "بدي واحد", "اشتري", "شراء", "ابغي اطلب", "جاهز اطلب", "اتفقنا",
  "موافق على العرض", "اعتمد", "سجلوا طلبي", "سجلولي", "بدي احجز", "خذوني", "اطلب",
  "i want to buy", "i'll take", "i want to order", "place an order", "let's go", "sign me up", "buy",
];
const COMPARE = [
  "الفرق بين", "ايش الفرق", "شو الفرق", "افضل", "احسن", "مقارنه", "ايهم", "مين احسن", "شو الاحسن",
  "compare", "difference between", "which is better", " vs ", "versus",
];
const PRODUCT = [
  "فلتر", "فلاتر", "تحليه", "اسموزيس", "ro", "تناضح", "سوفتنر", "مليّن", "ملين", "كولر", "برادة", "برادات",
  "مضخه", "بوستر", "uv", "جامبو", "مركزي", "محطه", "منقي هواء", "مراحل", "7 مراحل", "سبع مراحل",
  "filter", "softener", "cooler", "dispenser", "pump", "booster", "purifier", "reverse osmosis", "cartridges",
  "منتج", "منتجات", "نوع", "اجهزه", "جهاز",
];
const GREETING = [
  "مرحبا", "اهلا", "السلام عليكم", "هلا", "هاي", "صباح الخير", "مساء الخير", "يعطيك العافيه", "سلام",
  "hello", "hi", "hey", "good morning", "good evening", "salam",
];
const OPT_OUT = [
  "لا تراسلوني", "لا ترسلوا", "ايقاف", "الغاء الاشتراك", "ما بدي رسايل", "stop", "unsubscribe", "opt out",
];
const YES = ["نعم", "ايوه", "اه", "اي", "موافق", "تمام", "اكيد", "ok", "okay", "yes", "sure", "yep", "yeah", "ايوا"];
const NO = ["لا", "ما بدي", "لا شكرا", "غير موافق", "مش موافق", "no", "nope", "no thanks", "ما بوافق"];

export interface Flags {
  humanRequest: boolean;
  complaint: boolean;
  discount: boolean;
  warranty: boolean;
  warrantyDispute: boolean;
  safety: boolean;
  existingOrder: boolean;
  appointmentRequest: boolean;
  unconfirmedService: boolean;
  optOut: boolean;
  yes: boolean;
  no: boolean;
}

export interface Classification {
  intent: Intent;
  lang: Lang;
  flags: Flags;
  /** Escalation the engine must perform no matter what the model says. */
  forcedHandoff: HandoffReason | null;
}

export function classify(text: string): Classification {
  const n = normalize(text);
  const lang = detectLang(text);
  const short = n.split(" ").length <= 3;

  const warranty = hasAny(n, WARRANTY);
  const complaint = hasAny(n, COMPLAINT);
  const flags: Flags = {
    humanRequest: hasAny(n, HUMAN),
    complaint,
    discount: hasAny(n, DISCOUNT),
    warranty,
    warrantyDispute: warranty && (hasAny(n, PROBLEM) || complaint),
    safety: hasAny(n, SAFETY),
    existingOrder: hasAny(n, EXISTING),
    appointmentRequest: hasAny(n, APPOINTMENT),
    unconfirmedService: hasAny(n, UNCONFIRMED_SERVICE),
    optOut: hasAny(n, OPT_OUT),
    yes: short && hasAny(n, YES) && !hasAny(n, NO),
    no: short && hasAny(n, NO),
  };

  let intent: Intent = "unsupported";
  if (flags.humanRequest) intent = "human_request";
  else if (flags.complaint || flags.warrantyDispute) intent = "complaint";
  else if (flags.existingOrder) intent = "existing_order";
  else if (hasAny(n, PURCHASE) && !hasAny(n, PRICE)) intent = "purchase_intent";
  else if (hasAny(n, PRICE) || flags.discount) intent = "price_inquiry";
  else if (hasAny(n, COMPARE)) intent = "product_comparison";
  else if (hasAny(n, INSTALL)) intent = "installation_inquiry";
  else if (hasAny(n, MAINTENANCE) || (flags.appointmentRequest && !hasAny(n, PRODUCT))) intent = "maintenance_request";
  else if (hasAny(n, TECHNICAL)) intent = "technical_support";
  else if (hasAny(n, PRODUCT)) intent = "product_inquiry";
  else if (hasAny(n, GREETING) && n.split(" ").length <= 6) intent = "greeting";

  let forcedHandoff: HandoffReason | null = null;
  if (flags.safety) forcedHandoff = "safety";
  else if (flags.humanRequest) forcedHandoff = "human_request";
  else if (flags.warrantyDispute) forcedHandoff = "warranty_dispute";
  else if (flags.complaint) forcedHandoff = "complaint";
  else if (flags.discount) forcedHandoff = "discount_request";
  else if (flags.existingOrder) {
    forcedHandoff = /موعد|appointment|booking|حجز/.test(n) ? "appointment_confirmation" : "existing_order";
  } else if (flags.unconfirmedService) forcedHandoff = "unsupported_service";

  return { intent, lang, flags, forcedHandoff };
}
