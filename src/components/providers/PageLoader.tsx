"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import gsap from "gsap";

/**
 * Full-screen branded preloader — matches the Rising Kudos design.
 *
 * Shows on:
 *  1. First hard load of ANY page   (useEffect with [] deps — StrictMode-safe)
 *  2. Client-side navigation TO "/" from a different page (back button etc.)
 *
 * Does NOT show when leaving "/" to go to another page.
 *
 * Progress is driven by `page:progress` CustomEvent (detail: 0–1) dispatched
 * by ScrollGifBackground. Loader exits on `page:ready` or 12 s fallback.
 */

export default function PageLoader() {
  const pathname = usePathname();

  const overlayRef = useRef<HTMLDivElement>(null);
  const barFillRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);

  // Activation state — stable refs, no React re-renders
  const exitedRef  = useRef(false);
  const realPctRef = useRef(0);
  const displayRef = useRef(0);
  const rafRef     = useRef<number | null>(null);
  const killRef    = useRef<(() => void) | null>(null);

  // ── write progress to DOM without re-render ─────────────────────────────
  function applyDisplay(v: number) {
    displayRef.current = v;
    if (barFillRef.current) barFillRef.current.style.width = `${(v * 100).toFixed(1)}%`;
    if (percentRef.current) percentRef.current.textContent = `${Math.round(v * 100)}%`;
  }

  function showOverlay() {
    const el = overlayRef.current;
    if (!el) return;
    gsap.killTweensOf(el);
    el.style.display = "flex";
    el.style.opacity = "1";
  }

  // ── core activation logic ────────────────────────────────────────────────
  function activate(isHome: boolean) {
    // Tear down any previous in-flight activation
    killRef.current?.();

    exitedRef.current  = false;
    realPctRef.current = 0;
    displayRef.current = 0;
    applyDisplay(0);
    showOverlay();
    document.body.style.overflow = "hidden";

    // Smooth progress chase loop
    function tick() {
      const real    = realPctRef.current;
      const display = displayRef.current;
      const target  = real > 0 ? real : Math.min(0.88, display + 0.0012);
      const next    = display + (target - display) * 0.055;
      if (Math.abs(next - display) > 0.0002) applyDisplay(next);
      rafRef.current = requestAnimationFrame(tick);
    }
    rafRef.current = requestAnimationFrame(tick);

    function exit() {
      if (exitedRef.current) return;
      exitedRef.current = true;
      document.body.style.overflow = "";
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      applyDisplay(1);
      const overlay = overlayRef.current;
      if (!overlay) return;
      gsap.to(overlay, {
        delay: 0.45,
        opacity: 0,
        duration: 0.65,
        ease: "power2.inOut",
        onComplete: () => { if (overlay) overlay.style.display = "none"; },
      });
    }

    const MIN_MS    = isHome ? 2000 : 800;
    const startedAt = Date.now();
    let readyPending = false;

    function onProgress(e: Event) { realPctRef.current = (e as CustomEvent<number>).detail; }
    function onReady() {
      if (readyPending) return;
      readyPending = true;
      const remaining = Math.max(0, MIN_MS - (Date.now() - startedAt));
      setTimeout(exit, remaining);
    }

    window.addEventListener("page:progress", onProgress);
    window.addEventListener("page:ready",    onReady);

    const hardFallback = setTimeout(exit, 12_000);
    const quickExit    = isHome ? null : setTimeout(exit, 1200);

    killRef.current = () => {
      window.removeEventListener("page:progress", onProgress);
      window.removeEventListener("page:ready",    onReady);
      clearTimeout(hardFallback);
      if (quickExit) clearTimeout(quickExit);
      if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
      document.body.style.overflow = "";
    };
  }

  // ── Effect 1: First hard load ────────────────────────────────────────────
  // Empty deps → runs once on mount. Uses window.location (not pathname prop)
  // so it works even if pathname hasn't resolved yet. StrictMode-safe because
  // activate() is idempotent and teardown is clean.
  useEffect(() => {
    const isHome = window.location.pathname === "/";
    activate(isHome);
    return () => { killRef.current?.(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Effect 2: Client-side back-navigation TO "/" ─────────────────────────
  // Skips the very first render (that's handled by Effect 1 above).
  // Only activates when user navigates TO "/" from a different page.
  const mountedRef  = useRef(false);
  const prevPathRef = useRef<string>("/");

  useEffect(() => {
    // Skip first render — Effect 1 already handled it
    if (!mountedRef.current) {
      mountedRef.current = true;
      prevPathRef.current = pathname;
      return;
    }

    const prev = prevPathRef.current;
    prevPathRef.current = pathname;

    // Show ONLY when arriving at "/" from a different page
    if (pathname === "/" && prev !== "/") {
      activate(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // ────────────────────────────────────────────────────────────────────────────
  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        background: "#f6efe4",
        willChange: "opacity",
      }}
    >
      {/* ── Rising Kudos Logo ── */}
      <Image
        src="/logo_1.png"
        alt="Rising Kudos logo"
        width={200}
        height={200}
        priority
        style={{ marginTop: "48px", marginBottom: "24px", objectFit: "contain" }}
      />

      {/* ── Brand Name ── */}
      <p
        style={{
          fontFamily: "var(--font-fraunces), ui-serif, Georgia, serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#2b241f",
          marginBottom: "6px",
          lineHeight: 1,
        }}
      >
        Rising Kudos
      </p>

      {/* ── Subtitle ── */}
      <p
        style={{
          fontSize: "0.65rem",
          fontWeight: 500,
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          color: "#5d534b",
          marginBottom: "28px",
        }}
      >
        Preparing your experience
      </p>

      {/* ── Progress bar track ── */}
      <div
        style={{
          width: "240px",
          height: "6px",
          borderRadius: "999px",
          background: "#ddd5c8",
          overflow: "hidden",
          marginBottom: "10px",
        }}
      >
        <div
          ref={barFillRef}
          style={{
            height: "100%",
            width: "0%",
            borderRadius: "999px",
            background: "#c45d43",
            transition: "width 0.1s linear",
          }}
        />
      </div>

      {/* ── Percentage ── */}
      <span
        ref={percentRef}
        style={{
          fontSize: "0.78rem",
          fontWeight: 500,
          letterSpacing: "0.05em",
          color: "#5d534b",
        }}
      >
        0%
      </span>
    </div>
  );
}
