"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ThreeDSlider, {
  SliderItemData,
  ThreeDSliderHandle,
} from "@/components/ui/ThreeDSlider";
import { InteractiveGridPattern } from "@/components/ui/InteractiveGridPattern";

gsap.registerPlugin(ScrollTrigger);

const WHY_ITEMS: SliderItemData[] = [
  {
    num: "01",
    title: "Expert, Vetted Tutors",
    imageUrl: "/carousal cards/why1.webp",
  },
  {
    num: "02",
    title: "Personalised Learning Plans",
    imageUrl: "/carousal cards/why2.webp",
  },
  {
    num: "03",
    title: "Real Progress, Real Fast",
    imageUrl: "/carousal cards/why3.webp",
  },
  {
    num: "04",
    title: "Flexible Scheduling",
    imageUrl: "/carousal cards/why4.webp",
  },
  {
    num: "05",
    title: "Confidence That Lasts",
    imageUrl: "/carousal cards/why5.webp",
  },
  {
    num: "06",
    title: "Parents Always in the Loop",
    imageUrl: "/carousal cards/why6.webp",
  },
];

// One viewport height of scroll per card transition feels natural
const SCROLL_PER_CARD = 100; // vh units
const TOTAL_SCROLL = `+=${(WHY_ITEMS.length - 1) * SCROLL_PER_CARD}vh`;

