"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { steps } from "@/content/site";
import { cn } from "@/lib/cn";
import { prefersReducedMotion } from "@/lib/motion";

import { FluidBlobs } from "@/components/ui/FluidBlobs";

gsap.registerPlugin(ScrollTrigger);

const stepImages = [
  "/how-step-1.jpg",
  "/how-step-2.jpg",
  "/how-step-3.jpg",
  "/how-step-4.jpg",
];

export default function HowItWorks() {
  const pin = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const el = pin.current;
    if (!el) return;
    const isMobile = window.matchMedia("(max-width: 768px)").matches;
    if (prefersReducedMotion() || isMobile) {
      setActive(-1);
      return;
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top top",
      end: "+=100%",
      pin: true,
      scrub: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const idx = Math.min(steps.length - 1, Math.floor(self.progress * steps.length));
        setActive(idx);
      },
    });

    return () => {
      st.kill(true);
    };
  }, []);

  return (
    <section id="how-it-works" className="relative">
      <div ref={pin} className="mx-auto flex min-h-auto md:min-h-[100svh] max-w-7xl flex-col justify-center px-5 py-12 sm:px-6 md:py-18 md:px-8">
        {/* Eyebrow badge */}
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-3.5 py-1 text-xs font-semibold tracking-wider text-teal uppercase backdrop-blur-xs">
            <svg className="h-3.5 w-3.5 text-teal" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
            </svg>
            <span>How it works</span>
          </div>

          {/* Elevated Typography matching the design sample */}
          <h2 className="mt-3 font-display text-3xl sm:text-5xl lg:text-[54px] font-normal tracking-tight text-ink leading-[1.18]">
            Four{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="font-script text-4xl sm:text-6xl lg:text-[74px] font-normal text-[#238260] px-1 tracking-normal inline-block hover:scale-105 transition-transform duration-300">
                quiet steps.
              </span>
              {/* Hand-drawn underline swoosh */}
              <svg
                className="absolute -bottom-2.5 left-0 w-full h-3 text-[#238260]/40 overflow-visible pointer-events-none"
                viewBox="0 0 240 12"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              >
                <path d="M 3 8 Q 60 2, 120 7 T 235 5" />
              </svg>
            </span>
          </h2>
        </div>
        <div className="mt-7 md:mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step, i) => (
            <article
              key={step.n}
              className={cn(
                "card-radius relative flex flex-col min-h-[290px] sm:min-h-[320px] overflow-hidden border border-white/80 p-5 sm:p-6 transition duration-500",
                active === -1
                  ? "opacity-100 shadow-[0_10px_30px_rgba(43,36,31,0.06)]"
                  : i === active
                    ? "scale-[1.02] sm:scale-[1.03] opacity-100 shadow-[0_18px_40px_rgba(43,36,31,0.1)]"
                    : "opacity-70",
              )}
            >
              {/* Background image — 100% opacity */}
              <Image
                src={stepImages[i]}
                alt=""
                fill
                className="object-cover"
                aria-hidden="true"
              />

              {/* Card content sits above inside a frosted glass box for readability */}
              <div className="relative z-10 mt-auto rounded-xl bg-white/75 p-4 shadow-sm backdrop-blur-md">
                <p className="font-display text-sm font-bold text-coral">{step.n}</p>
                <h3 className="mt-1 font-display text-base sm:text-lg font-semibold text-ink">{step.title}</h3>
                <p className="mt-1.5 sm:mt-2 text-xs leading-5 text-ink-soft">{step.body}</p>
              </div>
            </article>
          ))}
        </div>

        {/* Bottom right relatable doodle & context with liquid glassmorphism */}
        <div className="mt-7 sm:mt-8 flex justify-center sm:justify-end">
          <div className="relative inline-block select-none max-w-full">
            {/* Hand-drawn double-loop doodle arrow matching the sample image */}
            <svg
              className="absolute -top-6 -left-26 z-20 w-32 h-20 text-ink pointer-events-none drop-shadow-xs rotate-[17deg] hidden sm:block"
              viewBox="0 0 270 160"
              fill="none"
            >
              {/* Double curly loop shaft */}
              <path
                d="M 26 48 C 24 66, 32 88, 48 106 C 58 118, 76 114, 84 102 C 96 84, 98 64, 88 56 C 75 46, 58 54, 52 74 C 46 96, 56 120, 82 130 C 102 138, 122 134, 132 120 C 144 104, 154 80, 146 68 C 138 54, 122 58, 118 74 C 112 94, 122 122, 146 134 C 174 146, 212 142, 240 116 L 246 108"
                stroke="currentColor"
                strokeWidth="4.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />

              {/* Solid filled arrowhead pointing up-right */}
              <path
                d="M 224 114 L 258 84 L 246 128 L 236 112 Z"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
            </svg>

            {/* Liquid glassmorphism ultra-rounded container */}
            <div className="relative inline-flex items-center gap-3 sm:gap-4.5 rounded-2xl sm:rounded-full border border-white/80 bg-white/40 px-5 sm:px-8 py-3.5 sm:py-4 shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.95),inset_0_-1px_1px_rgba(255,255,255,0.4),0_20px_45px_rgba(43,36,31,0.08)] backdrop-blur-2xl transition-all duration-300 hover:-translate-y-1 hover:shadow-[inset_0_1.5px_2px_rgba(255,255,255,0.95),0_25px_50px_rgba(43,36,31,0.12)] overflow-hidden group">
              {/* Dynamic motion fluid layer with website theme colors */}
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-2xl sm:rounded-full" aria-hidden="true">
                <FluidBlobs
                  lightColors={["#3c7a6e", "#e07a5f", "#e8b56a", "#C85418"]}
                  blur={32}
                  opacity={0.65}
                  restingOpacity={0.4}
                  ambientMotion={true}
                  mouseTrail={true}
                  interactive={true}
                />

                {/* Layered undulating liquid waves */}
                <div className="absolute inset-x-0 bottom-0 h-16 sm:h-20 overflow-hidden opacity-45 pointer-events-none">
                  {/* Wave 1 (Back wave - warm coral/rust/amber) */}
                  <div className="absolute inset-0 w-[200%] h-full animate-wave-1 will-change-transform opacity-75">
                    <svg className="w-full h-full" viewBox="0 0 1000 120" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="liquid-wave-grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#e07a5f" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#C85418" stopOpacity="0.85" />
                          <stop offset="100%" stopColor="#e8b56a" stopOpacity="0.8" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 45 Q 125 15, 250 45 T 500 45 Q 625 15, 750 45 T 1000 45 V 120 H 0 Z"
                        fill="url(#liquid-wave-grad-1)"
                      />
                    </svg>
                  </div>

                  {/* Wave 2 (Front wave - calm teal/emerald) */}
                  <div className="absolute inset-0 w-[200%] h-full animate-wave-2 will-change-transform opacity-65">
                    <svg className="w-full h-full" viewBox="0 0 1000 120" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="liquid-wave-grad-2" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="#3c7a6e" stopOpacity="0.85" />
                          <stop offset="50%" stopColor="#2a9d8f" stopOpacity="0.9" />
                          <stop offset="100%" stopColor="#84dcc6" stopOpacity="0.75" />
                        </linearGradient>
                      </defs>
                      <path
                        d="M 0 55 Q 125 75, 250 55 T 500 55 Q 625 75, 750 55 T 1000 55 V 120 H 0 Z"
                        fill="url(#liquid-wave-grad-2)"
                      />
                    </svg>
                  </div>
                </div>

                {/* Specular glass reflection sheen across top half */}
                <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/45 via-white/10 to-transparent opacity-80" />
              </div>

              {/* Hand-drawn Sprout & Sparkle vector icon */}
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-teal/10 text-teal border border-teal/15 shadow-xs">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22v-9" />
                  <path d="M12 13c-3-3-6-2-6 2s3 4 6 2" fill="#3c7a6e22" />
                  <path d="M12 10c3-3 6-2 6 2s-3 4-6 2" fill="#3c7a6e30" />
                  <circle cx="18" cy="4" r="1.5" fill="#e8b56a" stroke="none" />
                </svg>
                {/* Mini heart doodle */}
                <svg className="absolute -top-1 -right-0.5 h-3.5 w-3.5 text-coral drop-shadow-xs" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
              </div>

              {/* Contextual copy in handwriting style */}
              <div className="relative z-10 pr-2">
                <p className="font-handwriting text-2xl sm:text-3xl text-ink leading-tight">
                  at their own pace — never rushed 🌱
                </p>
                <p className="text-xs text-ink-soft mt-0.5 font-medium tracking-normal">
                  Free tutor rematch anytime • Weekly parent updates
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
