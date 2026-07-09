"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Check, MessageCircle, Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";

type Dict = {
  steps: string[];
  intentLabel: string;
  intents: { value: string; t: string; d: string }[];
  propTypeLabel: string;
  propTypes: { value: string; label: string }[];
  cityLabel: string;
  cityPlaceholder: string;
  notesLabel: string;
  notesPlaceholder: string;
  nameLabel: string;
  namePlaceholder: string;
  phoneLabel: string;
  emailLabel: string;
  emailOptional: string;
  back: string;
  next: string;
  finishTitle: string;
  finishHint: string;
  whatsapp: string;
  email: string;
  required: string;
};

const schema = z.object({
  intent: z.string().min(1),
  propertyType: z.string().optional(),
  city: z.string().optional(),
  notes: z.string().optional(),
  name: z.string().min(2),
  phone: z.string().min(6),
  email: z.string().email().optional().or(z.literal("")),
});
type FormValues = z.infer<typeof schema>;

const fieldClass =
  "w-full rounded-[var(--radius-md)] border border-border-strong bg-surface px-4 h-12 text-fg placeholder:text-fg-subtle transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--ring)_35%,transparent)]";

export function RequestFlow({ dict, locale }: { dict: Dict; locale: string }) {
  const [step, setStep] = useState(0);
  const {
    register,
    handleSubmit,
    setValue,
    trigger,
    control,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { intent: "", propertyType: "", city: "", notes: "", name: "", phone: "", email: "" },
    mode: "onTouched",
  });

  const intent = useWatch({ control, name: "intent" });

  const compose = (v: FormValues) => {
    const intentLabel = dict.intents.find((i) => i.value === v.intent)?.t ?? v.intent;
    const propLabel = dict.propTypes.find((p) => p.value === v.propertyType)?.label ?? v.propertyType;
    const L = locale === "ar";
    return [
      `${L ? "طلب جديد من الموقع" : "New website request"} — ${siteConfig.brand[locale as "ar" | "en"]}`,
      `${L ? "النوع" : "Type"}: ${intentLabel}`,
      propLabel ? `${L ? "العقار" : "Property"}: ${propLabel}` : "",
      v.city ? `${L ? "المدينة" : "City"}: ${v.city}` : "",
      `${L ? "الاسم" : "Name"}: ${v.name}`,
      `${L ? "الهاتف" : "Phone"}: ${v.phone}`,
      v.email ? `${L ? "البريد" : "Email"}: ${v.email}` : "",
      v.notes ? `${L ? "ملاحظات" : "Notes"}: ${v.notes}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  };

  const goWhatsApp = handleSubmit((v) => {
    const url = `https://wa.me/${siteConfig.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(compose(v))}`;
    window.open(url, "_blank", "noopener,noreferrer");
  });
  const goEmail = handleSubmit((v) => {
    const subject = locale === "ar" ? "طلب استشارة من الموقع" : "Website request";
    window.open(
      `mailto:${siteConfig.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose(v))}`,
      "_self",
    );
  });

  const next = async () => {
    const fields: (keyof FormValues)[] = step === 0 ? ["intent"] : step === 1 ? [] : ["name", "phone"];
    if (await trigger(fields)) setStep((s) => Math.min(s + 1, 2));
  };

  return (
    <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-6 shadow-[var(--shadow-md)] sm:p-9">
      {/* Stepper */}
      <ol className="mb-9 flex items-center gap-3">
        {dict.steps.map((label, i) => (
          <li key={label} className="flex flex-1 items-center gap-3">
            <span
              className={cn(
                "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-colors",
                i < step
                  ? "bg-primary text-primary-fg"
                  : i === step
                    ? "bg-gold text-[var(--accent-fg)]"
                    : "bg-bg-subtle text-fg-subtle",
              )}
            >
              {i < step ? <Check className="size-4" /> : i + 1}
            </span>
            <span className={cn("hidden text-sm sm:block", i === step ? "text-fg" : "text-fg-subtle")}>
              {label}
            </span>
            {i < dict.steps.length - 1 ? <span className="h-px flex-1 bg-border" /> : null}
          </li>
        ))}
      </ol>

      {/* Step 1 — intent */}
      {step === 0 ? (
        <div>
          <p className="mb-4 text-sm font-medium text-fg">{dict.intentLabel}</p>
          <div className="grid gap-3 sm:grid-cols-3">
            {dict.intents.map((it) => (
              <button
                key={it.value}
                type="button"
                onClick={() => setValue("intent", it.value, { shouldValidate: true })}
                aria-pressed={intent === it.value}
                className={cn(
                  "rounded-[var(--radius-lg)] border p-5 text-start transition-all",
                  intent === it.value
                    ? "border-primary bg-bg-blue shadow-[var(--shadow-sm)]"
                    : "border-border hover:border-border-strong",
                )}
              >
                <span aria-hidden className="block size-2 rounded-full rounded-tr-none bg-gold" />
                <span className="mt-4 block font-medium text-fg">{it.t}</span>
                <span className="mt-1 block text-sm text-fg-muted">{it.d}</span>
              </button>
            ))}
          </div>
          {errors.intent ? <p className="mt-3 text-sm text-danger">{dict.required}</p> : null}
        </div>
      ) : null}

      {/* Step 2 — property */}
      {step === 1 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-fg">{dict.propTypeLabel}</span>
            <select className={fieldClass} {...register("propertyType")}>
              <option value="">—</option>
              {dict.propTypes.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-fg">{dict.cityLabel}</span>
            <input className={fieldClass} autoComplete="address-level2" placeholder={dict.cityPlaceholder} {...register("city")} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-fg">{dict.notesLabel}</span>
            <textarea rows={4} className={cn(fieldClass, "h-auto py-3")} placeholder={dict.notesPlaceholder} {...register("notes")} />
          </label>
        </div>
      ) : null}

      {/* Step 3 — personal + finish */}
      {step === 2 ? (
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-fg">{dict.nameLabel}</span>
            <input className={fieldClass} autoComplete="name" placeholder={dict.namePlaceholder} {...register("name")} />
            {errors.name ? <p className="mt-2 text-sm text-danger">{dict.required}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-fg">{dict.phoneLabel}</span>
            <input className={fieldClass} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="+962 7" {...register("phone")} />
            {errors.phone ? <p className="mt-2 text-sm text-danger">{dict.required}</p> : null}
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-fg">
              {dict.emailLabel} <span className="text-fg-subtle">{dict.emailOptional}</span>
            </span>
            <input className={fieldClass} type="email" autoComplete="email" dir="ltr" placeholder="name@email.com" {...register("email")} />
          </label>

          <div className="sm:col-span-2">
            <p className="mb-1 font-medium text-fg">{dict.finishTitle}</p>
            <p className="mb-5 text-sm text-fg-muted">{dict.finishHint}</p>
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="gold" size="lg" onClick={goWhatsApp}>
                <MessageCircle className="size-5" aria-hidden />
                {dict.whatsapp}
              </Button>
              <Button type="button" variant="outline" size="lg" onClick={goEmail}>
                <Mail className="size-5" aria-hidden />
                {dict.email}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Nav */}
      {step < 2 ? (
        <div className="mt-9 flex items-center justify-between">
          <button
            type="button"
            onClick={() => setStep((s) => Math.max(s - 1, 0))}
            disabled={step === 0}
            className="text-sm font-medium text-fg-muted disabled:opacity-0"
          >
            {dict.back}
          </button>
          <Button type="button" onClick={next}>
            {dict.next}
          </Button>
        </div>
      ) : (
        <div className="mt-8">
          <button type="button" onClick={() => setStep(1)} className="text-sm font-medium text-fg-muted">
            {dict.back}
          </button>
        </div>
      )}
    </div>
  );
}
