"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

interface InteractiveGridPatternProps extends React.SVGProps<SVGSVGElement> {
  width?: number;
  height?: number;
  squares?: [number, number]; // [horizontal, vertical]
  className?: string;
  /** Coral fill on hover */
  hoverFill?: string;
  /** Coral stroke on hover */
  hoverStroke?: string;
  /** Idle stroke colour */
  defaultStroke?: string;
}

/**
 * SVG grid that lights up cells as the cursor moves over it.
 *
 * Uses a global `mousemove` listener + bounding-rect math so the SVG itself
 * can be `pointer-events: none` — meaning it never blocks elements stacked
 * on top of it (e.g. the ThreeDSlider cards above it).
 */
export function InteractiveGridPattern({
  width = 40,
  height = 40,
  squares = [24, 24],
  className,
  hoverFill = "rgba(224,122,95,0.13)",
  hoverStroke = "rgba(224,122,95,0.50)",
  defaultStroke = "rgba(43,36,31,0.09)",
  ...props
}: InteractiveGridPatternProps) {
  const [horizontal, vertical] = squares;
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredSquare, setHoveredSquare] = useState<number | null>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    function onMouseMove(e: MouseEvent) {
      const rect = svg!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Outside SVG bounds → clear
      if (x < 0 || y < 0 || x > rect.width || y > rect.height) {
        setHoveredSquare(null);
        return;
      }

      // Cell dimensions scale with the actual rendered size
      const cellW = rect.width / horizontal;
      const cellH = rect.height / vertical;
      const col = Math.floor(x / cellW);
      const row = Math.floor(y / cellH);

      // Clamp to valid range
      const safeCol = Math.max(0, Math.min(horizontal - 1, col));
      const safeRow = Math.max(0, Math.min(vertical - 1, row));
      setHoveredSquare(safeRow * horizontal + safeCol);
    }

    function onMouseLeave(e: MouseEvent) {
      // Extra guard: clear if cursor leaves the viewport
      const rect = svg!.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        setHoveredSquare(null);
      }
    }

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseleave", onMouseLeave, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [horizontal, vertical]);

  return (
    <svg
      ref={svgRef}
      width={width * horizontal}
      height={height * vertical}
      // pointer-events:none → never blocks slider or any element above
      style={{ pointerEvents: "none" }}
      className={cn("absolute inset-0 h-full w-full", className)}
      {...props}
    >
      {Array.from({ length: horizontal * vertical }).map((_, index) => {
        const x = (index % horizontal) * width;
        const y = Math.floor(index / horizontal) * height;
        const isHovered = hoveredSquare === index;

        return (
          <rect
            key={index}
            x={x}
            y={y}
            width={width}
            height={height}
            fill={isHovered ? hoverFill : "transparent"}
            stroke={isHovered ? hoverStroke : defaultStroke}
            strokeWidth={1}
            style={{
              transition: isHovered
                ? "fill 60ms ease, stroke 60ms ease"
                : "fill 1000ms ease, stroke 1000ms ease",
            }}
          />
        );
      })}
    </svg>
  );
}
