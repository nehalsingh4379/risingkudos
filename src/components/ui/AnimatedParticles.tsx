"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/cn";

export type CursorMode = "disperse" | "attract" | "swirl";

export interface AnimatedParticlesProps {
  className?: string;
  children?: React.ReactNode;
  /** Total number of simulated particles (5,000 to 100,000, default: 45,000) */
  particleCount?: number;
  /** Rendered particle point size (default: 2.6) */
  particleSize?: number;
  /** Particle maximum alpha opacity (0.0 to 1.0, default: 0.9) */
  particleOpacity?: number;
  /** Vector field velocity speed multiplier (default: 1.0) */
  speed?: number;
  /** Curl noise frequency zoom scale (default: 0.004) */
  noiseScale?: number;
  /** Curl noise force displacement strength (default: 0.06) */
  noiseStrength?: number;
  /** Particle lifespan cycle frames (default: 240) */
  lifespan?: number;
  /** Velocity damping friction factor (0.85 to 0.99, default: 0.95) */
  damping?: number;
  /** Whether the particle field responds to cursor motion (default: true) */
  interactive?: boolean;
  /** Physics mode when cursor interacts with particles ("disperse" | "attract" | "swirl") */
  cursorMode?: CursorMode;
  /** Cursor interaction force strength (default: 0.15) */
  cursorStrength?: number;
  /** Cursor interaction influence radius in pixels (default: 140) */
  cursorRadius?: number;
  /** Background canvas color (auto-adapts by theme if undefined) */
  backgroundColor?: string;
}

/** Azure / Cyan Color Palette for Light and Dark Modes */
const AZURE_PALETTE: {
  light: [string, string, string, string];
  dark: [string, string, string, string];
} = {
  light: ["#0284c7", "#06b6d4", "#0284c7", "#0369a1"],
  dark: ["#00f2fe", "#4facfe", "#38bdf8", "#bae6fd"],
};

/** Converts HEX color string ("#00F2FE") to RGB float array ([0, 0.949, 0.996]) */
function hexToRgb(hex: string): [number, number, number] {
  let c = hex.replace("#", "").trim();
  if (c.length === 3) {
    c = c.split("").map((x) => x + x).join("");
  }
  const num = parseInt(c, 16);
  if (isNaN(num)) return [1, 1, 1];
  return [((num >> 16) & 255) / 255, ((num >> 8) & 255) / 255, (num & 255) / 255];
}

const VERTEX_SHADER = `
attribute vec2 a_position;
attribute float a_life;
attribute float a_maxLife;
attribute vec3 a_color;

uniform vec2 u_resolution;
uniform float u_particleSize;
uniform float u_particleOpacity;

varying float v_alpha;
varying vec3 v_color;

void main() {
    float lifeRatio = clamp(a_life / a_maxLife, 0.0, 1.0);
    v_alpha = sin(lifeRatio * 3.14159265) * u_particleOpacity;
    v_color = a_color;

    vec2 clipSpace = (a_position / u_resolution) * 2.0 - 1.0;
    gl_Position = vec4(clipSpace * vec2(1.0, -1.0), 0.0, 1.0);
    gl_PointSize = u_particleSize;
}
`;

const FRAGMENT_SHADER = `
precision highp float;

varying float v_alpha;
varying vec3 v_color;

void main() {
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    gl_FragColor = vec4(v_color, v_alpha);
}
`;

/**
 * AnimatedParticles
 *
 * A high-performance WebGL particle vector field component.
 * Renders a freely-flowing field of randomly distributed azure/cyan particles
 * driven by curl-noise motion, with optional cursor interaction.
 */
