"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ScrollGifBackground from "@/components/home/ScrollGifBackground";
import AuroraButton from "@/components/ui/AuroraButton";
import { KineticText } from "@/components/ui/KineticText";
import { prefersReducedMotion } from "@/lib/motion";
import { site } from "@/content/site";

gsap.registerPlugin(ScrollTrigger);

const HERO_BG = "/video/bg gif.gif";

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const copyRef = useRef<HTMLDivElement>(null);
  const hintRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinRef.current;
    if (!section || !pinEl) return;
    if (prefersReducedMotion()) return;

    // ── 1. Wait until the GIF canvas has decoded at least one frame ────────────
    // The canvas element exposes __gifHandle once loadGif() resolves.
    // We poll briefly; typically resolves within 1-3 s depending on GIF size.
    let pollId: ReturnType<typeof setInterval> | null = null;
    let st: ScrollTrigger | null = null;

    function boot() {
      const canvasEl = canvasWrapRef.current?.querySelector("canvas");
      if (!canvasEl) return;

      // Grab the imperative handle that ScrollGifBackground attaches to the element
      type WithHandle = { __gifHandle?: { setProgress: (p: number) => void } };
      const handle = (canvasEl as unknown as WithHandle).__gifHandle;
      if (!handle) return; // not decoded yet — keep polling

      if (pollId) clearInterval(pollId);

      // ── 2. Create the scroll-pinned trigger ───────────────────────────────
      // Pin the inner wrapper so the outer section remains a direct child of <main>
      const isMobile = window.innerWidth <= 768;
      st = ScrollTrigger.create({
        trigger: section,
        pin: pinEl,
        start: "top top",
        end: "+=200%",       // 2 extra viewport-heights of scroll = GIF duration
        scrub: isMobile ? 0.2 : 0.6,          // instant touch response on mobile, cinematic on desktop
        anticipatePin: 1,
        onUpdate: (self) => {
          // Drive GIF frame directly from scroll progress (0→1)
          handle.setProgress(self.progress);

          // ── Copy fades/lifts only in the last 25% of the GIF ──────────────
          const FADE_START = 0.75;
          const fadeT = Math.max(0, (self.progress - FADE_START) / (1 - FADE_START));
          const opacity = 1 - fadeT;                       // 1 → 0
          const translateY = -fadeT * 56;                  // 0 → -56 px

          if (copyRef.current) {
            copyRef.current.style.opacity = String(opacity);
            copyRef.current.style.transform = `translateY(${translateY}px)`;
          }
          // Hint disappears a bit earlier so it's gone before copy moves
          if (hintRef.current) {
            const hintT = Math.max(0, (self.progress - 0.6) / 0.4);
            hintRef.current.style.opacity = String(Math.max(0, 1 - hintT));
          }
        },
      });
    }

    // Poll every 200 ms until the GIF handle is ready (max ~10 s)
    pollId = setInterval(boot, 200);
    boot(); // try immediately in case it's already ready (cached GIF)

    // Timeout guard — if GIF never loads, clear the poll
    const timeout = setTimeout(() => {
      if (pollId) clearInterval(pollId);
    }, 10_000);

    return () => {
      if (pollId) clearInterval(pollId);
      clearTimeout(timeout);
      st?.kill(true);
    };
  }, []);

  return (
    <section ref={sectionRef} id="hero" className="relative isolate">
      <div ref={pinRef} className="relative min-h-[100svh] overflow-hidden">

        {/* GIF background — fills the section */}
        <div ref={canvasWrapRef} className="pointer-events-none absolute inset-0 origin-center">
          <ScrollGifBackground src={HERO_BG} />
          {/* Gradient overlays — identical to original */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-cream/88 via-cream/45 to-cream/10" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-cream/50 via-transparent to-cream/20" />
        </div>

        {/* Hero copy */}
        <div className="relative z-10 mx-auto grid min-h-[100svh] max-w-7xl items-center px-5 pt-24 pb-14 sm:px-6 sm:pt-28 sm:pb-16 md:px-8">
          <div ref={copyRef} className="max-w-2xl pr-0 sm:pr-8 will-change-transform">
            <p className="mb-3 text-xs sm:text-sm font-semibold tracking-wide text-teal uppercase">
              For families, not exam halls
            </p>
            <KineticText
              as="h1"
              text="Where every question gets a patient answer."
              className="font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-[1.12] sm:leading-[1.08] tracking-tight text-ink"
            />
            <p className="mt-4 sm:mt-6 max-w-lg text-base sm:text-lg leading-7 sm:leading-8 text-ink-soft">
              {site.description}
            </p>
            <div className="mt-6 sm:mt-8 flex flex-row items-center gap-3.5 sm:gap-4 flex-wrap">
              <AuroraButton href="/enquiry" aurora className="w-auto justify-center">
                Book Consult
              </AuroraButton>
              <a
                href="#how-it-works"
                className="inline-flex items-center justify-center py-2 text-sm font-semibold text-ink-soft underline-offset-4 hover:underline"
              >
                See how it works →
              </a>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <p
          ref={hintRef}
          className="pointer-events-none absolute inset-x-0 bottom-4 sm:bottom-8 text-center text-xs font-medium tracking-[0.2em] text-ink-soft uppercase select-none"
        >
          Scroll
        </p>
      </div>
    </section>
  );
}
