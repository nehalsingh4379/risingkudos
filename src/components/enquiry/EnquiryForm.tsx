"use client";

import { FormEvent, useState } from "react";
import { subjects } from "@/content/site";
import { cn } from "@/lib/cn";

const initial = {
  name: "",
  email: "",
  phone: "",
  year: "",
  subject: "",
  message: "",
  consent: false,
};

export default function EnquiryForm() {
  const [values, setValues] = useState(initial);
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const next: string[] = [];
    if (!values.name.trim()) next.push("name");
    if (!values.email.includes("@")) next.push("email");
    if (!values.phone.trim()) next.push("phone");
    if (!values.consent) next.push("consent");
    if (next.length) {
      setErrors(next);
      setShake(true);
      window.setTimeout(() => setShake(false), 450);
      return;
    }
    setSuccess(true);
  }

  if (success) {
    return (
      <div className="card-radius border border-white/80 bg-white/90 p-10 text-center">
        <svg viewBox="0 0 64 64" className="mx-auto h-16 w-16" aria-hidden>
          <circle cx="32" cy="32" r="28" className="fill-maths" />
          <path
            d="M20 33.5 28 41l16-18"
            className="stroke-teal"
            strokeWidth="3.5"
            fill="none"
            strokeLinecap="round"
            style={{ strokeDasharray: 48, strokeDashoffset: 48, animation: "check-draw 0.7s ease forwards" }}
          />
        </svg>
        <h2 className="mt-4 font-display text-3xl font-semibold">Thank you — we have it.</h2>
        <p className="mt-3 text-ink-soft">
          A member of the team will be in touch to arrange a calm, unhurried consultation. This confirmation is a
          placeholder until the live form endpoint is connected.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("card-radius space-y-4 border border-white/80 bg-white p-5 sm:p-6 md:p-8", shake && "shake")} noValidate>
      <Field label="Parent name" error={errors.includes("name")}>
        <input
          className="field"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          autoComplete="name"
        />
      </Field>
      <Field label="Email" error={errors.includes("email")}>
        <input
          className="field"
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          autoComplete="email"
        />
      </Field>
      <Field label="Phone number" error={errors.includes("phone")}>
        <input
          className="field"
          type="tel"
          value={values.phone}
          onChange={(e) => setValues({ ...values, phone: e.target.value })}
          autoComplete="tel"
        />
      </Field>
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Child year group">
          <input
            className="field"
            value={values.year}
            onChange={(e) => setValues({ ...values, year: e.target.value })}
          />
        </Field>
        <Field label="Subject of interest">
          <select
            className="field"
            value={values.subject}
            onChange={(e) => setValues({ ...values, subject: e.target.value })}
          >
            <option value="">Select</option>
            {subjects.map((s) => (
              <option key={s.slug} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <Field label="Anything we should know">
        <textarea
          className="field min-h-28"
          value={values.message}
          onChange={(e) => setValues({ ...values, message: e.target.value })}
        />
      </Field>
      <label className="flex items-start gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          className="mt-1"
          checked={values.consent}
          onChange={(e) => setValues({ ...values, consent: e.target.checked })}
        />
        <span className={errors.includes("consent") ? "text-coral-deep" : undefined}>
          I am happy to be contacted about this enquiry. (Placeholder consent — replace with legal wording.)
        </span>
      </label>
      <button
        type="submit"
        className="inline-flex w-full items-center justify-center rounded-full bg-coral py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(224,122,95,0.28)] transition hover:scale-[1.02] md:w-auto md:px-8"
      >
        Send My Enquiry
      </button>
    </form>
  );
}

function Field({
  label,
  children,
  error,
}: {
  label: string;
  children: React.ReactNode;
  error?: boolean;
}) {
  return (
    <label className="block text-sm font-medium">
      {label}
      <div
        className={cn(
          "mt-1.5 [&_.field]:w-full [&_.field]:rounded-2xl [&_.field]:border [&_.field]:bg-cream/40 [&_.field]:px-4 [&_.field]:py-3 [&_.field]:text-base sm:[&_.field]:text-sm [&_.field]:outline-none [&_.field]:transition",
          error
            ? "[&_.field]:border-coral"
            : "[&_.field]:border-ink/10 [&_.field]:focus-within:border-teal [&_.field]:focus-within:shadow-[0_0_0_4px_rgba(60,122,110,0.15)]",
        )}
      >
        {children}
      </div>
    </label>
  );
}
