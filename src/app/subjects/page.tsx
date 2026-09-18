import type { Metadata } from "next";
import SubjectsGrid from "@/components/home/SubjectsGrid";
import FinalCta from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: "Subjects",
  description: "English, Maths, Science, 11+ and GCSE tutoring with a calm, child-first approach.",
};

export default function SubjectsPage() {
  return (
    <div className="pt-28">
      <SubjectsGrid />
      <p className="mx-auto max-w-3xl px-6 pb-8 text-sm text-ink-soft md:px-8">
        11+ support is familiarisation and reasoning practice — not high-pressure exam theatre. GCSE work follows the
        specification with a focus on understanding; grade targets are discussed privately, never as spectacle.
      </p>
      <FinalCta />
    </div>
  );
}
