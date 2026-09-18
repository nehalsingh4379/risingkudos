import type { Metadata } from "next";
import FaqAccordion from "@/components/faq/FaqAccordion";
import FinalCta from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers about matching, sessions, 11+/GCSE preparation, billing and tutor changes.",
};

export default function FaqPage() {
  return (
    <div className="pt-24 sm:pt-28">
      <section className="mx-auto max-w-3xl px-5 py-12 sm:px-6 sm:py-16 md:px-8">
        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-ink">Parent FAQ</h1>
        <p className="mt-3 sm:mt-4 text-sm sm:text-base text-ink-soft">One question open at a time, so the page stays easy to scan.</p>
        <div className="mt-8 sm:mt-10">
          <FaqAccordion />
        </div>
      </section>
      <FinalCta />
    </div>
  );
}
