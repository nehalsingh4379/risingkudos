"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { prefersReducedMotion } from "@/lib/motion";

gsap.registerPlugin(ScrollTrigger);

const layers = [
  { className: "left-[8%] top-[18%] h-24 w-24 bg-english", x: -80, y: -40, blur: false },
  { className: "right-[12%] top-[22%] h-16 w-16 bg-maths", x: 90, y: -30, blur: true },
  { className: "left-[18%] bottom-[16%] h-20 w-20 bg-eleven", x: -50, y: 70, blur: false },
  { className: "right-[20%] bottom-[20%] h-28 w-28 bg-science", x: 70, y: 60, blur: true },
  { className: "left-[46%] top-[12%] h-12 w-12 bg-gcse", x: 20, y: -80, blur: false },
];

export default function ScatterField() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el || prefersReducedMotion()) return;

    const bits = el.querySelectorAll<HTMLElement>("[data-layer]");
    const ctx = gsap.context(() => {
      bits.forEach((bit, i) => {
        const meta = layers[i];
        gsap.fromTo(
          bit,
          { x: 0, y: 0, rotate: 0, opacity: 0.9 },
          {
            x: meta.x,
            y: meta.y,
            rotate: i % 2 === 0 ? 12 : -10,
            opacity: 0.35,
            ease: "none",
            scrollTrigger: {
              trigger: el.parentElement,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          },
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={root} className="pointer-events-none absolute inset-0 overflow-hidden">
      {layers.map((layer, i) => (
        <div
          key={i}
          data-layer
          className={`absolute rounded-[28px] opacity-80 ${layer.className} ${layer.blur ? "blur-[1.5px]" : ""}`}
        />
      ))}
    </div>
  );
}
