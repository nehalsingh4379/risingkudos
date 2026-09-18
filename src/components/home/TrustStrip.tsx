"use client";

import { useEffect, useState } from "react";
import Reveal from "@/components/ui/Reveal";
import { trustItems } from "@/content/site";
import AnimatedParticles from "@/components/ui/AnimatedParticles";

export default function TrustStrip() {
  const [particleCount, setParticleCount] = useState(12000);

  useEffect(() => {
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    setParticleCount(isMobile ? 3500 : 12000);
  }, []);

  return (
    <section className="relative z-10 -mt-6 sm:-mt-8 px-4 sm:px-6 md:px-8">
      <Reveal className="mx-auto max-w-5xl">
        <AnimatedParticles 
          className="rounded-[22px] sm:rounded-[28px] border border-white/70 bg-white shadow-[0_20px_50px_rgba(43,36,31,0.06)]"
          particleCount={particleCount}
          particleSize={2.0}
          backgroundColor="#ffffff"
        >
          <div className="relative z-10 grid grid-cols-2 gap-2 sm:gap-3 p-3 sm:p-4 md:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item.label} data-reveal className="rounded-2xl px-2.5 py-2.5 sm:px-4 sm:py-3 text-center bg-white/50 backdrop-blur-sm">
                <p className="font-display text-lg sm:text-xl font-semibold text-ink">{item.value}</p>
                <p className="text-[11px] sm:text-xs tracking-wide text-ink-soft uppercase mt-0.5">{item.label}</p>
              </div>
            ))}
          </div>
        </AnimatedParticles>
      </Reveal>
    </section>
  );
}
