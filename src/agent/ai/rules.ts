import { normalize, tokens } from "../text";
import { pick, retrieve } from "../knowledge";
import { EMPTY_COLLECTED, type AiTurn, type Collected, type Lang } from "../types";
import type { AiProvider, TurnInput } from "./provider";
import { intro } from "../templates";

/**
 * Offline provider: no LLM, no network. Answers strictly by quoting approved
 * knowledge and offers, extracts a few qualification fields with simple
 * patterns, and asks the next missing question. Used (a) when no AI key is
 * configured, (b) in automated tests, (c) as an emergency fallback.
 */

const AMMAN_AREAS = [
  "خلدا", "الرابية", "عبدون", "دابوق", "الجبيهة", "صويلح", "تلاع العلي", "الشميساني", "جبل عمان", "ماركا",
  "طبربور", "مرج الحمام", "ناعور", "ابو نصير", "الصويفية", "دير غبار", "السابع", "الجاردنز", "الجندويل",
  "شفا بدران", "وادي صقره", "ضاحيه الرشيد", "الدوار", "الياسمين", "المدينه الرياضيه", "الجامعه", "الظهير",
  "khalda", "rabieh", "abdoun", "dabouq", "jubaiha", "sweileh", "tla al ali", "shmeisani", "marka",
  "tabarbour", "marj al hamam", "naour", "sweifieh", "dair ghbar", "gardens",
];

const SCOPE_Q = ["يشمل", "تشمل", "شو فيه", "شو بيشمل", "ايش يشمل", "تتضمن", "شو بتتضمن", "included", "includes", "what's included", "what is included"];
const INSTALL_Q = ["تركيب", "install", "installation"];

