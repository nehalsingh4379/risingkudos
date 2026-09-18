"use client";

import { FormEvent, useState } from "react";
import { subjects } from "@/content/site";
import { cn } from "@/lib/cn";

/* ── Step definitions ─────────────────────────────────────────────────── */
const STEPS = ["About your child", "Learning goals", "Your details"] as const;
type Step = 0 | 1 | 2;

const yearGroups = [
  "Year 3", "Year 4", "Year 5", "Year 6",
  "Year 7", "Year 8", "Year 9",
  "Year 10 (GCSE)", "Year 11 (GCSE)",
];

const frequencies = ["Once a week", "Twice a week", "Flexible / not sure"];

const initial = {
  childName: "",
  yearGroup: "",
  subjects: [] as string[],
  goals: "",
  frequency: "",
  parentName: "",
  email: "",
  phone: "",
  consent: false,
};

type FormValues = typeof initial;

/* ── Premium field wrapper ────────────────────────────────────────────── */
function Field({
  label,
  hint,
  children,
  error,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-ink">{label}</label>
        {hint && <span className="text-xs text-ink-soft/60">{hint}</span>}
      </div>
      <div
        className={cn(
          "[&_.field]:w-full [&_.field]:rounded-xl [&_.field]:border [&_.field]:bg-cream/30 [&_.field]:px-4 [&_.field]:py-3 [&_.field]:text-base sm:[&_.field]:text-sm [&_.field]:text-ink [&_.field]:outline-none [&_.field]:transition-all [&_.field]:duration-200 [&_.field]:placeholder:text-ink-soft/40",
          error
            ? "[&_.field]:border-coral/60 [&_.field]:bg-coral/5 [&_.field]:ring-1 [&_.field]:ring-coral/30"
            : "[&_.field]:border-ink/10 [&_.field]:hover:border-ink/20 [&_.field]:focus-within:border-teal [&_.field]:focus-within:bg-white [&_.field]:focus-within:shadow-[0_0_0_3px_rgba(60,122,110,0.12)]",
        )}
      >
        {children}
      </div>
      {error && (
        <p className="text-xs text-coral flex items-center gap-1">
          <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          This field is required
        </p>
      )}
    </div>
  );
}

