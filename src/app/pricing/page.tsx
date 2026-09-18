import type { Metadata } from "next";
import PricingPreview from "@/components/home/PricingPreview";
import FinalCta from "@/components/home/FinalCta";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Intro, weekly and focused tutoring packages. Placeholders until final fees are confirmed.",
};

export default function PricingPage() {
  return (
    <div className="pt-28">
      <PricingPreview full />
      <FinalCta />
    </div>
  );
}