export function AnimatedParticles({
  className,
  children,
  particleCount = 45000,
  particleSize = 2.6,
  particleOpacity = 0.9,
  speed = 1.0,
  noiseScale = 0.004,
  noiseStrength = 0.06,
  lifespan = 240,
  damping = 0.95,
  interactive = true,
  cursorMode = "disperse",
  cursorStrength = 0.15,
  cursorRadius = 140,
  backgroundColor,
}: AnimatedParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, active: false });
  const { resolvedTheme, theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);

  useEffect(() => {
    setMounted(true);
    const checkIsLight = () => {
      if (typeof document !== "undefined") {
        if (document.documentElement.classList.contains("dark")) return false;
        if (document.documentElement.classList.contains("light")) return true;
      }
      if (resolvedTheme) return resolvedTheme === "light";
      if (theme) return theme === "light";
      if (typeof window !== "undefined" && window.matchMedia) {
        return !window.matchMedia("(prefers-color-scheme: dark)").matches;
      }
      return false;
    };

    setIsLightMode(checkIsLight());

    if (typeof document !== "undefined") {
      const observer = new MutationObserver(() => {
        setIsLightMode(checkIsLight());
      });
      observer.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class"],
      });
      return () => observer.disconnect();
    }
  }, [resolvedTheme, theme]);

  const paletteKey = mounted && isLightMode ? "light" : "dark";
  const activeColors = AZURE_PALETTE[paletteKey];

  const resolvedBg =
    backgroundColor ?? (mounted && isLightMode ? "#ffffff" : "#07090e");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl =
      canvas.getContext("webgl") ||
      (canvas.getContext("experimental-webgl") as WebGLRenderingContext | null);
    if (!gl) return;

    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.warn("[AnimatedParticles] Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vert = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const frag = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vert || !frag) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vert);
    gl.attachShader(program, frag);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.warn("[AnimatedParticles] Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Locations
    const aPosition = gl.getAttribLocation(program, "a_position");
    const aLife = gl.getAttribLocation(program, "a_life");
    const aMaxLife = gl.getAttribLocation(program, "a_maxLife");
    const aColor = gl.getAttribLocation(program, "a_color");

    const uResolution = gl.getUniformLocation(program, "u_resolution");
    const uParticleSize = gl.getUniformLocation(program, "u_particleSize");
    const uParticleOpacity = gl.getUniformLocation(program, "u_particleOpacity");

    // Particle CPU State Arrays
    const count = Math.max(1000, Math.min(100000, particleCount));
    const positions = new Float32Array(count * 2);
    const velocities = new Float32Array(count * 2);
    const lives = new Float32Array(count);
    const maxLives = new Float32Array(count);
    const colorAttrs = new Float32Array(count * 3);

    const parsedColors = activeColors.map((c) => hexToRgb(c));

    const initParticle = (i: number, w: number, h: number) => {
      positions[i * 2] = Math.random() * w;
      positions[i * 2 + 1] = Math.random() * h;
      velocities[i * 2] = (Math.random() - 0.5) * 1.5;
      velocities[i * 2 + 1] = (Math.random() - 0.5) * 1.5;

      const mLife = lifespan * (0.8 + Math.random() * 0.4);
      maxLives[i] = mLife;
      lives[i] = Math.random() * mLife;

      const colorRGB = parsedColors[Math.floor(Math.random() * parsedColors.length)] || [1, 1, 1];
      colorAttrs[i * 3] = colorRGB[0];
      colorAttrs[i * 3 + 1] = colorRGB[1];
      colorAttrs[i * 3 + 2] = colorRGB[2];
    };

    const respawnParticle = (i: number, w: number, h: number) => {
      positions[i * 2] = Math.random() * w;
      positions[i * 2 + 1] = Math.random() * h;

      const mLife = lifespan * (0.8 + Math.random() * 0.4);
      maxLives[i] = mLife;
      lives[i] = 0;

      const colorRGB = parsedColors[Math.floor(Math.random() * parsedColors.length)] || [1, 1, 1];
      colorAttrs[i * 3] = colorRGB[0];
      colorAttrs[i * 3 + 1] = colorRGB[1];
      colorAttrs[i * 3 + 2] = colorRGB[2];
    };

    // GPU Buffers
    const posBuffer = gl.createBuffer();
    const lifeBuffer = gl.createBuffer();
    const maxLifeBuffer = gl.createBuffer();
    const colorBuffer = gl.createBuffer();

    let animationFrameId: number;
    let time = 0;

    const bgRgb = hexToRgb(resolvedBg);

    const render = () => {
      if (!canvas || !gl) return;

      const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
      const displayWidth = Math.floor(canvas.clientWidth * dpr);
      const displayHeight = Math.floor(canvas.clientHeight * dpr);

      if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
        canvas.width = displayWidth;
        canvas.height = displayHeight;
        gl.viewport(0, 0, displayWidth, displayHeight);
        for (let i = 0; i < count; i++) {
          initParticle(i, displayWidth, displayHeight);
        }
      }

      time += 0.01 * speed;

      // Particle physics update
      for (let i = 0; i < count; i++) {
        lives[i] += 1;
        if (lives[i] >= maxLives[i]) {
          respawnParticle(i, displayWidth, displayHeight);
        }

        const px = positions[i * 2];
        const py = positions[i * 2 + 1];

        // Curl noise flow field vector
        const angle =
          Math.sin(px * noiseScale + time) *
          Math.cos(py * noiseScale + time) *
          Math.PI *
          2;

        const curlMag = noiseStrength * 2.2;
        const fx = Math.cos(angle) * curlMag;
        const fy = Math.sin(angle) * curlMag;

        velocities[i * 2] = (velocities[i * 2] + fx) * damping;
        velocities[i * 2 + 1] = (velocities[i * 2 + 1] + fy) * damping;

        // Interactive cursor physics
        if (interactive && mouseRef.current.active) {
          const dx = px - mouseRef.current.x;
          const dy = py - mouseRef.current.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < cursorRadius && dist > 0) {
            const factor = (1 - dist / cursorRadius) * cursorStrength;

            if (cursorMode === "disperse") {
              const pushX = (dx / dist) * factor * 16.0 + mouseRef.current.vx * factor * 0.8;
              const pushY = (dy / dist) * factor * 16.0 + mouseRef.current.vy * factor * 0.8;
              velocities[i * 2] += pushX;
              velocities[i * 2 + 1] += pushY;
            } else if (cursorMode === "attract") {
              const pullX = -(dx / dist) * factor * 12.0;
              const pullY = -(dy / dist) * factor * 12.0;
              velocities[i * 2] += pullX;
              velocities[i * 2 + 1] += pullY;
            } else if (cursorMode === "swirl") {
              const perpX = -dy / dist;
              const perpY = dx / dist;
              velocities[i * 2] += perpX * factor * 14.0;
              velocities[i * 2 + 1] += perpY * factor * 14.0;
            }
          }
        }

        positions[i * 2] += velocities[i * 2];
        positions[i * 2 + 1] += velocities[i * 2 + 1];

        // Wrap around canvas boundaries
        if (positions[i * 2] < -20) positions[i * 2] = displayWidth + 20;
        else if (positions[i * 2] > displayWidth + 20) positions[i * 2] = -20;

        if (positions[i * 2 + 1] < -20) positions[i * 2 + 1] = displayHeight + 20;
        else if (positions[i * 2 + 1] > displayHeight + 20) positions[i * 2 + 1] = -20;
      }

      // Clear Canvas
      gl.clearColor(bgRgb[0], bgRgb[1], bgRgb[2], 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.uniform2f(uResolution, displayWidth, displayHeight);
      gl.uniform1f(uParticleSize, particleSize);
      gl.uniform1f(uParticleOpacity, particleOpacity);

      // Stream buffers to GPU
      gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, positions, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aPosition);
      gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, lives, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aLife);
      gl.vertexAttribPointer(aLife, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, maxLifeBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, maxLives, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aMaxLife);
      gl.vertexAttribPointer(aMaxLife, 1, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, colorAttrs, gl.DYNAMIC_DRAW);
      gl.enableVertexAttribArray(aColor);
      gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.POINTS, 0, count);

      // Damp mouse velocities
      mouseRef.current.vx *= 0.88;
      mouseRef.current.vy *= 0.88;

      animationFrameId = requestAnimationFrame(render);
    };

    // Initialize all particles
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    const initialW = (canvas.clientWidth || window.innerWidth) * dpr;
    const initialH = (canvas.clientHeight || window.innerHeight) * dpr;
    for (let i = 0; i < count; i++) {
      initParticle(i, initialW, initialH);
    }

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (gl) {
        gl.deleteProgram(program);
        gl.deleteShader(vert);
        gl.deleteShader(frag);
        gl.deleteBuffer(posBuffer);
        gl.deleteBuffer(lifeBuffer);
        gl.deleteBuffer(maxLifeBuffer);
        gl.deleteBuffer(colorBuffer);
      }
    };
  }, [
    particleCount,
    particleSize,
    particleOpacity,
    speed,
    noiseScale,
    noiseStrength,
    lifespan,
    damping,
    interactive,
    cursorMode,
    cursorStrength,
    cursorRadius,
    resolvedBg,
    activeColors,
  ]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!interactive || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    const newX = (e.clientX - rect.left) * dpr;
    const newY = (e.clientY - rect.top) * dpr;

    if (mouseRef.current.x !== -9999) {
      mouseRef.current.vx = newX - mouseRef.current.x;
      mouseRef.current.vy = newY - mouseRef.current.y;
    }
    mouseRef.current.x = newX;
    mouseRef.current.y = newY;
    mouseRef.current.active = true;
  };

  const handleMouseLeave = () => {
    if (!interactive) return;
    mouseRef.current.active = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!interactive || !canvasRef.current || !e.touches[0]) return;
    const touch = e.touches[0];
    const rect = canvasRef.current.getBoundingClientRect();
    const dpr = Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2);
    const newX = (touch.clientX - rect.left) * dpr;
    const newY = (touch.clientY - rect.top) * dpr;

    if (mouseRef.current.x !== -9999) {
      mouseRef.current.vx = (newX - mouseRef.current.x) * 1.2;
      mouseRef.current.vy = (newY - mouseRef.current.y) * 1.2;
    }
    mouseRef.current.x = newX;
    mouseRef.current.y = newY;
    mouseRef.current.active = true;
  };

  const handleTouchEnd = () => {
    if (!interactive) return;
    mouseRef.current.active = false;
    mouseRef.current.x = -9999;
    mouseRef.current.y = -9999;
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      className={cn("relative w-full h-full overflow-hidden bg-background touch-pan-y", className)}
    >
      {/* WebGL Particle Simulation Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full block pointer-events-none z-1"
      />

      {/* Children Layer */}
      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
}

export default AnimatedParticles;
