import { describe, expect, it } from "vitest";
import { classify } from "@/agent/classifier";
import { detectLang, normalize, tokens } from "@/agent/text";

describe("text normalization", () => {
  it("unifies alef/ya/ta-marbuta, strips tashkeel, maps Arabic-Indic digits", () => {
    expect(normalize("أَهْلاً بِكُمْ ٣٥ دينار")).toBe("اهلا بكم 35 دينار");
    expect(normalize("المياه")).toBe("المياه");
    expect(normalize("شكوى")).toBe("شكوي");
  });
  it("stems Arabic clitics so الفلاتر ≈ فلاتر", () => {
    expect(tokens("الفلاتر")).toEqual(tokens("فلاتر"));
    expect(tokens("للفلتر")[0]).toBe("فلتر");
  });
  it("detects language", () => {
    expect(detectLang("بدي فلتر")).toBe("ar");
    expect(detectLang("I need a filter")).toBe("en");
  });
});

describe("intent classifier (Jordanian Arabic + English)", () => {
  const cases: [string, string][] = [
    ["مرحبا", "greeting"],
    ["بكم الفلتر سبع مراحل؟", "price_inquiry"],
    ["كم سعر التركيب", "price_inquiry"],
    ["شو الفرق بين الفلتر الرقمي والعادي", "product_comparison"],
    ["بدي صيانة للفلتر عندي", "maintenance_request"],
    ["بدي اشتري فلتر ٧ مراحل", "purchase_intent"],
    ["الضغط ضعيف بالمطبخ", "technical_support"],
    ["بدي احكي مع موظف", "human_request"],
    ["أنا مش راضي عن الخدمة", "complaint"],
    ["وين وصل طلبي؟", "existing_order"],
    ["do you install water softeners?", "installation_inquiry"],
    ["I want to talk to a real person", "human_request"],
    ["what is the price of the RO filter", "price_inquiry"],
  ];
  for (const [text, intent] of cases) {
    it(`"${text}" → ${intent}`, () => expect(classify(text).intent).toBe(intent));
  }

  it("forces escalation for sensitive cases regardless of model", () => {
    expect(classify("في ريحة غاز عندي").forcedHandoff).toBe("safety");
    expect(classify("بدي خصم على الفلتر").forcedHandoff).toBe("discount_request");
    expect(classify("الضمان انتهى وما رضيتوا تصلحوه").forcedHandoff).toBe("warranty_dispute");
    expect(classify("بدي أكد موعدي").forcedHandoff).toBe("appointment_confirmation");
    expect(classify("عندي مشكلة ببويلر السخان").forcedHandoff).toBe("unsupported_service");
    expect(classify("هذا نصب واحتيال").forcedHandoff).toBe("complaint");
    expect(classify("بكم الفلتر؟").forcedHandoff).toBeNull();
  });

  it("does not treat a plain warranty question as a dispute", () => {
    const c = classify("كم مدة الضمان على الفلتر؟");
    expect(c.flags.warranty).toBe(true);
    expect(c.forcedHandoff).toBeNull();
  });

  it("yes/no only for short replies", () => {
    expect(classify("نعم").flags.yes).toBe(true);
    expect(classify("لا").flags.no).toBe(true);
    expect(classify("نعم بدي أعرف شو الفرق بين النوعين بالتفصيل").flags.yes).toBe(false);
  });
});
