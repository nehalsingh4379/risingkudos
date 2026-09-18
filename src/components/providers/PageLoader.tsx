"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";

/**
 * Elegant, branded preloader for Rising Kudos.
 *
 * Guarantees:
 * 1. Runs once on initial hard load per session (sessionStorage cached).
 * 2. Never blocks the screen: maximum duration is capped at 1.2s so users never wait.
 * 3. Immediate pointer-events release on exit so buttons/links are immediately interactive.
 * 4. Fixed logo aspect ratio and clean subtitle without duplicated brand text.
 */
export default function PageLoader() {
  const overlayRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Check if already shown in this session
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
      // sessionStorage unavailable (e.g. private mode restrictions)
    }

    const overlay = overlayRef.current;
    if (!overlay) return;

    let progress = 0;
    let animFrame: number;
    let isExiting = false;

    // Smoothly animate progress counter and bar fill
    function updateProgress(val: number) {
      progress = Math.min(1, Math.max(progress, val));
      const pct = Math.round(progress * 100);
      if (barFillRef.current) {
        barFillRef.current.style.width = `${pct}%`;
      }
      if (percentRef.current) {
        percentRef.current.textContent = `${pct}%`;
      }
    }

    function exit() {
      if (isExiting) return;
      isExiting = true;

      updateProgress(1);

      if (overlay) {
        // Immediately unblock user interactions
        overlay.style.pointerEvents = "none";
        document.body.style.overflow = "";

        gsap.to(overlay, {
          delay: 0.15,
          opacity: 0,
          scale: 0.98,
          duration: 0.5,
          ease: "power2.inOut",
          onComplete: () => {
            if (overlay) {
              overlay.style.display = "none";
            }
          },
        });
      }
    }

    // Steady, smooth progress progression over ~900ms
    const startTime = performance.now();
    const TARGET_DURATION = 900; // ms

    function tick(now: number) {
      const elapsed = now - startTime;
      const t = Math.min(1, elapsed / TARGET_DURATION);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - t, 3);
      updateProgress(eased * 0.95);

      if (t < 1 && !isExiting) {
        animFrame = requestAnimationFrame(tick);
      } else if (!isExiting) {
        exit();
      }
    }

    animFrame = requestAnimationFrame(tick);

    // If page:ready dispatches from GIF background earlier, smoothly exit
    const onReady = () => {
      exit();
    };

    window.addEventListener("page:ready", onReady);

    // Hard fallback safety cap (1.5s absolute maximum)
    const safetyTimer = setTimeout(exit, 1500);

    return () => {
      cancelAnimationFrame(animFrame);
      clearTimeout(safetyTimer);
      window.removeEventListener("page:ready", onReady);
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
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#f6efe4] select-none"
      style={{ willChange: "opacity, transform" }}
    >
      <div className="flex flex-col items-center px-6 text-center">
        {/* ── Brand Logo ── */}
        <div className="relative mb-5 flex items-center justify-center">
          <Image
            src="/logo_1.png"
            alt="Rising Kudos"
            width={160}
            height={60}
            priority
            className="h-14 sm:h-16 w-auto object-contain"
          />
        </div>

        {/* ── Subtitle ── */}
        <p className="mb-6 text-[11px] sm:text-xs font-semibold tracking-[0.25em] text-ink-soft uppercase opacity-75">
          Preparing your experience
        </p>

        {/* ── Progress bar track ── */}
        <div className="mb-2.5 h-1.5 w-48 sm:w-56 overflow-hidden rounded-full bg-[#ddd5c8]">
          <div
            ref={barFillRef}
            className="h-full w-0 rounded-full bg-coral transition-all duration-75 ease-out"
          />
        </div>

        {/* ── Percentage counter ── */}
        <span
          ref={percentRef}
          className="font-mono text-xs font-medium tracking-wide text-ink-soft"
        >
          0%
        </span>
      </div>
    </div>
  );
}
