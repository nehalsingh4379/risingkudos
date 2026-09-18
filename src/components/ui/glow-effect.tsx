"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface GlowEffectProps {
  colors?: string[];
  mode?: "rotate" | "pulse" | "breathe" | "colorCycle" | "static";
  blur?: "softest" | "soft" | "medium" | "strong" | "strongest" | number;
  duration?: number;
  scale?: number;
  className?: string;
}

const DEFAULT_COLORS = ["#ff96a9", "#e8b4f0", "#ffb3c6", "#d44d8a", "#ff96a9"];

const BLUR_MAP: Record<string, string> = {
  softest: "blur(6px)",
  soft: "blur(12px)",
  medium: "blur(20px)",
  strong: "blur(30px)",
  strongest: "blur(40px)",
};

export function GlowEffect({
  colors = DEFAULT_COLORS,
  mode = "rotate",
  blur = "medium",
  duration = 5,
  scale = 1.2,
  className,
}: GlowEffectProps) {
  const blurStyle = typeof blur === "number" ? `blur(${blur}px)` : BLUR_MAP[blur] || BLUR_MAP.medium;
  const gradient = React.useMemo(() => {
    return `conic-gradient(from 0deg, ${colors.join(", ")})`;
  }, [colors]);

  const animationProps = React.useMemo(() => {
    switch (mode) {
      case "rotate":
        return {
          animate: { rotate: 360 },
          transition: {
            duration,
            repeat: Infinity,
            ease: "linear" as const,
          },
        };
      case "pulse":
        return {
          animate: { opacity: [0.4, 1, 0.4], scale: [scale * 0.95, scale * 1.05, scale * 0.95] },
          transition: {
            duration,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };
      case "breathe":
        return {
          animate: { scale: [scale * 0.98, scale * 1.03, scale * 0.98] },
          transition: {
            duration,
            repeat: Infinity,
            ease: "easeInOut" as const,
          },
        };
      case "static":
      default:
        return {};
    }
  }, [mode, duration, scale]);

  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      style={{ filter: blurStyle }}
    >
      <motion.div
        className="absolute -inset-[50%] h-[200%] w-[200%]"
        style={{
          background: gradient,
          transformOrigin: "center center",
        }}
        {...animationProps}
      />
    </div>
  );
}
