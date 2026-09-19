"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

/**
 * Luxury, high-performance branded preloader for Rising Kudos.
 *
 * Highlights:
 * 1. Hardware-accelerated GPU transforms (scaleX) with zero layout thrashing.
 * 2. Elegant animated aura, floating logo breathing effect, and shimmering gradient bar.
 * 3. Dynamic status beacon with smooth live percentage updates.
 * 4. Theatrical curtain-up exit reveal with immediate interactive pointer release.
 * 5. Clean session tracking: persists across in-page navigation, but smoothly replays on reload.
 */
export default function PageLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const logoBoxRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check if already shown in this session (skips on SPA route changes)
    try {
      if (sessionStorage.getItem("rk_loader_shown")) {
        if (overlayRef.current) {
          overlayRef.current.style.display = "none";
          overlayRef.current.style.pointerEvents = "none";
        }
        return;
      }
      sessionStorage.setItem("rk_loader_shown", "1");
    } catch {
      // sessionStorage unavailable
    }

    // Clear session flag on page unload so refreshing (F5) re-enables the animation
    const handleBeforeUnload = () => {
      try {
        sessionStorage.removeItem("rk_loader_shown");
      } catch {
        // ignore
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);

    const overlay = overlayRef.current;
    const content = contentRef.current;
    if (!overlay || !content) return;

    // Prevent background scrolling while loading
    document.body.style.overflow = "hidden";

    // ── 1. Choreographed Entrance Animation ──────────────────────────
    gsap.fromTo(
      content,
      { opacity: 0, y: 22, scale: 0.94 },
      { opacity: 1, y: 0, scale: 1, duration: 0.6, ease: "power3.out" }
    );

    // Subtle breathing/floating hover on the brand logo
    const floatTween = gsap.to(logoBoxRef.current, {
      y: -4,
      duration: 1.5,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });

    let animFrame: number;
    let isExiting = false;

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
        if (pct < 35) {
          statusRef.current.textContent = "Initializing experience";
        } else if (pct < 75) {
          statusRef.current.textContent = "Crafting interface";
        } else if (pct < 100) {
          statusRef.current.textContent = "Preparing assets";
        } else {
          statusRef.current.textContent = "Welcome to Rising Kudos";
        }
      }
    }

    // ── 3. Curtain-Up Exit Reveal ─────────────────────────────────────
    function exit() {
      if (isExiting) return;
      isExiting = true;

      setProgress(1);

      // Instantly free user interactions
      if (overlay) {
        overlay.style.pointerEvents = "none";
      }
      document.body.style.overflow = "";

      floatTween.kill();

      const exitTl = gsap.timeline({
        delay: 0.12,
        onComplete: () => {
          if (overlay) {
            overlay.style.display = "none";
          }
        },
      });

      // Content gently lifts and fades out
      exitTl.to(content, {
        y: -26,
        opacity: 0,
        scale: 0.96,
        duration: 0.36,
        ease: "power2.in",
      });

      // Theater curtain sweeps smoothly upward
      exitTl.to(
        overlay,
        {
          yPercent: -100,
          duration: 0.68,
          ease: "power4.inOut",
        },
        "-=0.18"
      );
    }

    // ── 4. Natural Progress Driver (~950ms) ───────────────────────────
    const startTime = performance.now();
    const TARGET_DURATION = 950;

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / TARGET_DURATION);
      // Buttery smooth cubic ease-out curve
      const eased = 1 - Math.pow(1 - t, 3);
      setProgress(eased);

      if (t < 1 && !isExiting) {
        animFrame = requestAnimationFrame(tick);
      } else if (!isExiting) {
        exit();
      }
    }

    animFrame = requestAnimationFrame(tick);

    // Also respond if background signals ready
    const onReady = () => {
      exit();
    };
    window.addEventListener("page:ready", onReady);

    // Hard fallback cap at 1.4s
    const safetyTimer = setTimeout(exit, 1400);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(safetyTimer);
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("page:ready", onReady);
      floatTween.kill();
      document.body.style.overflow = "";
      if (overlay) {
        overlay.style.pointerEvents = "none";
        overlay.style.display = "none";
      }
    };
  }, []);

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