function extract(text: string, prior: Partial<Collected>): Collected {
  const out: Collected = { ...EMPTY_COLLECTED };
  const n = normalize(text);
  for (const a of AMMAN_AREAS) {
    const na = normalize(a);
    // tolerate a one-letter Arabic clitic (بخلدا, لعبدون, في/من are separate words)
    if ((` ${n} `).includes(` ${na} `) || /^[بلوفك]/.test(n.split(" ").find((w) => w.slice(1) === na) ?? "") ) {
      out.area = a;
      break;
    }
  }
  const phone = text.replace(/[٠-٩]/g, (d) => String(d.charCodeAt(0) - 0x0660)).match(/(?:\+?962|0)\s?7[789]\s?\d{3}\s?\d{4}/);
  if (phone) out.phone = phone[0].replace(/\s/g, "");
  const nm = text.match(/(?:اسمي|انا اسمي|my name is|i am|i'm)\s+([^\s,.،]+(?:\s[^\s,.،]+)?)/i);
  if (nm) out.name = nm[1];
  if (!prior.problem && /مشكل|ضعيف|تسرب|طعم|ريح|problem|leak|weak|taste/i.test(text)) out.problem = text.slice(0, 200);
  return out;
}

export class RulesProvider implements AiProvider {
  readonly name = "rules";

  async generate(i: TurnInput): Promise<AiTurn> {
    const lang: Lang = i.lang;
    const { intent } = i.classification;
    const collected = extract(i.latest, i.known);
    const base = (reply: string, extra: Partial<AiTurn> = {}): AiTurn => ({
      reply,
      intent,
      language: lang,
      handoff: { needed: false, reason: "none" },
      consent: i.consent === "requested" ? (i.classification.flags.yes ? "granted" : i.classification.flags.no ? "declined" : "none") : "none",
      collected,
      unanswered_question: "",
      sources_used: [],
      appointment_requested: i.classification.flags.appointmentRequest,
      ...extra,
    });

    if (intent === "greeting" && i.isFirstReply) return base(intro(lang));
    if (intent === "greeting") {
      return base(lang === "ar" ? "أهلًا فيك، كيف بنقدر نساعدك؟" : "Hello! How can we help you?");
    }

    const hits = retrieve(i.context, i.latest, intent, 3);
    const top = hits[0]?.item;
    if (
      !i.known.product_interest &&
      top &&
      (top.offer || top.category === "product") &&
      ["product_inquiry", "price_inquiry", "purchase_intent", "product_comparison", "installation_inquiry"].includes(intent)
    ) {
      collected.product_interest = pick(top.title, lang);
    }
    const n = normalize(i.latest);
    const offer = i.context.find((c) => c.offer && hits.some((h) => h.item.id === c.id))?.offer ?? undefined;
    const offerItem = offer ? i.context.find((c) => c.offer === offer)! : undefined;

    // Offer questions: price / scope / installation come ONLY from the offer record.
    if (offer && offerItem) {
      const title = pick(offerItem.title, lang);
      const asksScope = SCOPE_Q.some((p) => n.includes(normalize(p)));
      const asksInstall = INSTALL_Q.some((p) => n.includes(normalize(p)));
      const priceLine =
        lang === "ar"
          ? `${title}: ${offer.priceJOD} دينار أردني (السعر المعلن).`
          : `${title}: ${offer.priceJOD} JOD (advertised price).`;
      if (asksScope) {
        const scope = pick(offer.scope, lang);
        if (scope) return base(`${priceLine} ${scope}`, { sources_used: [offerItem.id] });
        return base(
          lang === "ar"
            ? `${priceLine} بس تفاصيل اللي بيشمله العرض لسا مش معتمدة عندي.`
            : `${priceLine} The exact scope of the offer isn't approved on my side yet.`,
          {
            sources_used: [offerItem.id],
            unanswered_question: i.latest.slice(0, 300),
            handoff: { needed: true, reason: "missing_info" },
          },
        );
      }
      if (asksInstall) {
        const note = pick(offer.installationNote, lang);
        const line =
          offer.installationIncluded === "no"
            ? lang === "ar" ? "التركيب مش مشمول بالعرض المعلن." : "Installation is not included in the advertised offer."
            : offer.installationIncluded === "yes"
              ? lang === "ar" ? "التركيب مشمول بالعرض." : "Installation is included."
              : "";
        if (line) return base(`${priceLine} ${line} ${note}`.trim(), { sources_used: [offerItem.id] });
        return base(
          lang === "ar"
            ? "تفاصيل التركيب لسا مش معتمدة عندي."
            : "Installation details aren't approved on my side yet.",
          {
            unanswered_question: i.latest.slice(0, 300),
            handoff: { needed: true, reason: "missing_info" },
            sources_used: [offerItem.id],
          },
        );
      }
      const next = nextQuestion(i, collected, lang);
      return base(`${priceLine}${next ? " " + next : ""}`, { sources_used: [offerItem.id] });
    }

    if (top && top.kind === "kb" && hits[0].score >= 3) {
      let body = pick(top.content, lang);
      if (body.length > 420) body = body.slice(0, body.lastIndexOf(" ", 420)) + "…";
      const caveat =
        top.availability === "unconfirmed"
          ? lang === "ar"
            ? " (التوفر والأسعار بتتأكد من الفريق.)"
            : " (Availability and pricing are confirmed by the team.)"
          : "";
      const next = nextQuestion(i, collected, lang);
      return base(`${body}${caveat}${next ? " " + next : ""}`, { sources_used: [top.id] });
    }

    // The customer only supplied details (area, phone, problem...) → acknowledge and move on, don't treat as an unanswerable question.
    const gaveInfo = Boolean(collected.area || collected.phone || collected.name || collected.problem || collected.product_interest);
    if (intent === "purchase_intent" || intent === "maintenance_request" || (gaveInfo && ["unsupported", "technical_support"].includes(intent))) {
      const next = nextQuestion(i, collected, lang);
      return base(
        next || (lang === "ar" ? "تمام، شكرًا على المعلومات." : "Thank you, noted."),
        {},
      );
    }

    // nothing approved matched → be honest, record the gap
    return base(
      lang === "ar"
        ? "ما عندي معلومة معتمدة كافية عن هالسؤال، وما بحب أعطيك معلومة مش دقيقة."
        : "I don't have enough approved information on this and don't want to guess.",
      { unanswered_question: i.latest.slice(0, 300), handoff: { needed: true, reason: "missing_info" } },
    );
  }
}

/** The single next qualification question (never repeats known fields). */
export function nextQuestion(i: TurnInput, c: Collected, lang: Lang): string {
  const have = (k: keyof Collected) => Boolean(i.known[k] || c[k]);
  const maintenance = i.classification.intent === "maintenance_request" || i.classification.intent === "technical_support";
  if (!have("area")) {
    return lang === "ar" ? "ممكن تحكيلنا بأي منطقة ساكن؟ عشان نتأكد من توفر الخدمة عندك." : "Which area do you live in, so we can check service availability?";
  }
  if (maintenance) {
    if (!have("equipment_type")) return lang === "ar" ? "شو نوع الجهاز اللي بدك صيانته؟" : "What type of equipment needs service?";
    if (!have("problem")) return lang === "ar" ? "ممكن تشرحلي المشكلة بشكل مختصر؟" : "Could you briefly describe the problem?";
    return "";
  }
  if (!have("product_interest")) return lang === "ar" ? "أي منتج أو خدمة مهتم فيها؟" : "Which product or service are you interested in?";
  if (!have("home_type")) return lang === "ar" ? "البيت شقة ولا فيلا؟" : "Is it an apartment or a villa?";
  return tokens(i.latest).length ? "" : "";
}
