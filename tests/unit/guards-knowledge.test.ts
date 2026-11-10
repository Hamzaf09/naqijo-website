import { describe, expect, it } from "vitest";
import { checkReply, pricesIn } from "@/agent/guards";
import { allowedPrices, buildContext, renderContext, retrieve, type KbItem } from "@/agent/knowledge";

const offer = (key: string, price: number, extra: Partial<NonNullable<KbItem["offer"]>> = {}): KbItem => ({
  id: `offer:${key}`, kind: "offer", category: "price", availability: "available", alwaysInclude: false, keywords: "",
  title: { ar: key === "m" ? "صيانة فلتر" : "فلتر سبع مراحل", en: key === "m" ? "Filter maintenance" : "Seven-stage filter" },
  content: { ar: "", en: "" },
  offer: { key, priceJOD: price, installationIncluded: "no", scope: { ar: "", en: "" }, installationNote: { ar: "", en: "" }, warranty: { ar: "", en: "" }, accessories: { ar: "", en: "" }, installmentsAllowed: false, ...extra },
});
const kb = (id: string, title: string, content: string, availability: KbItem["availability"] = "n/a", category = "product"): KbItem => ({
  id, kind: "kb", category, title: { ar: title, en: title }, content: { ar: content, en: content }, keywords: "", availability, alwaysInclude: false,
});

describe("price guard", () => {
  const ctx = [offer("m", 35), offer("f", 160)];
  it("extracts prices in Arabic and English forms", () => {
    expect(pricesIn("السعر 160 دينار و 35 JOD و٤٥ د.أ")).toEqual(expect.arrayContaining([160, 35]));
    expect(pricesIn("JOD 12.5")).toEqual([12.5]);
  });
  it("allows only approved offer prices", () => {
    expect(checkReply({ reply: "الفلتر بـ 160 دينار", context: ctx, expectsHandoff: false })).toEqual([]);
    expect(checkReply({ reply: "الفلتر بـ 150 دينار", context: ctx, expectsHandoff: false })).toContain("price_not_approved:150");
    expect(checkReply({ reply: "It costs 99 JOD", context: ctx, expectsHandoff: false })).toContain("price_not_approved:99");
  });
  it("collects allowed prices from approved text too", () => {
    expect(allowedPrices([kb("kb:1", "x", "سعر الزيارة 20 دينار")])).toContain(20);
  });
});

describe("commitment & claim guards", () => {
  const ctx = [offer("f", 160)];
  const v = (reply: string, context = ctx) => checkReply({ reply, context, expectsHandoff: false });
  it("blocks unapproved free installation / warranty / installments / accessories", () => {
    expect(v("التركيب مجاني")).toContain("unapproved_free");
    expect(v("الفلتر عليه ضمان سنتين")).toContain("unapproved_warranty");
    expect(v("بنقدر نعمل تقسيط")).toContain("unapproved_installments");
    expect(v("with free accessories")).toEqual(expect.arrayContaining(["unapproved_free", "unapproved_accessories"]));
  });
  it("allows them only when the approved context says so", () => {
    const ctx2 = [offer("f", 160, { warranty: { ar: "ضمان سنة على الجهاز", en: "" } })];
    expect(v("الجهاز عليه ضمان", ctx2)).not.toContain("unapproved_warranty");
  });
  it("blocks availability claims for unconfirmed products", () => {
    const unconfirmed = [kb("kb:1", "مليّن", "فئة منتجات", "unconfirmed")];
    expect(v("المليّن متوفر عندنا", unconfirmed)).toContain("availability_not_confirmed");
    expect(v("هاي الفئة ضمن الكتالوج والفريق بيأكد التوفر", unconfirmed)).toEqual([]);
  });
  it("blocks claims that the model booked/confirmed/forwarded", () => {
    expect(v("حجزت لك موعد")).toContain("action_claim");
    expect(v("تم تأكيد موعدك")).toContain("action_claim");
    expect(v("I have booked your appointment")).toContain("action_claim");
    expect(v("بقدر أسجل طلبك للفريق إذا بتحب")).not.toContain("action_claim");
  });
  it("blocks claiming to be human; rejects empty replies", () => {
    expect(v("أنا موظف في الشركة")).toContain("claims_human");
    expect(v("   ")).toContain("empty_reply");
  });
});

describe("retrieval over approved knowledge", () => {
  const items = [
    kb("kb:ro", "فلاتر التناضح العكسي سبع مراحل", "فئة ضمن الكتالوج"),
    kb("kb:soft", "مليّنات المياه", "فئة ضمن الكتالوج"),
    kb("kb:contact", "بيانات التواصل", "هاتف وعنوان", "n/a", "company"),
    offer("f", 160),
  ];
  it("ranks the relevant entry first (Arabic clitics tolerated)", () => {
    const r = retrieve(items, "عندكم فلتر ٧ مراحل للمطبخ؟", "product_inquiry");
    expect(r[0].item.id).toBe("kb:ro");
  });
  it("price inquiries surface active offers", () => {
    expect(retrieve(items, "بكم فلتر سبع مراحل", "price_inquiry").map((s) => s.item.id)).toContain("offer:f");
  });
  it("returns nothing for unrelated text and renders the unknowns explicitly", () => {
    expect(retrieve(items, "كيف الطقس اليوم", "unsupported")).toHaveLength(0);
    const text = renderContext([offer("f", 160)], "ar");
    expect(text).toContain("160 JOD");
    expect(text).toContain("Approved scope: NOT PROVIDED");
    expect(text).toContain("Installation: NOT included");
    expect(text).toContain("Warranty: none approved");
    expect(buildContext(items, "كيف الطقس", "unsupported")).toHaveLength(0);
  });
  it("unconfirmed availability is spelled out for the model", () => {
    expect(renderContext([kb("kb:1", "مليّن", "x", "unconfirmed")], "ar")).toMatch(/NOT CONFIRMED/);
  });
});
