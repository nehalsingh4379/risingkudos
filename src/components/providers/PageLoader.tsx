"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import { usePathname } from "next/navigation";

gsap.registerPlugin(ScrollTrigger);

/**
 * Luxury, high-performance branded preloader for Rising Kudos.
 *
 * Highlights:
 * 1. Hardware-accelerated GPU transforms (scaleX) with zero layout thrashing.
 * 2. Elegant animated aura, floating logo breathing effect, and shimmering gradient bar.
 * 3. Dynamic status beacon with smooth live percentage updates tied to actual asset loading.
 * 4. Waits until background GIF is completely downloaded, decompressed, and frame-painted.
 * 5. Scroll lock during load to prevent jarring scrub desync.
 * 6. Theatrical curtain-up exit reveal with immediate interactive pointer release.
 */
export default function PageLoader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    // Lock page scroll and reset to top during load
    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    window.scrollTo(0, 0);

    const preventScroll = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener("wheel", preventScroll, { passive: false });
    window.addEventListener("touchmove", preventScroll, { passive: false });

    // Ensure pointer events are active on overlay during load
    overlay.style.pointerEvents = "auto";

    // ── 1. Choreographed Entrance Animation ──────────────────────────
    gsap.fromTo(
      content,
      { opacity: 0, y: 20, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 0.55, ease: "power3.out" }
    );

    // Subtle breathing/floating hover on the brand logo
    const floatTween = gsap.to(logoBoxRef.current, {
      y: -4,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    let currentProgress = 0;
    let targetProgress = 0.08;
    let isGifReady =
      !isHome || Boolean((window as unknown as { __bgGifReady?: boolean }).__bgGifReady);
    let isWindowLoaded = typeof document !== "undefined" && document.readyState === "complete";
    let isFontsLoaded = false;
    let isExiting = false;
    let animFrame: number;
    const startTime = performance.now();
    const MIN_DISPLAY_MS = 600;

    // Track window load (scripts, stylesheets, components, and all standard media)
    if (!isWindowLoaded) {
      const onWindowLoad = () => {
        isWindowLoaded = true;
      };
      window.addEventListener("load", onWindowLoad, { once: true });
    }

    // Track web fonts (Google Sans Flex, Oswald, etc.)
    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        isFontsLoaded = true;
      });
    } else {
      isFontsLoaded = true;
    }

    // Helper to verify all DOM <img> elements have finished downloading
    function checkAllImagesComplete(): boolean {
      if (typeof document === "undefined") return true;
      const images = Array.from(document.images);
      if (images.length === 0) return true;
      return images.every((img) => img.complete);
    }

    // ── 2. Hardware-Accelerated Progress Updates ─────────────────────
    function setProgress(val: number) {
      const clamped = Math.min(1, Math.max(0, val));
      const pct = Math.round(clamped * 100);

      if (barFillRef.current) {
        barFillRef.current.style.transform = `scaleX(${clamped})`;
      }
      if (percentRef.current) {
        percentRef.current.textContent = `${pct}%`;
      }

      if (statusRef.current) {
        if (pct < 25) {
          statusRef.current.textContent = "Initializing experience";
        } else if (pct < 65) {
          statusRef.current.textContent = "Loading visual assets";
        } else if (pct < 98) {
          statusRef.current.textContent = "Preparing interface";
        } else {
          statusRef.current.textContent = "Welcome to Rising Kudos";
        }
      }
    }

    // ── 3. Curtain-Up Exit Reveal ─────────────────────────────────────
    function exit() {
      if (isExiting) return;
      isExiting = true;

      cancelAnimationFrame(animFrame);
      clearTimeout(safetyTimer);
      setProgress(1);

      // Restore scroll and user interactions
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);

      if (overlay) {
        overlay.style.pointerEvents = "none";
      }

      floatTween.kill();

      // Absolute failsafe to ensure overlay is gone even on low-power devices
      const safetyHide = setTimeout(() => {
        if (overlay) {
          overlay.style.display = "none";
          overlay.style.pointerEvents = "none";
        }
        ScrollTrigger.refresh();
      }, 1100);

      const exitTl = gsap.timeline({
        delay: 0.05,
        onComplete: () => {
          clearTimeout(safetyHide);
          if (overlay) {
            overlay.style.display = "none";
          }
          ScrollTrigger.refresh();
        },
      });

      // Content gently lifts and fades out
      exitTl.to(content, {
        y: -24,
        opacity: 0,
        scale: 0.96,
        duration: 0.32,
        ease: "power2.in",
      });

      // Theater curtain sweeps smoothly upward
      exitTl.to(
        overlay,
        {
          yPercent: -100,
          duration: 0.65,
          ease: "power3.inOut",
        },
        "-=0.16"
      );
    }

    // ── 4. Asset Progress Driven by Background GIF & DOM Assets ───────
    const onProgress = (e: Event) => {
      const custom = e as CustomEvent;
      const val =
        typeof custom.detail === "number"
          ? custom.detail
          : custom.detail?.progress;
      if (typeof val === "number" && !isNaN(val)) {
        targetProgress = Math.max(targetProgress, Math.min(1, val));
      }
    };

    const onReady = () => {
      isGifReady = true;
    };

    window.addEventListener("page:progress", onProgress);
    window.addEventListener("page:ready", onReady);

    function tick() {
      if (isExiting) return;

      const now = performance.now();
      const elapsed = now - startTime;
      const allImagesDone = checkAllImagesComplete();
      const isEverythingLoaded =
        isGifReady && isWindowLoaded && isFontsLoaded && allImagesDone;

      if (!isHome) {
        // Subpage: driven by images, fonts, and DOM readiness
        const imagesRatio = allImagesDone ? 1 : 0.7;
        const fontsRatio = isFontsLoaded ? 1 : 0.8;
        const windowRatio = isWindowLoaded ? 1 : 0.6;
        const domProgress = (imagesRatio + fontsRatio + windowRatio) / 3;

        targetProgress = Math.max(targetProgress, domProgress);
      } else {
        // Home page: gently creep up to ~15% if initial network packets haven't fired yet
        if (!isGifReady && targetProgress < 0.15) {
          targetProgress = Math.min(0.15, 0.08 + elapsed / 3000);
        }
      }

      if (isEverythingLoaded) {
        targetProgress = 1.0;
      }

      // Smooth interpolation towards targetProgress
      const lerpSpeed = isEverythingLoaded ? 0.14 : 0.07;
      currentProgress += (targetProgress - currentProgress) * lerpSpeed;

      if (isEverythingLoaded && targetProgress >= 0.999 && Math.abs(1 - currentProgress) < 0.01) {
        currentProgress = 1;
      }

      setProgress(currentProgress);

      // Complete once background GIF, images, fonts, and window are completely loaded
      if (isEverythingLoaded && currentProgress >= 0.995 && elapsed >= MIN_DISPLAY_MS) {
        setProgress(1);
        setTimeout(() => {
          exit();
        }, 180);
        return;
      }

      animFrame = requestAnimationFrame(tick);
    }

    animFrame = requestAnimationFrame(tick);

    // Hard fallback failsafe: 12 seconds in case network drops
    const safetyTimer = setTimeout(() => {
      if (!isExiting) {
        isGifReady = true;
        isWindowLoaded = true;
        isFontsLoaded = true;
        targetProgress = 1.0;
        exit();
      }
    }, 12000);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(safetyTimer);
      window.removeEventListener("page:progress", onProgress);
      window.removeEventListener("page:ready", onReady);
      window.removeEventListener("wheel", preventScroll);
      window.removeEventListener("touchmove", preventScroll);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
      floatTween.kill();
      if (overlay) {
        overlay.style.pointerEvents = "none";
        overlay.style.display = "none";
      }
      ScrollTrigger.refresh();
    };
  }, [isHome]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f6efe4] select-none overflow-hidden"
      style={{ willChange: "transform, opacity" }}
    >
      {/* ── Ambient Radial Atmosphere ── */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_46%,rgba(224,122,95,0.15)_0%,rgba(232,181,106,0.08)_38%,rgba(246,239,228,0)_72%)]"
        aria-hidden="true"
      />

      {/* ── Center Content Stage ── */}
      <div
        ref={contentRef}
        className="relative z-10 flex flex-col items-center px-6 text-center"
        style={{ willChange: "transform, opacity" }}
      >
        {/* ── Brand Logo with Warm Ambient Glow ── */}
        <div ref={logoBoxRef} className="relative mb-6 flex items-center justify-center">
          <div className="absolute -inset-6 rounded-full bg-coral/15 blur-2xl animate-pulse" />
          <div className="relative">
            <Image
              src="/logo_1.png"
              alt="Rising Kudos"
              width={180}
              height={64}
              priority
              className="h-14 sm:h-16 w-auto object-contain drop-shadow-sm"
            />
          </div>
        </div>

        {/* ── Status Pill with Pulsing Beacon ── */}
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e2d8c9] bg-white/70 px-3.5 py-1 backdrop-blur-md shadow-xs">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-coral opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-coral" />
          </span>
          <span
            ref={statusRef}
            className="text-[11px] font-semibold tracking-wider text-ink-soft uppercase"
          >
            Initializing experience
          </span>
        </div>

        {/* ── Luxury Gradient Progress Capsule ── */}
        <div className="relative mb-2.5 h-2 w-56 sm:w-64 overflow-hidden rounded-full bg-[#e3dacf] p-[2px] shadow-inner">
          <div
            ref={barFillRef}
            className="relative h-full w-full origin-left rounded-full bg-gradient-to-r from-[#e07a5f] via-[#e8b56a] to-[#3c7a6e] shadow-[0_0_12px_rgba(224,122,95,0.45)]"
            style={{ transform: "scaleX(0)", willChange: "transform" }}
          >
            {/* Shimmer light beam gliding across the fill */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent animate-shimmer" />
          </div>
        </div>

        {/* ── Tabular Percentage Counter ── */}
        <div className="flex items-center justify-center font-mono text-xs font-semibold tracking-wider text-ink-soft/80">
          <span ref={percentRef} className="tabular-nums">
            0%
          </span>
        </div>
      </div>
    </div>
  );
}
