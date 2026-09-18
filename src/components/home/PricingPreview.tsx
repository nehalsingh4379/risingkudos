"use client";

import Link from "next/link";
import Reveal from "@/components/ui/Reveal";
import { packages } from "@/content/site";
import { cn } from "@/lib/cn";
import { FluidBlobs } from "@/components/ui/FluidBlobs";
import AuroraButton from "@/components/ui/AuroraButton";

const PRICING_GRADIENT_COLORS = ["#C85418", "#d86328", "#e3743c", "#f08953"];

export default function PricingPreview({ full = false }: { full?: boolean }) {
  return (
    <section id="pricing" className="mx-auto max-w-7xl px-5 py-14 sm:px-6 sm:py-18 md:px-8 md:py-20">
      <div className="mb-8 sm:mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-teal uppercase">Pricing</p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-ink">Clear packages, no countdown clocks.</h2>
        </div>
        {!full ? (
          <Link href="/pricing" className="inline-flex items-center gap-1 text-sm font-bold text-coral hover:underline">
            Full pricing →
          </Link>
        ) : null}
      </div>

      <Reveal className="grid gap-6 md:grid-cols-3 md:items-end" stagger={0.1}>
        {packages.map((pkg) =>
          pkg.highlight ? (
            /* ── Beam-border wrapper for the featured card ─────────────────── */
            <div
              key={pkg.id}
              data-reveal
              className="beam-card-outer group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              {/* Rotating beam layer — sits behind the white card */}
              <div aria-hidden="true" className="beam-card-beam" />

              <article
                className="beam-card-inner card-radius relative flex flex-col overflow-hidden bg-white p-6 sm:p-7 min-h-auto md:min-h-[540px]"
              >
                {/* Gradient mouse trailing fluid blob effect */}
                <FluidBlobs
                  lightColors={PRICING_GRADIENT_COLORS}
                  blur={55}
                  opacity={0.32}
                  mouseTrail
                />

                <div className="relative z-10 flex flex-col flex-1">
                  {/* Badge */}
                  <p className="mb-4 text-xs font-semibold tracking-wide text-coral uppercase">
                    Most families start here
                  </p>

                  {/* Title & price */}
                  <h3 className="font-display text-3xl font-semibold">{pkg.name}</h3>
                  <p className="mt-2 font-display text-5xl">{pkg.price}</p>
                  <p className="text-base text-ink-soft">{pkg.period}</p>

                  {/* Bullet points */}
                  <ul className="mt-6 flex-1 space-y-3 text-base text-ink-soft">
                    {pkg.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                          style={{ background: "#e07a5f" }}
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>

                  {/* Aurora CTA button */}
                  <div className="mt-8">
                    <AuroraButton
                      href="/enquiry"
                      aurora
                      className="w-full justify-center"
                    >
                      Get started with {pkg.name}
                    </AuroraButton>
                  </div>
                </div>
              </article>
            </div>
          ) : (
            /* ── Normal card ───────────────────────────────────────────────── */
            <div
              key={pkg.id}
              data-reveal
              className="group cursor-pointer transition-all duration-300 ease-out hover:-translate-y-2 hover:scale-[1.01] active:scale-[0.99]"
            >
              <article
                className={cn(
                  "card-radius relative flex flex-col overflow-hidden border bg-white p-6 sm:p-7",
                  "min-h-auto md:min-h-[460px]",
                  "border-white/80 shadow-[0_16px_48px_rgba(43,36,31,0.12),0_4px_16px_rgba(43,36,31,0.07)]",
                )}
              >
                {/* Gradient mouse trailing fluid blob effect */}
                <FluidBlobs
                  lightColors={PRICING_GRADIENT_COLORS}
                  blur={55}
                  opacity={0.28}
                  mouseTrail
                />

                <div className="relative z-10 flex flex-col flex-1">
                  <p className="mb-4 text-xs text-transparent select-none">‎</p>

                  <h3 className="font-display text-3xl font-semibold">{pkg.name}</h3>
                  <p className="mt-2 font-display text-5xl">{pkg.price}</p>
                  <p className="text-base text-ink-soft">{pkg.period}</p>

                  <ul className="mt-6 flex-1 space-y-3 text-base text-ink-soft">
                    {pkg.points.map((point) => (
                      <li key={point} className="flex items-start gap-2.5">
                        <span
                          className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                          style={{ background: "#e07a5f" }}
                          aria-hidden="true"
                        />
                        {point}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8">
                    <AuroraButton
                      href="/enquiry"
                      className="w-full justify-center"
                    >
                      Choose {pkg.name}
                    </AuroraButton>
                  </div>
                </div>
              </article>
            </div>
          )
        )}
      </Reveal>

      <p className="mt-6 rounded-2xl border border-white/70 bg-white/35 p-4 text-sm text-ink-soft backdrop-blur-md">
        Figures are indicative placeholders until final pricing is confirmed. Refund notes will sit with the legal copy.
      </p>
    </section>
  );
}
