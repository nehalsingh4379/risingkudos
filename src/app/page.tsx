import Hero from "@/components/home/Hero";
import TrustStrip from "@/components/home/TrustStrip";
import Benefits from "@/components/home/Benefits";
import SubjectsGrid from "@/components/home/SubjectsGrid";
import HowItWorks from "@/components/home/HowItWorks";
import TutorPromise from "@/components/home/TutorPromise";
import PricingPreview from "@/components/home/PricingPreview";
import WhyChoose from "@/components/home/WhyChoose";
import FaqPreview from "@/components/home/FaqPreview";
import FinalCta from "@/components/home/FinalCta";

export default function Home() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <Benefits />
      <SubjectsGrid preview />
      <HowItWorks />
      <TutorPromise />
      <PricingPreview />
      <WhyChoose />
      <FaqPreview />
      <FinalCta />
    </>
  );
}
