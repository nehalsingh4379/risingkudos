"use client";

import React, { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";

interface LiquidGlassBoxProps {
  children?: React.ReactNode;
  className?: string;
  sourceImage?: string;
  opacity?: number;
}

const vsSource = `
  attribute vec2 position;
  void main() {
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fsSource = `
  precision highp float;

  uniform vec3 iResolution;
  uniform float iTime;
  uniform vec4 iMouse;
  uniform sampler2D iChannel0;

  // Pseudo-random & simplex noise helpers
  vec2 hash2(vec2 p) {
    p = vec2(dot(p, vec2(127.1, 311.7)), dot(p, vec2(269.5, 183.3)));
    return -1.0 + 2.0 * fract(sin(p) * 43758.5453123);
  }

  float snoise(vec2 p) {
    const float K1 = 0.366025404; // (sqrt(3)-1)/2;
    const float K2 = 0.211324865; // (3-sqrt(3))/6;
    vec2 i = floor(p + (p.x + p.y) * K1);
    vec2 a = p - i + (i.x + i.y) * K2;
    vec2 o = (a.x > a.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec2 b = a - o + K2;
    vec2 c = a - 1.0 + 2.0 * K2;
    vec3 h = max(0.5 - vec3(dot(a, a), dot(b, b), dot(c, c)), 0.0);
    vec3 n = h * h * h * h * vec3(dot(a, hash2(i)), dot(b, hash2(i + o)), dot(c, hash2(i + 1.0)));
    return dot(n, vec3(70.0));
  }

  // Fluid height map with ambient undulations & mouse interaction
  float liquidHeight(vec2 uv, float t, vec2 mouseNorm) {
    vec2 p = uv * 2.8;

    // Ambient liquid ripples
    float h = 0.0;
    h += sin(p.x * 2.8 + t * 1.1) * cos(p.y * 2.4 + t * 0.85) * 0.22;
    h += sin(p.x * 4.6 - t * 1.4 + p.y * 3.8) * 0.14;
    h += snoise(p * 1.6 + vec2(t * 0.2, -t * 0.16)) * 0.25;

    // Interactive wave ripple from mouse
    float dMouse = length(uv - mouseNorm);
    float mouseWave = sin(dMouse * 32.0 - t * 4.5) * exp(-dMouse * 4.2);
    h += mouseWave * 0.38;

    return h;
  }

  void main() {
    vec2 uv = gl_FragCoord.xy / iResolution.xy;
    vec2 mouseNorm = iMouse.xy / iResolution.xy;

    float t = iTime * 0.75;

    // Normal calculation from height differential
    vec2 eps = vec2(1.0 / iResolution.x, 1.0 / iResolution.y) * 2.4;
    float hC = liquidHeight(uv, t, mouseNorm);
    float hR = liquidHeight(uv + vec2(eps.x, 0.0), t, mouseNorm);
    float hU = liquidHeight(uv + vec2(0.0, eps.y), t, mouseNorm);

    vec3 n = normalize(vec3((hC - hR) * 1.8, (hC - hU) * 1.8, 0.12));

    // Refraction with chromatic dispersion (RGB offset)
    float dispersion = 0.015;
    vec2 refrR = uv + n.xy * 0.05;
    vec2 refrG = uv + n.xy * (0.05 + dispersion * 0.5);
    vec2 refrB = uv + n.xy * (0.05 + dispersion);

    vec4 texR = texture2D(iChannel0, clamp(refrR, 0.0, 1.0));
    vec4 texG = texture2D(iChannel0, clamp(refrG, 0.0, 1.0));
    vec4 texB = texture2D(iChannel0, clamp(refrB, 0.0, 1.0));

    vec3 baseColor = vec3(texR.r, texG.g, texB.b);

    // Specular reflections (glass surface glints)
    vec3 lightDir = normalize(vec3(-0.35, 0.55, 0.75));
    vec3 viewDir = vec3(0.0, 0.0, 1.0);

    vec3 halfVec = normalize(lightDir + viewDir);
    float spec = pow(max(dot(n, halfVec), 0.0), 32.0);

    vec3 light2 = normalize(vec3(0.5, -0.3, 0.6));
    float spec2 = pow(max(dot(n, normalize(light2 + viewDir)), 0.0), 18.0);

    // Fresnel rim sheen
    float fresnel = pow(1.0 - max(dot(n, viewDir), 0.0), 3.0);

    // Caustics brightness
    float caustics = clamp(pow(max(hC * 1.5 + 0.5, 0.0), 2.2) * 0.3, 0.0, 1.0);

    // Frosted glass tinting & blend
    vec3 glassTint = vec3(0.98, 0.99, 1.0);
    vec3 finalCol = mix(baseColor, glassTint, 0.35);

    // Add lighting highlights
    finalCol += vec3(1.0, 0.98, 0.95) * spec * 0.7;
    finalCol += vec3(0.85, 0.95, 1.0) * spec2 * 0.3;
    finalCol += vec3(1.0) * fresnel * 0.4;
    finalCol += vec3(0.96, 0.98, 1.0) * caustics * 0.22;

    // Soft border falloff
    vec2 vigUV = uv * (1.0 - uv.yx);
    float vig = vigUV.x * vigUV.y * 15.0;
    vig = clamp(pow(vig, 0.12), 0.0, 1.0);

    // Translucent glass alpha for glassmorphism
    float alpha = clamp(0.6 + fresnel * 0.3 + spec * 0.25, 0.0, 0.95);

    gl_FragColor = vec4(finalCol * vig, alpha);
  }
`;

export function LiquidGlassBox({
  children,
  className = "",
  sourceImage,
  opacity = 0.85,
}: LiquidGlassBoxProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    if (prefersReducedMotion()) return;

    const gl =
      canvas.getContext("webgl", { alpha: true, antialias: true }) ||
      (canvas.getContext("experimental-webgl", {
        alpha: true,
        antialias: true,
      }) as WebGLRenderingContext | null);

    if (!gl) return;

    let animId: number;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    // ── 1. Set canvas size ────────────────────────────────────────────────────
    const setCanvasSize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
    };
    setCanvasSize();

    // ── 2. Create Shader Helper ──────────────────────────────────────────────
    const createShader = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);

      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    // ── 3. Build WebGL Program ────────────────────────────────────────────────
    const vs = createShader(gl.VERTEX_SHADER, vsSource);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSource);
    if (!vs || !fs) return;

    const program = gl.createProgram();
    if (!program) return;

    gl.attachShader(program, vs);
    gl.attachShader(program, fs);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error("Program link error:", gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // ── 4. Setup Quad Buffer ──────────────────────────────────────────────────
    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW
    );

    const position = gl.getAttribLocation(program, "position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    // ── 5. Uniform locations ──────────────────────────────────────────────────
    const uniforms = {
      resolution: gl.getUniformLocation(program, "iResolution"),
      time: gl.getUniformLocation(program, "iTime"),
      mouse: gl.getUniformLocation(program, "iMouse"),
      texture: gl.getUniformLocation(program, "iChannel0"),
    };

    // ── 6. Mouse tracking ─────────────────────────────────────────────────────
    let mouse = [canvas.width * 0.5, canvas.height * 0.5];
    let targetMouse = [canvas.width * 0.5, canvas.height * 0.5];

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const clientX = (e.clientX - rect.left) * dpr;
      const clientY = (rect.height - (e.clientY - rect.top)) * dpr;
      targetMouse = [clientX, clientY];
    };

    container.addEventListener("mousemove", handleMouseMove);

    // ── 7. Texture setup ──────────────────────────────────────────────────────
    const texture = gl.createTexture();

    const uploadCanvasToTexture = (source: TexImageSource) => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        source
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    // Generate frosted liquid gradient texture as procedural default
    const makeProceduralTexture = () => {
      const offCanvas = document.createElement("canvas");
      offCanvas.width = 512;
      offCanvas.height = 512;
      const ctx = offCanvas.getContext("2d");
      if (ctx) {
        const grad = ctx.createRadialGradient(256, 256, 40, 256, 256, 320);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.95)");
        grad.addColorStop(0.35, "rgba(246, 239, 228, 0.85)");
        grad.addColorStop(0.7, "rgba(60, 122, 110, 0.25)");
        grad.addColorStop(1, "rgba(224, 122, 95, 0.18)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 512, 512);

        // Add subtle glass texture lines
        ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
        ctx.lineWidth = 2;
        for (let i = 0; i < 512; i += 32) {
          ctx.beginPath();
          ctx.moveTo(0, i);
          ctx.lineTo(512, i);
          ctx.stroke();
        }
      }
      uploadCanvasToTexture(offCanvas);
    };

    if (sourceImage) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = sourceImage;
      if (img.complete) {
        uploadCanvasToTexture(img);
      } else {
        img.onload = () => uploadCanvasToTexture(img);
        img.onerror = () => makeProceduralTexture();
      }
    } else {
      makeProceduralTexture();
    }

    // ── 8. Render loop ────────────────────────────────────────────────────────
    const startTime = performance.now();
    let isVisible = true;

    const render = () => {
      if (!isVisible) {
        animId = requestAnimationFrame(render);
        return;
      }

      // Smooth mouse interpolation
      mouse[0] += (targetMouse[0] - mouse[0]) * 0.08;
      mouse[1] += (targetMouse[1] - mouse[1]) * 0.08;

      const currentTime = (performance.now() - startTime) / 1000;

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);

      gl.useProgram(program);

      gl.uniform3f(uniforms.resolution, canvas.width, canvas.height, 1.0);
      gl.uniform1f(uniforms.time, currentTime);
      gl.uniform4f(uniforms.mouse, mouse[0], mouse[1], 0, 0);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(uniforms.texture, 0);

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

      animId = requestAnimationFrame(render);
    };

    // ── 9. Resize & Intersection Observers ────────────────────────────────────
    const resizeObserver = new ResizeObserver(() => {
      setCanvasSize();
    });
    resizeObserver.observe(container);

    const intersectionObserver = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    });
    intersectionObserver.observe(container);

    render();

    // ── 10. Clean-up on unmount ───────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(animId);
      container.removeEventListener("mousemove", handleMouseMove);
      resizeObserver.disconnect();
      intersectionObserver.disconnect();

      if (buffer) gl.deleteBuffer(buffer);
      if (texture) gl.deleteTexture(texture);
      if (vs) gl.deleteShader(vs);
      if (fs) gl.deleteShader(fs);
      if (program) gl.deleteProgram(program);
    };
  }, [sourceImage]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Liquid Glass WebGL Canvas */}
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover transition-opacity duration-700"
        style={{ opacity }}
        aria-hidden="true"
      />

      {/* Surface Gloss Sheen Overlay */}
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/40 via-white/10 to-transparent"
        aria-hidden="true"
      />

      {/* Foreground Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
