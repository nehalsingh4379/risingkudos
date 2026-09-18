"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { subjects } from "@/content/site";

// Accent colour map – matches the CSS variables in globals.css
const accentBg: Record<string, string> = {
  english: "bg-english",
  maths:   "bg-maths",
  science: "bg-science",
  eleven:  "bg-eleven",
  gcse:    "bg-gcse",
};

const accentGlow: Record<string, string> = {
  english: "rgba(200,185,245,0.75)",
  maths:   "rgba(180,215,255,0.75)",
  science: "rgba(185,235,215,0.75)",
  eleven:  "rgba(250,215,145,0.75)",
  gcse:    "rgba(205,190,250,0.75)",
};

const CARD_W = 285;
const CARD_H = 380; // exactly 3:4 to match 1086 x 1448 images

/** Wraps index within [min, max) — replaces popmotion's wrap */
const wrap = (min: number, max: number, v: number) => {
  const range = max - min;
  return ((((v - min) % range) + range) % range) + min;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function SubjectCarousel({ preview = false }: { preview?: boolean }) {
  const shouldReduceMotion = useReducedMotion();
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [isMobile, setIsMobile] = useState(false);
  const touchStartX = useRef<number | null>(null);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const pageRef = useRef(page);
  useEffect(() => { pageRef.current = page; }, [page]);

  // Auto-advance every 3.5 s
  useEffect(() => {
    const t = setInterval(() => {
      setPage(p => p + 1);
      setDirection(1);
    }, 3500);
    return () => clearInterval(t);
  }, []);

  const activeIndex = wrap(0, subjects.length, page);

  const cardW = isMobile ? 228 : CARD_W;
  const cardH = isMobile ? 304 : CARD_H;

  const variants = useMemo(() => ({
    center: {
      x: "-50%", scale: 1, rotate: 0, opacity: 1, zIndex: 3,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 280, damping: 28, duration: 0.25 },
    },
    left: {
      x: isMobile ? "-118%" : "-145%",
      scale: isMobile ? 0.84 : 0.88,
      rotate: isMobile ? -6 : -10,
      opacity: isMobile ? 0.6 : 0.75,
      zIndex: 2,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 280, damping: 28, duration: 0.25 },
    },
    right: {
      x: isMobile ? "18%" : "45%",
      scale: isMobile ? 0.84 : 0.88,
      rotate: isMobile ? 6 : 10,
      opacity: isMobile ? 0.6 : 0.75,
      zIndex: 2,
      transition: shouldReduceMotion
        ? { duration: 0 }
        : { type: "spring" as const, stiffness: 280, damping: 28, duration: 0.25 },
    },
    hidden: {
      opacity: 0, zIndex: 1,
      transition: shouldReduceMotion ? { duration: 0 } : { duration: 0.2 },
    },
  }), [shouldReduceMotion, isMobile]);

  const visible = [-1, 0, 1].map(offset =>
    subjects[wrap(0, subjects.length, activeIndex + offset)]
  );

  const goTo = (dir: number) => {
    setDirection(dir);
    setPage(p => p + dir);
  };

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      goTo(diff > 0 ? 1 : -1);
    }
    touchStartX.current = null;
  };

  return (
    <section id="subjects" className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 md:px-8 md:py-20 overflow-hidden">
      {/* Background ambient vector symbols */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden select-none" aria-hidden="true">
        {/* Floating Curiosity Atom (Top Left) */}
        <div className="absolute left-4 top-12 hidden md:block opacity-40 animate-float-slow">
          <svg className="h-16 w-16 text-teal" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="1.5">
            <ellipse cx="30" cy="30" rx="26" ry="9" transform="rotate(35 30 30)" strokeDasharray="3 3" />
            <ellipse cx="30" cy="30" rx="26" ry="9" transform="rotate(-35 30 30)" strokeDasharray="3 3" />
            <circle cx="30" cy="30" r="4" fill="#3c7a6e" />
          </svg>
        </div>

        {/* Floating Idea Spark Lightbulb (Top Right) */}
        <div className="absolute right-12 top-24 hidden lg:block opacity-50 animate-float-reverse">
          <svg className="h-14 w-14 text-amber" viewBox="0 0 50 50" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M 18 22 C 18 14, 32 14, 32 22 C 32 26, 28 28, 28 32 L 22 32 C 22 28, 18 26, 18 22 Z" fill="#fffbeb" />
            <line x1="22" y1="35" x2="28" y2="35" />
            <line x1="23" y1="38" x2="27" y2="38" />
            <line x1="25" y1="8" x2="25" y2="12" />
            <line x1="13" y1="13" x2="16" y2="16" />
            <line x1="37" y1="13" x2="34" y2="16" />
            <line x1="9" y1="24" x2="13" y2="24" />
            <line x1="41" y1="24" x2="37" y2="24" />
          </svg>
        </div>

        {/* Floating Paper Airplane with trail (Bottom Right) */}
        <div className="absolute right-4 bottom-8 hidden md:block opacity-45 animate-float-slow">
          <svg className="h-14 w-24 text-coral" viewBox="0 0 90 55" fill="none">
            <path d="M 6 42 Q 28 52, 40 34 T 52 26 Q 64 12, 74 22" stroke="currentColor" strokeWidth="1.6" strokeDasharray="3 3" strokeLinecap="round" />
            <polygon points="74,16 88,24 78,28 74,24" fill="#e07a5f" />
          </svg>
        </div>

        {/* Floating Open Book Doodle (Bottom Left) */}
        <div className="absolute left-8 bottom-6 hidden md:block opacity-40 animate-float-reverse">
          <svg className="h-12 w-14 text-teal" viewBox="0 0 50 40" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M 25 10 Q 15 6, 5 10 L 5 30 Q 15 26, 25 30 Q 35 26, 45 30 L 45 10 Q 35 6, 25 10 Z" fill="#ffffff" />
            <line x1="25" y1="10" x2="25" y2="30" />
            <path d="M 9 16 Q 16 13, 21 16" strokeDasharray="2 2" />
            <path d="M 29 16 Q 34 13, 41 16" strokeDasharray="2 2" />
          </svg>
        </div>
      </div>

      {/* Section header with elevated typography and hand-drawn arrow annotation */}
      <div className="relative mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
        <div className="relative z-10 max-w-2xl">
          {/* Eyebrow badge with mini vector sparkle */}
          <div className="inline-flex items-center gap-2 rounded-full border border-teal/20 bg-teal/5 px-3.5 py-1 text-xs font-semibold tracking-wider text-teal uppercase backdrop-blur-xs">
            <svg className="h-3.5 w-3.5 text-teal" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
            </svg>
            <span>Subjects we support</span>
          </div>

          {/* Typography inspired by sample: Display Serif + Lush Flowing Script */}
          <h2 className="mt-3 font-display text-3xl sm:text-5xl lg:text-[54px] font-normal tracking-tight text-ink leading-[1.18]">
            A palette for{" "}
            <span className="relative inline-block whitespace-nowrap">
              <span className="font-script text-4xl sm:text-6xl lg:text-[74px] font-normal text-[#238260] px-1 tracking-normal inline-block hover:scale-105 transition-transform duration-300">
                every learner.
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

          {/* Hand-drawn doodle loop arrow pointing to the cards with handwritten note */}
          <div className="relative mt-2.5 flex items-start gap-2.5 sm:gap-3 ml-2 sm:ml-28 md:ml-48">
            <svg
              className="w-10 h-10 sm:w-13 sm:h-13 text-ink-soft/70 shrink-0 transform -rotate-6 pointer-events-none"
              viewBox="0 0 60 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              {/* Downward curving stroke with elegant loop */}
              <path d="M 16 8 C 22 14, 26 26, 18 34 C 12 40, 26 40, 36 36 C 42 34, 48 42, 45 50" />
              <path d="M 37 47 L 45 50 L 47 41" />
            </svg>
            <div className="pt-1.5 sm:pt-2">
              <p className="font-handwriting text-xl sm:text-2xl md:text-3xl text-ink-soft/85 leading-none -rotate-2 select-none">
                find their spark ✦
              </p>
            </div>
          </div>
        </div>

        {/* Artist Palette & Brush Vector Art */}
        <div className="hidden md:flex items-center gap-3 pr-4 pointer-events-none select-none">
          <div className="relative">
            <svg
              className="w-24 h-24 text-ink drop-shadow-sm transform hover:rotate-3 transition-transform duration-300"
              viewBox="0 0 100 100"
              fill="none"
            >
              {/* Palette body */}
              <path
                d="M 50 14 C 26 14, 14 28, 16 52 C 18 68, 28 82, 46 82 C 56 82, 60 72, 70 72 C 80 72, 86 78, 89 66 C 93 48, 84 14, 50 14 Z"
                fill="#ffffff"
                stroke="#2b241f"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Thumb hole */}
              <ellipse cx="64" cy="62" rx="5.5" ry="7.5" fill="#f6efe4" stroke="#2b241f" strokeWidth="1.8" />
              {/* Colorful paint wells */}
              <circle cx="32" cy="30" r="4.5" fill="#e07a5f" />
              <circle cx="48" cy="24" r="4.5" fill="#3c7a6e" />
              <circle cx="68" cy="30" r="4.5" fill="#e8b56a" />
              <circle cx="28" cy="48" r="4.5" fill="#b084cc" />
              {/* Paint brush handle & tip */}
              <path d="M 70 80 L 92 44" stroke="#8b5a2b" strokeWidth="3" strokeLinecap="round" />
              <path d="M 91 46 L 95 38 C 96 36, 92 34, 90 37 L 86 44 Z" fill="#238260" stroke="#2b241f" strokeWidth="1.4" />
              {/* Paint droplet */}
              <circle cx="94" cy="33" r="1.5" fill="#238260" />
            </svg>
            {/* Twinkling starburst near palette */}
            <svg className="absolute -top-1 -right-2 w-5 h-5 text-amber animate-pulse" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
            </svg>
          </div>
        </div>
      </div>

      {/* Carousel stage with touch swipe */}
      <div
        className="relative mx-auto touch-pan-y"
        style={{ height: cardH + 48, maxWidth: 720 }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {/* Decorative subtle sparkles around carousel */}
        <div className="pointer-events-none absolute -left-8 top-1/4 select-none opacity-60 animate-pulse hidden sm:block">
          <svg className="w-5 h-5 text-coral" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
          </svg>
        </div>
        <div className="pointer-events-none absolute -right-8 top-1/3 select-none opacity-60 animate-pulse hidden sm:block">
          <svg className="w-6 h-6 text-teal" viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 0L14.6 9.4L24 12L14.6 14.6L12 24L9.4 14.6L0 12L9.4 9.4L12 0Z" />
          </svg>
        </div>

        <AnimatePresence custom={direction} initial={false}>
          {visible.map((subject, i) => {
            const variant = i === 1 ? "center" : i === 0 ? "left" : "right";
            return (
              <motion.div
                key={subject.slug}
                custom={direction}
                variants={variants}
                initial="hidden"
                animate={variant}
                exit="hidden"
                onClick={() => {
                  if (i === 0) goTo(-1);
                  if (i === 2) goTo(1);
                }}
                className={`absolute top-0 left-1/2 origin-bottom -translate-y-0 ${
                  i !== 1 ? "cursor-pointer" : ""
                }`}
                style={{ width: cardW, height: cardH }}
              >
                <div
                  className={`relative h-full w-full overflow-hidden rounded-3xl border border-white/80 bg-white shadow-[0_20px_60px_rgba(43,36,31,0.13)] select-none transition-shadow duration-300 ${accentBg[subject.accent]}`}
                  style={{
                    boxShadow: i === 1
                      ? `0 24px 64px ${accentGlow[subject.accent]}, 0 8px 24px rgba(43,36,31,0.10)`
                      : undefined,
                  }}
                >
                  <Image
                    src={subject.image}
                    alt={`${subject.name} - ${subject.blurb}`}
                    fill
                    sizes="(max-width: 768px) 240px, 285px"
                    className="object-cover pointer-events-none"
                    priority={i === 1}
                    draggable={false}
                  />
                  <div className="sr-only">
                    <h3>{subject.name}</h3>
                    <p>{subject.blurb}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Prev / Next buttons */}
        <button
          onClick={() => goTo(-1)}
          aria-label="Previous subject"
          className="absolute left-1 sm:left-0 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/80 p-2.5 shadow-md backdrop-blur-sm transition hover:bg-white active:scale-95"
        >
          <svg className="h-4 w-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={() => goTo(1)}
          aria-label="Next subject"
          className="absolute right-1 sm:right-0 top-1/2 z-20 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border border-white/70 bg-white/80 p-2.5 shadow-md backdrop-blur-sm transition hover:bg-white active:scale-95"
        >
          <svg className="h-4 w-4 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Dot indicators */}
        <div className="absolute -bottom-2 inset-x-0 flex justify-center gap-2">
          {subjects.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > activeIndex ? 1 : -1); setPage(i); }}
              aria-label={`Go to subject ${i + 1}`}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 bg-coral" : "w-2 bg-ink/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