/* ── Step 1 — About your child ───────────────────────────────────────── */
function StepChild({
  values,
  errors,
  onChange,
}: {
  values: FormValues;
  errors: string[];
  onChange: (patch: Partial<FormValues>) => void;
}) {
  function toggleSubject(slug: string) {
    const next = values.subjects.includes(slug)
      ? values.subjects.filter((s) => s !== slug)
      : [...values.subjects, slug];
    onChange({ subjects: next });
  }

  return (
    <div className="space-y-7">
      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Child's first name" error={errors.includes("childName")}>
          <input
            className="field"
            placeholder="e.g. Amara"
            value={values.childName}
            onChange={(e) => onChange({ childName: e.target.value })}
            autoComplete="given-name"
          />
        </Field>

        <Field label="Year group" error={errors.includes("yearGroup")}>
          <select
            className="field appearance-none cursor-pointer"
            value={values.yearGroup}
            onChange={(e) => onChange({ yearGroup: e.target.value })}
          >
            <option value="">Select year group</option>
            {yearGroups.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </Field>
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <p
            className={cn(
              "text-sm font-semibold",
              errors.includes("subjects") ? "text-coral" : "text-ink",
            )}
          >
            Subjects you&apos;re interested in
          </p>
          <span className="text-xs text-ink-soft/60">Select all that apply</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {subjects.map((s) => {
            const selected = values.subjects.includes(s.slug);
            return (
              <button
                key={s.slug}
                type="button"
                onClick={() => toggleSubject(s.slug)}
                className={cn(
                  "group relative rounded-full border px-5 py-2 text-sm font-semibold transition-all duration-200",
                  selected
                    ? "border-teal bg-teal text-white shadow-[0_4px_14px_rgba(60,122,110,0.3)]"
                    : "border-ink/10 bg-white/70 text-ink-soft hover:border-teal/50 hover:bg-teal/5 hover:text-teal",
                )}
              >
                {selected && (
                  <span className="mr-1.5 inline-block">✓</span>
                )}
                {s.name}
              </button>
            );
          })}
        </div>
        {errors.includes("subjects") && (
          <p className="mt-2 text-xs text-coral flex items-center gap-1">
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Please select at least one subject
          </p>
        )}
      </div>
    </div>
  );
}

/* ── Step 2 — Learning goals ─────────────────────────────────────────── */
function StepGoals({
  values,
  errors,
  onChange,
}: {
  values: FormValues;
  errors: string[];
  onChange: (patch: Partial<FormValues>) => void;
}) {
  return (
    <div className="space-y-7">
      <Field
        label="What are you hoping to achieve?"
        hint="The more detail, the better"
        error={errors.includes("goals")}
      >
        <textarea
          className="field min-h-36 resize-none"
          placeholder="E.g. build confidence in fractions, prepare calmly for the 11+, improve essay writing…"
          value={values.goals}
          onChange={(e) => onChange({ goals: e.target.value })}
        />
      </Field>

      <div>
        <p className="mb-3 text-sm font-semibold text-ink">How often would you like sessions?</p>
        <div className="grid gap-3 sm:grid-cols-3">
          {frequencies.map((f) => {
            const active = values.frequency === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => onChange({ frequency: f })}
                className={cn(
                  "relative rounded-2xl border px-4 py-4 text-sm font-semibold text-left transition-all duration-200 overflow-hidden",
                  active
                    ? "border-teal bg-teal text-white shadow-[0_6px_18px_rgba(60,122,110,0.3)]"
                    : "border-ink/10 bg-white/70 text-ink hover:border-teal/40 hover:bg-teal/5",
                )}
              >
                {active && (
                  <span className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-white/20">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 12 12" stroke="white" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2 6l2.5 2.5L10 3" />
                    </svg>
                  </span>
                )}
                {f}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Step 3 — Parent details ─────────────────────────────────────────── */
function StepParent({
  values,
  errors,
  onChange,
}: {
  values: FormValues;
  errors: string[];
  onChange: (patch: Partial<FormValues>) => void;
}) {
  return (
    <div className="space-y-5">
      <Field label="Your name" error={errors.includes("parentName")}>
        <input
          className="field"
          placeholder="e.g. Sarah"
          value={values.parentName}
          onChange={(e) => onChange({ parentName: e.target.value })}
          autoComplete="name"
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Email address" error={errors.includes("email")}>
          <input
            className="field"
            type="email"
            placeholder="you@example.com"
            value={values.email}
            onChange={(e) => onChange({ email: e.target.value })}
            autoComplete="email"
          />
        </Field>

        <Field label="Phone number" error={errors.includes("phone")}>
          <input
            className="field"
            type="tel"
            placeholder="07700 900000"
            value={values.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
            autoComplete="tel"
          />
        </Field>
      </div>

      <label
        className={cn(
          "flex items-start gap-3 rounded-xl border p-4 cursor-pointer transition-colors",
          errors.includes("consent")
            ? "border-coral/40 bg-coral/5"
            : "border-ink/10 bg-cream/20 hover:bg-cream/40",
        )}
      >
        <div className="mt-0.5 flex-shrink-0">
          <input
            type="checkbox"
            className="h-4 w-4 rounded accent-teal"
            checked={values.consent}
            onChange={(e) => onChange({ consent: e.target.checked })}
          />
        </div>
        <span className={cn("text-sm leading-relaxed", errors.includes("consent") ? "text-coral-deep" : "text-ink-soft")}>
          I&apos;m happy to be contacted about tutoring for my child.{" "}
          <span className="text-ink-soft/50">(Replace with legal wording before going live.)</span>
        </span>
      </label>
    </div>
  );
}

/* ── Success screen ──────────────────────────────────────────────────── */
function SuccessScreen({ childName }: { childName: string }) {
  return (
    <div className="flex flex-col items-center py-12 text-center">
      {/* Animated success ring */}
      <div className="relative flex h-24 w-24 items-center justify-center">
        <span className="absolute inset-0 rounded-full bg-teal/15 animate-ping" style={{ animationDuration: "2.5s" }} />
        <span className="absolute inset-2 rounded-full bg-teal/10" />
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-teal shadow-[0_8px_32px_rgba(60,122,110,0.4)]">
          <svg viewBox="0 0 32 32" className="h-8 w-8" fill="none" aria-hidden>
            <path
              d="M8 16.5 13.5 22 24 10"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 28,
                strokeDashoffset: 28,
                animation: "check-draw 0.6s 0.2s ease forwards",
              }}
            />
          </svg>
        </span>
      </div>

      <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-teal/10 px-3 py-1 text-xs font-semibold text-teal">
        <span className="h-1.5 w-1.5 rounded-full bg-teal" />
        Submitted successfully
      </div>

      <h2 className="mt-5 font-display text-3xl font-semibold text-ink">
        {childName ? `Great — we have ${childName}'s details!` : "We have your details!"}
      </h2>
      <p className="mt-3 max-w-sm text-ink-soft leading-7">
        A member of our team will reach out within one working day to arrange a free, unhurried consultation.
      </p>
      <p className="mt-4 text-xs text-ink-soft/50">
        (Placeholder — connect a real form endpoint before going live.)
      </p>
    </div>
  );
}

/* ── Main wizard component ───────────────────────────────────────────── */
export default function GetStartedForm() {
  const [step, setStep] = useState<Step>(0);
  const [values, setValues] = useState<FormValues>(initial);
  const [errors, setErrors] = useState<string[]>([]);
  const [shake, setShake] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function patch(update: Partial<FormValues>) {
    setValues((prev) => ({ ...prev, ...update }));
    const keys = Object.keys(update);
    setErrors((prev) => prev.filter((e) => !keys.includes(e)));
  }

  function triggerShake(nextErrors: string[]) {
    setErrors(nextErrors);
    setShake(true);
    window.setTimeout(() => setShake(false), 450);
  }

  function validateStep(s: Step): string[] {
    if (s === 0) {
      const errs: string[] = [];
      if (!values.childName.trim()) errs.push("childName");
      if (!values.yearGroup) errs.push("yearGroup");
      if (values.subjects.length === 0) errs.push("subjects");
      return errs;
    }
    if (s === 1) {
      const errs: string[] = [];
      if (!values.goals.trim()) errs.push("goals");
      return errs;
    }
    if (s === 2) {
      const errs: string[] = [];
      if (!values.parentName.trim()) errs.push("parentName");
      if (!values.email.includes("@")) errs.push("email");
      if (!values.phone.trim()) errs.push("phone");
      if (!values.consent) errs.push("consent");
      return errs;
    }
    return [];
  }

  function next() {
    const errs = validateStep(step);
    if (errs.length) { triggerShake(errs); return; }
    setErrors([]);
    setStep((s) => (s + 1) as Step);
  }

  function back() {
    setErrors([]);
    setStep((s) => (s - 1) as Step);
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const errs = validateStep(2);
    if (errs.length) { triggerShake(errs); return; }
    setSubmitted(true);
  }

  if (submitted) return <SuccessScreen childName={values.childName} />;

  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-8", shake && "shake")}
      noValidate
    >
      {/* ── Premium step indicator ── */}
      <div className="flex items-start">
        {STEPS.map((label, i) => (
          <div key={label} className="flex flex-1 items-start">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all duration-400",
                  i < step
                    ? "bg-teal text-white shadow-[0_4px_12px_rgba(60,122,110,0.35)]"
                    : i === step
                      ? "ring-[2.5px] ring-teal ring-offset-2 bg-white text-teal font-bold"
                      : "bg-ink/8 text-ink-soft/60",
                )}
              >
                {i < step ? (
                  <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none">
                    <path d="M3 8 6.5 11.5 13 5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={cn(
                  "hidden text-[10px] font-semibold tracking-wide sm:block whitespace-nowrap transition-colors",
                  i === step ? "text-teal" : i < step ? "text-teal/60" : "text-ink-soft/40",
                )}
              >
                {label}
              </span>
            </div>

            {i < STEPS.length - 1 && (
              <div className="relative mx-2 mt-4 flex-1 h-[2px] rounded-full bg-ink/8 overflow-hidden">
                <div
                  className="absolute inset-y-0 left-0 rounded-full bg-teal transition-all duration-600 ease-out"
                  style={{ width: i < step ? "100%" : "0%" }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ── Step label for mobile ── */}
      <div className="sm:hidden text-center">
        <p className="text-xs font-semibold tracking-widest text-teal uppercase">
          Step {step + 1} of {STEPS.length} — {STEPS[step]}
        </p>
      </div>

      {/* ── Step content ── */}
      <div className="min-h-[300px]">
        {step === 0 && <StepChild values={values} errors={errors} onChange={patch} />}
        {step === 1 && <StepGoals values={values} errors={errors} onChange={patch} />}
        {step === 2 && <StepParent values={values} errors={errors} onChange={patch} />}
      </div>

      {/* ── Navigation ── */}
      <div className="flex items-center justify-between gap-4 pt-1 border-t border-ink/5">
        {step > 0 ? (
          <button
            type="button"
            onClick={back}
            className="flex items-center gap-2 rounded-full border border-ink/12 bg-white/80 px-6 py-2.5 text-sm font-semibold text-ink-soft transition hover:bg-cream-deep hover:text-ink hover:border-ink/20"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10 4l-4 4 4 4" />
            </svg>
            Back
          </button>
        ) : (
          <span />
        )}

        {/* Step counter */}
        <span className="hidden sm:block text-xs text-ink-soft/50 font-medium">
          {step + 1} / {STEPS.length}
        </span>

        {step < STEPS.length - 1 ? (
          <button
            type="button"
            onClick={next}
            className="inline-flex items-center gap-2 rounded-full bg-coral px-8 py-3 text-sm font-bold text-white shadow-[0_6px_20px_rgba(224,122,95,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(224,122,95,0.42)] active:scale-[0.97] active:shadow-none"
          >
            Continue
            <svg className="h-4 w-4" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
            </svg>
          </button>
        ) : (
          <button
            type="submit"
            className="inline-flex items-center gap-2 rounded-full bg-teal px-8 py-3 text-sm font-bold text-white shadow-[0_6px_20px_rgba(60,122,110,0.32)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(60,122,110,0.42)] active:scale-[0.97] active:shadow-none"
          >
            <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" aria-hidden>
              <path d="M2 8h12M9 4l4 4-4 4" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Send my details
          </button>
        )}
      </div>
    </form>
  );
}
