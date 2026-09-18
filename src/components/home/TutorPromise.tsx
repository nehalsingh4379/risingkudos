"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import AuroraButton from "@/components/ui/AuroraButton";
import { ThreeDMarquee } from "@/components/ui/ThreeDMarquee";
import { LiquidGlassBox } from "@/components/ui/LiquidGlassBox";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const marqueeImages = [
  { src: "/backrground effect images/1.avif", alt: "Abstract 3D design 1" },
  { src: "/backrground effect images/2.avif", alt: "Abstract 3D design 2" },
  { src: "/backrground effect images/3.avif", alt: "Abstract 3D design 3" },
  { src: "/backrground effect images/4.avif", alt: "Abstract 3D design 4" },
  { src: "/backrground effect images/5.avif", alt: "Abstract 3D design 5" },
  { src: "/backrground effect images/6.jpg", alt: "Abstract 3D design 6" },
];

export default function TutorPromise() {
  const sectionRef = useRef<HTMLElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const container = containerRef.current;
    const panel = panelRef.current;

    if (!section || !container || !panel) return;
    if (prefersReducedMotion()) return;

    const isSmall = window.matchMedia("(max-width: 768px)").matches;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "top top",
          scrub: 0.8,
        },
      });

      tl.fromTo(
        container,
        {
          scale: isSmall ? 0.92 : 0.84,
          borderRadius: isSmall ? "24px" : "44px",
          y: isSmall ? 30 : 80,
          boxShadow: isSmall
            ? "0 12px 30px -10px rgba(43, 36, 31, 0.10)"
            : "0 30px 80px -15px rgba(43, 36, 31, 0.18)",
        },
        {
          scale: 1,
          borderRadius: "0px",
          y: 0,
          boxShadow: "0 0px 0px rgba(43, 36, 31, 0)",
          ease: "none",
        }
      );

      tl.fromTo(
        panel,
        {
          scale: isSmall ? 0.94 : 0.86,
          y: isSmall ? 15 : 40,
          opacity: 0.8,
        },
        {
          scale: 1,
          y: 0,
          opacity: 1,
          ease: "none",
        },
        0 // synchronous with container zoom
      );
    }, section);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="tutor-promise"
      className="relative w-full overflow-hidden bg-cream min-h-[90svh] sm:min-h-[100svh] flex items-center justify-center"
    >
      {/* Zooming / Scaling Screen Container */}
      <div
        ref={containerRef}
        className="relative w-full min-h-[90svh] sm:min-h-[100svh] flex items-center justify-center overflow-hidden bg-cream"
        style={{
          transformOrigin: "center center",
          willChange: "transform, border-radius, box-shadow",
        }}
      >
        {/* 3D Background Marquee */}
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
          <ThreeDMarquee images={marqueeImages} cols={isMobile ? 3 : 4} />
        </div>

        {/* Foreground Panel (Context Box) */}
        <div
          ref={panelRef}
          className="relative z-10 mx-auto max-w-4xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 w-full"
          style={{
            transformOrigin: "center center",
            willChange: "transform, opacity",
          }}
        >
          <LiquidGlassBox
            className="panel border border-white/80 bg-white/65 p-6 sm:p-8 md:p-12 shadow-[0_20px_50px_rgba(43,36,31,0.08)] backdrop-blur-2xl rounded-2xl sm:rounded-3xl transition-all"
            opacity={0.8}
          >
            <div className="flex flex-col sm:flex-row items-start gap-4 md:gap-6">
              <span
                className="handshake grid h-12 w-12 shrink-0 place-items-center rounded-full bg-maths text-2xl shadow-xs"
                aria-hidden
              >
                🤝
              </span>
              <div className="flex-1">
                <h2 className="font-display text-2xl sm:text-3xl md:text-4xl font-semibold text-ink tracking-tight">
                  The tutor-change promise
                </h2>
                <p className="mt-3 sm:mt-4 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-ink-soft">
                  Chemistry matters. If a pairing does not feel right — for your child or for you — tell us. We rematch
                  without a fee and without making it awkward. The goal is a relationship that feels safe and useful.
                </p>
                <div className="mt-5 sm:mt-6">
                  <AuroraButton href="/enquiry" className="w-full sm:w-auto justify-center">Talk to us</AuroraButton>
                </div>
              </div>
            </div>
          </LiquidGlassBox>
        </div>
      </div>
    </section>
  );
}
