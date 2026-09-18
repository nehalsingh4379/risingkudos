import type { Metadata } from "next";
import Link from "next/link";
import GetStartedForm from "@/components/get-started/GetStartedForm";

export const metadata: Metadata = {
  title: "Get Started — Rising Kudos",
  description:
    "Begin your journey with Rising Kudos. Tell us about your child and we'll match them with the right tutor for a calm, confident start.",
};

const trustPoints = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    ),
    bg: "bg-teal/10",
    iconColor: "text-teal",
    title: "100% Free Consultation",
    desc: "No upfront fees. We start with a friendly, unhurried chat.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    bg: "bg-coral/10",
    iconColor: "text-coral",
    title: "Carefully Matched Tutors",
    desc: "Matched for subject mastery and emotional temperament.",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    bg: "bg-amber/10",
    iconColor: "text-amber",
    title: "Zero-Risk Rematch",
    desc: "If the chemistry isn't right, we rematch free of charge.",
  },
];

const stats = [
  { value: "24h", label: "Response time" },
  { value: "100%", label: "Free first consult" },
  { value: "1:1", label: "Always personal" },
  { value: "KS2–GCSE", label: "Year groups" },
];

export default function GetStartedPage() {
  return (
    <div className="relative min-h-screen overflow-hidden">

      {/* ── Immersive ambient background ─────────────────────────────── */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[#f6efe4]" />
        {/* teal orb — top left */}
        <div
          className="absolute -top-40 -left-40 h-[700px] w-[700px] rounded-full opacity-20"
          style={{ background: "radial-gradient(circle, #3c7a6e 0%, transparent 65%)" }}
        />
        {/* coral orb — top right */}
        <div
          className="absolute -top-24 -right-24 h-[500px] w-[500px] rounded-full opacity-15"
          style={{ background: "radial-gradient(circle, #e07a5f 0%, transparent 65%)" }}
        />
        {/* amber orb — bottom centre */}
        <div
          className="absolute -bottom-20 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full opacity-12"
          style={{ background: "radial-gradient(circle, #e8b56a 0%, transparent 65%)" }}
        />
        {/* subtle dot grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: "radial-gradient(circle, #2b241f 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 pb-20 pt-24 sm:px-6 sm:pb-28 sm:pt-32 md:px-8 md:pt-36">

        {/* ── Breadcrumb ─────────────────────────────────────────────── */}
        <div className="mb-6 sm:mb-12 flex items-center gap-2 text-xs font-semibold tracking-widest text-teal uppercase">
          <Link href="/" className="transition hover:text-teal/60">Home</Link>
          <svg className="h-3 w-3 opacity-40" fill="none" viewBox="0 0 16 16" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 4l4 4-4 4" />
          </svg>
          <span className="text-ink-soft/60">Get Started</span>
        </div>

        {/* ── Main grid ──────────────────────────────────────────────── */}
        <div className="grid items-start gap-8 sm:gap-14 lg:grid-cols-12 lg:gap-20">

          {/* ── LEFT column ────────────────────────────────────────── */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 space-y-6">

            {/* Live indicator badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-coral/25 bg-coral/8 px-4 py-1.5 text-xs font-semibold tracking-widest text-coral uppercase">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-coral" />
              </span>
              Free consultation — no commitment
            </div>

            {/* Headline */}
            <h1 className="font-display text-3xl font-semibold leading-[1.12] text-ink sm:text-5xl lg:text-6xl">
              Let&apos;s build your{" "}
              <span className="relative whitespace-nowrap">
                <span className="relative z-10">child&apos;s</span>
                <svg
                  className="absolute -bottom-1 left-0 w-full"
                  viewBox="0 0 160 10"
                  fill="none"
                  preserveAspectRatio="none"
                  aria-hidden
                >
                  <path
                    d="M2 7 C40 2, 120 2, 158 7"
                    stroke="#e07a5f"
                    strokeWidth="3"
                    strokeLinecap="round"
                    opacity="0.55"
                  />
                </svg>
              </span>{" "}
              confidence.
            </h1>

            <p className="text-base leading-relaxed text-ink-soft sm:text-lg">
              Two minutes is all it takes. Tell us about your child and we&apos;ll handpick a tutor who truly fits — then arrange a free, zero-pressure consultation.
            </p>

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-white/75 bg-white/55 px-4 py-3 text-center shadow-sm backdrop-blur-sm"
                >
                  <div className="font-display text-2xl font-semibold text-ink">{s.value}</div>
                  <div className="mt-0.5 text-[9px] font-semibold tracking-widest text-ink-soft/70 uppercase">{s.label}</div>
                </div>
              ))}
            </div>

            {/* What happens next */}
            <div className="overflow-hidden rounded-3xl border border-white/80 bg-white/60 shadow-[0_8px_32px_rgba(43,36,31,0.06)] backdrop-blur-md">
              <div className="border-b border-ink/5 px-6 py-4">
                <p className="text-xs font-semibold tracking-widest text-ink uppercase">What happens next</p>
              </div>
              <div className="divide-y divide-ink/5">
                {[
                  { n: "01", title: "Quick Review", body: "Our academic team reviews your notes within 24 hours." },
                  { n: "02", title: "Tutor Introduction", body: "We propose a tutor who matches your child's pace and learning style." },
                  { n: "03", title: "Free Consultation", body: "A relaxed video chat to confirm it feels right before booking anything." },
                ].map((item) => (
                  <div key={item.n} className="flex gap-4 px-6 py-4">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cream-deep">
                      <span className="font-display text-xs font-bold text-ink">{item.n}</span>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-ink">{item.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-ink-soft">{item.body}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trust badges */}
            <div className="space-y-3">
              {trustPoints.map((item) => (
                <div
                  key={item.title}
                  className="flex items-start gap-3.5 rounded-2xl border border-white/70 bg-white/55 p-4 shadow-sm backdrop-blur-sm"
                >
                  <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${item.bg} ${item.iconColor}`}>
                    {item.icon}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{item.title}</p>
                    <p className="mt-0.5 text-xs text-ink-soft">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Quote */}
            <blockquote className="rounded-2xl border-l-[3px] border-teal bg-teal/5 px-5 py-4 text-sm italic leading-relaxed text-ink-soft">
              &ldquo;We don&apos;t believe in pressure or high-stakes entrance interviews. Learning happens best when children feel safe and understood.&rdquo;
            </blockquote>
          </div>

          {/* ── RIGHT column: form card ────────────────────────────── */}
          <div className="lg:col-span-7">
            <div className="relative">
              {/* Soft conic glow behind card */}
              <div
                className="pointer-events-none absolute -inset-6 rounded-[52px] opacity-25 blur-2xl"
                style={{
                  background: "conic-gradient(from 160deg at 50% 50%, #3c7a6e, #e07a5f, #e8b56a, #3c7a6e)",
                }}
              />

              {/* Card */}
              <div className="relative overflow-hidden rounded-2xl sm:rounded-[36px] border border-white/90 bg-white/85 shadow-[0_32px_80px_rgba(43,36,31,0.13)] backdrop-blur-2xl">
                {/* Rainbow top accent */}
                <div
                  className="h-[3px] w-full"
                  style={{ background: "linear-gradient(90deg, #3c7a6e 0%, #e07a5f 50%, #e8b56a 100%)" }}
                />

                <div className="p-5 sm:p-7 md:p-10">
                  {/* Card header */}
                  <div className="mb-8 pb-6 border-b border-ink/5">
                    <p className="text-xs font-semibold tracking-widest text-coral uppercase">Step-by-step onboarding</p>
                    <h2 className="mt-1.5 font-display text-3xl font-semibold text-ink">Find the perfect match</h2>
                    <p className="mt-1.5 text-sm text-ink-soft">Fill in a few details and we&apos;ll handle everything else.</p>
                  </div>

                  <GetStartedForm />
                </div>
              </div>
            </div>

            {/* Bottom micro-trust row */}
            <div className="mt-7 flex flex-wrap items-center justify-center gap-x-7 gap-y-2.5 text-xs text-ink-soft/60">
              {[
                {
                  icon: <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />,
                  label: "Your data is safe with us",
                },
                {
                  icon: <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />,
                  label: "No spam, ever",
                },
                {
                  icon: <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />,
                  label: "We'll call at a time that suits you",
                },
              ].map(({ icon, label }) => (
                <span key={label} className="flex items-center gap-1.5">
                  <svg className="h-3.5 w-3.5 text-teal/70" fill="currentColor" viewBox="0 0 20 20">
                    {icon}
                  </svg>
                  {label}
                </span>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