export default function WhyChoose() {
  const sectionRef = useRef<HTMLElement>(null);
  const pinRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef<ThreeDSliderHandle>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  // ── Lightbox state ─────────────────────────────────────────────────────────
  const [lightbox, setLightbox] = useState<SliderItemData | null>(null);

  const openLightbox = useCallback((item: SliderItemData) => {
    setLightbox(item);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightbox(null);
  }, []);

  const goToCard = (index: number) => {
    const nextIdx = Math.max(0, Math.min(WHY_ITEMS.length - 1, index));
    setCurrentIndex(nextIdx);
    const targetPct = (nextIdx / (WHY_ITEMS.length - 1)) * 100;
    sliderRef.current?.setTargetProgress(targetPct);
  };

  // Close on Escape
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeLightbox(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightbox, closeLightbox]);

  // Prevent body scroll while open
  useEffect(() => {
    document.body.style.overflow = lightbox ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [lightbox]);

  useEffect(() => {
    const section = sectionRef.current;
    const pinEl = pinRef.current;
    if (!section || !pinEl) return;

    const st = ScrollTrigger.create({
      trigger: section,
      pin: pinEl,
      start: "top top",
      // Pin for 6 × 100vh so each of the 6 card transitions gets one full viewport of scroll
      end: TOTAL_SCROLL,
      scrub: 1.2,           // slight lag for a silky feel
      anticipatePin: 1,
      onUpdate: (self) => {
        // Map 0→1 scroll progress to 0→100 slider progress
        sliderRef.current?.setTargetProgress(self.progress * 100);
        const idx = Math.min(WHY_ITEMS.length - 1, Math.round(self.progress * (WHY_ITEMS.length - 1)));
        setCurrentIndex(idx);
      },
    });

    return () => {
      st.kill(true);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="why-choose"
      className="relative overflow-hidden bg-cream"
    >
      <div ref={pinRef} className="relative py-14 sm:py-20 md:py-28">
      {/* Subtle warm radial wash */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_50%,rgba(224,122,95,0.06)_0%,transparent_70%)]"
      />

      {/* Section header */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 md:px-8">
        <div className="mb-6 sm:mb-10 max-w-xl">
          <p className="text-xs sm:text-sm font-semibold tracking-wide text-teal uppercase">
            Our Difference
          </p>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-ink">
            Why Choose RisingKudos
          </h2>
          <p className="mt-2.5 sm:mt-3 text-sm sm:text-base leading-relaxed sm:leading-7 text-ink-soft">
            Scroll or swipe through to explore what makes us different — every card is a
            promise built around your child, not the exam hall.
          </p>
        </div>

        {/* Slider panel */}
        <div className="panel relative border border-white/80 bg-white/60 shadow-[0_16px_48px_rgba(43,36,31,0.08)] backdrop-blur-xl overflow-hidden rounded-2xl sm:rounded-3xl">
          {/* Interactive grid behind the cards */}
          <InteractiveGridPattern
            width={44}
            height={44}
            squares={[30, 16]}
            className="border-0 opacity-80"
          />
          {/* Slider sits above the grid */}
          <div className="relative z-10">
            <ThreeDSlider
              ref={sliderRef}
              items={WHY_ITEMS}
              startProgress={0}
              disableWheel={true}
              speedDrag={-0.18}
              className="rounded-none bg-transparent"
              onItemClick={openLightbox}
            />
          </div>
        </div>

        {/* Mobile & Tablet Slider Controls */}
        <div className="mt-4 flex items-center justify-between px-2">
          <button
            type="button"
            onClick={() => goToCard(currentIndex - 1)}
            disabled={currentIndex === 0}
            aria-label="Previous reason"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/80 p-2 shadow-xs transition disabled:opacity-30 active:scale-95 hover:bg-white"
          >
            <svg className="h-4 w-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Dot indicators */}
          <div className="flex items-center gap-1">
            {WHY_ITEMS.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goToCard(i)}
                aria-label={`Go to reason ${i + 1}`}
                className="p-2 flex items-center justify-center min-w-[36px] min-h-[36px]"
              >
                <span
                  className={`h-2 rounded-full transition-all duration-300 block ${
                    i === currentIndex ? "w-6 bg-coral" : "w-2 bg-ink/25 hover:bg-ink/40"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => goToCard(currentIndex + 1)}
            disabled={currentIndex === WHY_ITEMS.length - 1}
            aria-label="Next reason"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-ink/10 bg-white/80 p-2 shadow-xs transition disabled:opacity-30 active:scale-95 hover:bg-white"
          >
            <svg className="h-4 w-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* Scroll-hint strip */}
        <p className="mt-2 text-center text-xs text-ink-soft select-none hidden sm:block">
          ↓ Scroll or swipe to explore all {WHY_ITEMS.length} reasons
        </p>
      </div>
      </div>

      {/* ── Lightbox Modal ─────────────────────────────────────────────────── */}
      {lightbox && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={lightbox.title}
          className="fixed inset-0 z-[9999] flex items-center justify-center"
          style={{ animation: "rkd-lb-in 0.22s ease" }}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeLightbox}
          />

          {/* Image container */}
          <div
            className="relative z-10 flex max-h-[90vh] max-w-[92vw] flex-col items-center"
            style={{ animation: "rkd-lb-scale 0.25s cubic-bezier(.22,.68,0,1.2)" }}
          >
            {/* Close button */}
            <button
              onClick={closeLightbox}
              aria-label="Close image"
              className="absolute -top-3.5 -right-3.5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white text-ink shadow-xl transition hover:scale-110 active:scale-95 cursor-pointer"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/>
              </svg>
            </button>

            <div className="relative overflow-hidden rounded-2xl shadow-2xl" style={{ maxHeight: "86vh", maxWidth: "88vw" }}>
              <Image
                src={lightbox.imageUrl}
                alt={lightbox.title}
                width={1200}
                height={1600}
                className="block h-auto w-auto object-contain"
                style={{ maxHeight: "86vh", maxWidth: "88vw" }}
                priority
              />
            </div>

            <p className="mt-3 text-sm font-semibold text-white drop-shadow">{lightbox.title}</p>
          </div>

          <style>{`
            @keyframes rkd-lb-in  { from { opacity:0 } to { opacity:1 } }
            @keyframes rkd-lb-scale{ from { opacity:0; transform:scale(.92) } to { opacity:1; transform:scale(1) } }
          `}</style>
        </div>
      )}
    </section>
  );
}
