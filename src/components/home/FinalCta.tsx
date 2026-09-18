import AuroraButton from "@/components/ui/AuroraButton";
import Image from "next/image";
import LogoTicker from "@/components/ui/LogoTicker";

export default function FinalCta() {
  return (
    <section className="relative mx-4 sm:mx-6 mb-12 sm:mb-16 overflow-hidden md:mx-8 rounded-3xl sm:rounded-[48px] md:rounded-[60px]">
      <div className="absolute inset-0 rounded-3xl sm:rounded-[48px] md:rounded-[60px] overflow-hidden">
        <Image 
          src="/above footer/box bg.png" 
          alt="Background" 
          fill 
          className="object-cover"
        />
        <div className="absolute inset-0 bg-white/50" />
      </div>
      <div className="relative panel border border-transparent bg-transparent px-5 py-12 sm:px-8 sm:py-16 text-center md:px-16">
        <h2 className="font-display text-2xl sm:text-4xl font-semibold md:text-5xl text-ink">When you are ready, we will go slowly.</h2>
        <p className="mx-auto mt-3 sm:mt-4 max-w-xl text-sm sm:text-base text-ink-soft">
          Book a free consultation. No urgency timers — just a conversation about your child.
        </p>
        <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-4">
          <AuroraButton href="/enquiry" aurora className="w-full sm:w-auto justify-center">
            Book Consultation
          </AuroraButton>
        </div>
        <div className="flex justify-center">
          <LogoTicker />
        </div>
      </div>
    </section>
  );
}
