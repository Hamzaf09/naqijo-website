"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Check,
  MessageCircle,
  Mail,
  Home,
  Wrench,
  PackagePlus,
  Compass,
  Sparkles,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/ui/button";
import { cn } from "@/lib/utils";

/** Contact facts resolved server-side from the CMS Settings global. */
export interface RequestFlowContact {
  whatsapp: string;
  email: string;
  brandName: string;
}

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
  invalidEmail: string;
  successTitle: string;
  successBody: string;
  continueWhatsapp: string;
  returnHome: string;
};

/** Icon per request intent, with a graceful fallback. */
const intentIcons: Record<string, LucideIcon> = {
  purchase: PackagePlus,
  maintenance: Wrench,
  consultation: Compass,
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

export function RequestFlow({
  dict,
  locale,
  contact,
}: {
  dict: Dict;
  locale: string;
  contact: RequestFlowContact;
}) {
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [waUrl, setWaUrl] = useState<string | null>(null);
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
      `${L ? "طلب جديد من الموقع" : "New website request"} — ${contact.brandName}`,
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

  const whatsAppUrl = (v: FormValues) =>
    `https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}?text=${encodeURIComponent(compose(v))}`;

  // Primary: validate, prepare the WhatsApp link, then show the success screen
  // (no immediate redirect — the visitor continues from there).
  const goWhatsApp = handleSubmit((v) => {
    setWaUrl(whatsAppUrl(v));
    setDone(true);
  });

  // Secondary: open the mail client with the request, then show success.
  const goEmail = handleSubmit((v) => {
    const subject = locale === "ar" ? "طلب استشارة من الموقع" : "Website request";
    setWaUrl(whatsAppUrl(v));
    window.open(
      `mailto:${contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(compose(v))}`,
      "_self",
    );
    setDone(true);
  });

  const next = async () => {
    const fields: (keyof FormValues)[] = step === 0 ? ["intent"] : step === 1 ? [] : ["name", "phone"];
    if (await trigger(fields)) setStep((s) => Math.min(s + 1, 2));
  };

  // ── Success screen ─────────────────────────────────────────
  if (done) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-border bg-surface p-8 text-center shadow-[var(--shadow-md)] sm:p-12">
        <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--success)_18%,transparent)]">
          <Check className="size-10 text-success" aria-hidden strokeWidth={2.5} />
        </div>
        <h3 className="mt-7 text-2xl font-semibold tracking-tight text-fg">{dict.successTitle}</h3>
        <p className="mx-auto mt-3 max-w-[42ch] leading-relaxed text-fg-muted">{dict.successBody}</p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          {waUrl ? (
            <Button
              type="button"
              variant="gold"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => window.open(waUrl, "_blank", "noopener,noreferrer")}
            >
              <MessageCircle className="size-5" aria-hidden />
              {dict.continueWhatsapp}
            </Button>
          ) : null}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => {
              window.location.href = `/${locale}`;
            }}
          >
            <Home className="size-5" aria-hidden />
            {dict.returnHome}
          </Button>
        </div>
      </div>
    );
  }

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
          <p className="mb-5 text-sm font-medium text-fg">{dict.intentLabel}</p>
          <div className="grid gap-4 sm:grid-cols-3">
            {dict.intents.map((it) => {
              const Icon = intentIcons[it.value] ?? Sparkles;
              const selected = intent === it.value;
              return (
                <button
                  key={it.value}
                  type="button"
                  onClick={() => setValue("intent", it.value, { shouldValidate: true })}
                  aria-pressed={selected}
                  className={cn(
                    "group relative flex flex-col rounded-[var(--radius-lg)] border p-5 text-start outline-none transition-all duration-200",
                    "hover:-translate-y-0.5 hover:shadow-[var(--shadow-sm)] focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--ring)_40%,transparent)]",
                    selected
                      ? "border-primary bg-bg-blue shadow-[var(--shadow-sm)] ring-2 ring-[color-mix(in_srgb,var(--primary)_22%,transparent)]"
                      : "border-border hover:border-border-strong",
                  )}
                >
                  {/* Selected check badge */}
                  <span
                    aria-hidden
                    className={cn(
                      "absolute end-3 top-3 flex size-6 items-center justify-center rounded-full bg-primary text-primary-fg transition-all duration-200",
                      selected ? "scale-100 opacity-100" : "scale-50 opacity-0",
                    )}
                  >
                    <Check className="size-3.5" strokeWidth={3} />
                  </span>
                  <span
                    className={cn(
                      "flex size-11 items-center justify-center rounded-[var(--radius-md)] transition-colors",
                      selected
                        ? "bg-[color-mix(in_srgb,var(--primary)_15%,transparent)] text-primary"
                        : "bg-bg-subtle text-fg-muted group-hover:text-primary",
                    )}
                  >
                    <Icon className="size-5" aria-hidden />
                  </span>
                  <span className="mt-4 block font-semibold text-fg">{it.t}</span>
                  <span className="mt-1.5 block text-sm leading-relaxed text-fg-muted">{it.d}</span>
                </button>
              );
            })}
          </div>
          {errors.intent ? <p className="mt-3 text-sm text-danger">{dict.required}</p> : null}
        </div>
      ) : null}

      {/* Step 2 — property */}
      {step === 1 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-fg">{dict.propTypeLabel}</span>
            <div className="relative">
              <select
                className={cn(fieldClass, "cursor-pointer appearance-none pe-11")}
                {...register("propertyType")}
              >
                <option value="">—</option>
                {dict.propTypes.map((p) => (
                  <option key={p.value} value={p.value}>{p.label}</option>
                ))}
              </select>
              <ChevronDown
                aria-hidden
                className="pointer-events-none absolute end-4 top-1/2 size-4 -translate-y-1/2 text-fg-subtle"
              />
            </div>
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-fg">{dict.cityLabel}</span>
            <input className={fieldClass} autoComplete="address-level2" placeholder={dict.cityPlaceholder} {...register("city")} />
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-fg">{dict.notesLabel}</span>
            <textarea
              rows={6}
              className={cn(fieldClass, "h-auto min-h-36 resize-y py-3 leading-relaxed")}
              placeholder={dict.notesPlaceholder}
              {...register("notes")}
            />
          </label>
        </div>
      ) : null}

      {/* Step 3 — personal + finish */}
      {step === 2 ? (
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-fg">{dict.nameLabel}</span>
            <input className={fieldClass} autoComplete="name" placeholder={dict.namePlaceholder} {...register("name")} />
            {errors.name ? <p className="mt-2 text-sm text-danger">{dict.required}</p> : null}
          </label>
          <label className="block">
            <span className="mb-2 block text-sm font-medium text-fg">{dict.phoneLabel}</span>
            <input className={fieldClass} type="tel" inputMode="tel" autoComplete="tel" dir="ltr" placeholder="+962 79 000 0000" {...register("phone")} />
            {errors.phone ? <p className="mt-2 text-sm text-danger">{dict.required}</p> : null}
          </label>
          <label className="block sm:col-span-2">
            <span className="mb-2 block text-sm font-medium text-fg">
              {dict.emailLabel} <span className="text-fg-subtle">{dict.emailOptional}</span>
            </span>
            <input className={fieldClass} type="email" autoComplete="email" dir="ltr" placeholder="name@email.com" {...register("email")} />
            {errors.email ? <p className="mt-2 text-sm text-danger">{dict.invalidEmail}</p> : null}
          </label>

          <div className="mt-1 rounded-[var(--radius-lg)] border border-border bg-[color-mix(in_srgb,var(--bg-subtle)_55%,transparent)] p-5 sm:col-span-2">
            <p className="font-semibold text-fg">{dict.finishTitle}</p>
            <p className="mb-5 mt-1 text-sm text-fg-muted">{dict.finishHint}</p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button type="button" variant="gold" size="lg" className="w-full sm:flex-1" onClick={goWhatsApp}>
                <MessageCircle className="size-5" aria-hidden />
                {dict.whatsapp}
              </Button>
              <Button type="button" variant="outline" size="lg" className="w-full sm:w-auto" onClick={goEmail}>
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
            className="text-sm font-medium text-fg-muted transition-colors hover:text-fg disabled:opacity-0"
          >
            {dict.back}
          </button>
          <Button type="button" size="lg" onClick={next}>
            {dict.next}
          </Button>
        </div>
      ) : (
        <div className="mt-8">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="text-sm font-medium text-fg-muted transition-colors hover:text-fg"
          >
            {dict.back}
          </button>
        </div>
      )}
    </div>
  );
}
