"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface FluidBlobsProps {
  lightColors?: string[];
  darkColors?: string[];
  origins?: { x: number; y: number }[];
  margin?: number;
  blur?: number;
  className?: string;
  interactive?: boolean;
  mouseTrail?: boolean;
  opacity?: number;
  restingOpacity?: number;
  ambientMotion?: boolean;
}

const DEFAULT_LIGHT = ["#ff0020", "#fc0f60", "#e8227a", "#ff85b3"];
const DEFAULT_DARK = ["#8c0f60", "#e8227a", "#e8227a", "#ff85b3"];

interface BlobState {
  x: number;
  y: number;
  lag: number;
  size: number;
  color: string;
  offsetX: number;
  offsetY: number;
}

export function FluidBlobs({
  lightColors = DEFAULT_LIGHT,
  darkColors = DEFAULT_DARK,
  origins = [
    { x: 50, y: -55 },
    { x: 50, y: -25 },
    { x: 50, y: -25 },
    { x: 50, y: -25 },
  ],
  margin = 60,
  blur = 50,
  className,
  interactive = true,
  mouseTrail = true,
  opacity = 1,
  restingOpacity = 0,
  ambientMotion = true,
}: FluidBlobsProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const blobRefs = React.useRef<(HTMLDivElement | null)[]>([]);

  // Choose colors
  const colors = lightColors && lightColors.length > 0 ? lightColors : DEFAULT_LIGHT;

  React.useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Attach pointer listeners to parent card if possible so tracking is frictionless across card
    const targetElement = (interactive && container.parentElement) ? container.parentElement : container;

    let animId: number;
    let isHovered = false;

    // Dimensions
    let width = targetElement.clientWidth || 300;
    let height = targetElement.clientHeight || 400;

    const updateDimensions = () => {
      width = targetElement.clientWidth || 300;
      height = targetElement.clientHeight || 400;
    };
    window.addEventListener("resize", updateDimensions);

    // Initial resting positions based on origins (origins are in percentages: { x: 50, y: -25 })
    const getOriginPos = (index: number) => {
      const orig = origins[index % origins.length] || { x: 50, y: 50 };
      return {
        x: (orig.x / 100) * width,
        y: (orig.y / 100) * height,
      };
    };

    // Initialize blobs state
    const configs: BlobState[] = [
      { x: getOriginPos(0).x, y: getOriginPos(0).y, lag: 0.16, size: 240, color: colors[0 % colors.length], offsetX: 0, offsetY: 0 },
      { x: getOriginPos(1).x, y: getOriginPos(1).y, lag: 0.10, size: 280, color: colors[1 % colors.length], offsetX: 30, offsetY: -25 },
      { x: getOriginPos(2).x, y: getOriginPos(2).y, lag: 0.07, size: 220, color: colors[2 % colors.length], offsetX: -25, offsetY: 30 },
      { x: getOriginPos(3).x, y: getOriginPos(3).y, lag: 0.04, size: 260, color: colors[3 % colors.length], offsetX: 20, offsetY: 35 },
    ];

    let targetX = width / 2;
    let targetY = height / 2;

    const handlePointerEnter = (e: PointerEvent) => {
      isHovered = true;
      const rect = targetElement.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (container) {
        container.style.opacity = `${opacity}`;
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      isHovered = true;
      const rect = targetElement.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (container) {
        container.style.opacity = `${opacity}`;
      }
    };

    const handlePointerLeave = () => {
      isHovered = false;
      if (!mouseTrail) return;
      if (container) {
        // Return to resting opacity
        container.style.opacity = `${restingOpacity}`;
      }
    };

    if (interactive && mouseTrail) {
      targetElement.addEventListener("pointerenter", handlePointerEnter);
      targetElement.addEventListener("pointermove", handlePointerMove);
      targetElement.addEventListener("pointerleave", handlePointerLeave);
    }

    const render = () => {
      const time = performance.now() * 0.0015;
      configs.forEach((blob, idx) => {
        const ambX = ambientMotion ? Math.sin(time + idx * 1.6) * (width * 0.18) : 0;
        const ambY = ambientMotion ? Math.cos(time + idx * 2.1) * (height * 0.22) : 0;

        const destX = isHovered && mouseTrail
          ? targetX + blob.offsetX
          : getOriginPos(idx).x + ambX;
        const destY = isHovered && mouseTrail
          ? targetY + blob.offsetY
          : getOriginPos(idx).y + ambY;

        // Smooth trailing interpolation
        blob.x += (destX - blob.x) * blob.lag;
        blob.y += (destY - blob.y) * blob.lag;

        const el = blobRefs.current[idx];
        if (el) {
          // Center the blob at (x, y)
          const tx = blob.x - blob.size / 2;
          const ty = blob.y - blob.size / 2;
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
        }
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", updateDimensions);
      if (interactive && mouseTrail) {
        targetElement.removeEventListener("pointerenter", handlePointerEnter);
        targetElement.removeEventListener("pointermove", handlePointerMove);
        targetElement.removeEventListener("pointerleave", handlePointerLeave);
      }
    };
  }, [interactive, mouseTrail, opacity, restingOpacity, ambientMotion, colors, origins]);

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden transition-opacity duration-500 ease-out",
        mouseTrail && restingOpacity === 0 ? "opacity-0" : "opacity-100",
        className
      )}
      style={{
        filter: `blur(${blur}px)`,
        opacity: restingOpacity > 0 ? restingOpacity : undefined,
      }}
      aria-hidden="true"
    >
      {[0, 1, 2, 3].map((index) => {
        const color = colors[index % colors.length];
        const size = index === 1 ? 280 : index === 3 ? 260 : 230;
        return (
          <div
            key={index}
            ref={(el) => {
              blobRefs.current[index] = el;
            }}
            className="absolute rounded-full will-change-transform"
            style={{
              width: size,
              height: size,
              background: `radial-gradient(circle, ${color} 0%, ${color}b0 40%, transparent 72%)`,
            }}
          />
        );
      })}
    </div>
  );
}
