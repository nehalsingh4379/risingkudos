"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Avoid jarring reflow jumps on mobile when URL bar expands/collapses
    ScrollTrigger.config({ ignoreMobileResize: true });

    if (prefersReducedMotion()) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.0,
      smoothWheel: true,
      syncTouch: false,
    });

    lenis.on("scroll", ScrollTrigger.update);

    // On Android / touch devices with syncTouch: false, native touch scrolling does not
    // pass through Lenis. We must listen to window scroll to keep GSAP ScrollTrigger in sync.
    const onNativeScroll = () => {
      ScrollTrigger.update();
    };
    window.addEventListener("scroll", onNativeScroll, { passive: true });

    const onTick = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(onTick);
    gsap.ticker.lagSmoothing(0);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);

    return () => {
      window.removeEventListener("scroll", onNativeScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
      gsap.ticker.remove(onTick);
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
