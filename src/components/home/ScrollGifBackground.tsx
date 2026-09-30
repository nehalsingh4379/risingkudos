"use client";

import { useEffect, useRef } from "react";
import { parseGIF, decompressFrames } from "gifuct-js";

interface Props {
  src: string;
  /** Called with normalised progress 0-1 as scroll drives the GIF */
  onProgress?: (p: number) => void;
}

/**
 * Scroll-scrubbed GIF background.
 *
 * - The parent section is pinned by GSAP ScrollTrigger (handled in Hero.tsx).
 * - This component receives a `progress` prop (0→1) and paints the
 *   corresponding decoded frame onto a canvas.
 * - Exposes an imperative `setProgress(0-1)` handle via `canvasRef` dataset
 *   so Hero.tsx can drive it from the ScrollTrigger onUpdate callback.
 */
export interface ScrollGifHandle {
  setProgress: (p: number) => void;
}

export default function ScrollGifBackground({ src, onProgress }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const handleRef = useRef<ScrollGifHandle | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let alive = true;
    let frames: ImageBitmap[] = [];
    let frameCount = 0;
    let currentProgress = 0;

    /** Keep the canvas buffer sized to its CSS layout box at device pixel ratio */
    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      if (frameCount > 0) {
        const idx = Math.round(
          Math.max(0, Math.min(1, currentProgress)) * (frameCount - 1)
        );
        paintFrame(idx);
      } else if (posterImg?.complete) {
        paintImage(posterImg);
      }
    }

    /** Cover-style render of a given bitmap frame */
    function paintFrame(index: number) {
      if (!frames.length || !ctx || !canvas) return;
      const bmp = frames[Math.max(0, Math.min(frames.length - 1, index))];
      const cw = canvas.width;
      const ch = canvas.height;
      const scale = Math.max(cw / bmp.width, ch / bmp.height);
      const dw = bmp.width * scale;
      const dh = bmp.height * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(bmp, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    function paintImage(img: HTMLImageElement) {
      if (!ctx || !canvas) return;
      const cw = canvas.width;
      const ch = canvas.height;
      const nw = img.naturalWidth || 800;
      const nh = img.naturalHeight || 450;
      const scale = Math.max(cw / nw, ch / nh);
      const dw = nw * scale;
      const dh = nh * scale;
      ctx.clearRect(0, 0, cw, ch);
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);
    }

    // Immediately load and paint lightweight poster so canvas is never blank
    let posterImg: HTMLImageElement | null = new Image();
    posterImg.src = "/video/hero-poster.webp";
    posterImg.onload = () => {
      if (!alive || !canvas) return;
      if (frameCount === 0) {
        paintImage(posterImg!);
      }
    };

    // Imperative handle — Hero.tsx calls this on every ScrollTrigger update
    handleRef.current = {
      setProgress: (p: number) => {
        currentProgress = p;
        if (frameCount > 0) {
          const idx = Math.round(Math.max(0, Math.min(1, p)) * (frameCount - 1));
          paintFrame(idx);
        }
        onProgress?.(p);
      },
    };

    // Expose handle on canvas dataset immediately so Hero can reach it without delay
    (canvas as unknown as { __gifHandle: ScrollGifHandle }).__gifHandle =
      handleRef.current;

    // ── High-performance GIF decode (adaptive for Mobile & Desktop) ───────────
    async function loadGif() {
      try {
        const isMobile = window.innerWidth <= 768;
        // On mobile: sample every 3rd frame (~34 frames = 48MB, 60fps scrub)
        // On desktop: decode all 100 frames for 100% frame fidelity
        const step = isMobile ? 3 : 1;

        const res = await fetch(src);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        let buf: ArrayBuffer;
        const contentLength = res.headers.get("content-length");
        const totalExpected = contentLength ? parseInt(contentLength, 10) : 4606745;

        if (res.body && typeof res.body.getReader === "function") {
          const reader = res.body.getReader();
          const chunks: Uint8Array[] = [];
          let received = 0;

          while (true) {
            if (!alive) {
              reader.cancel();
              return;
            }
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              chunks.push(value);
              received += value.length;
              const dlFraction = Math.min(1, received / totalExpected);
              // Downloading accounts for 0% to 60% of overall loading progress
              window.dispatchEvent(
                new CustomEvent("page:progress", {
                  detail: { progress: dlFraction * 0.6, phase: "download" },
                })
              );
            }
          }

          const combined = new Uint8Array(received);
          let offset = 0;
          for (const c of chunks) {
            combined.set(c, offset);
            offset += c.length;
          }
          buf = combined.buffer;
        } else {
          buf = await res.arrayBuffer();
          window.dispatchEvent(
            new CustomEvent("page:progress", {
              detail: { progress: 0.6, phase: "download" },
            })
          );
        }

        if (!alive) return;

        window.dispatchEvent(
          new CustomEvent("page:progress", {
            detail: { progress: 0.65, phase: "parse" },
          })
        );

        const gif = parseGIF(buf);
        const rawFrames = decompressFrames(gif, true);

        if (!rawFrames.length || !alive) return;

        const gifW = gif.lsd.width;
        const gifH = gif.lsd.height;

        const composite = document.createElement("canvas");
        composite.width = gifW;
        composite.height = gifH;
        const compCtx = composite.getContext("2d")!;

        const scratch = document.createElement("canvas");
        const scratchCtx = scratch.getContext("2d")!;

        let savedImageData: ImageData | null = null;
        const bitmaps: ImageBitmap[] = [];

        const totalFrames = rawFrames.length;
        for (let fi = 0; fi < totalFrames; fi++) {
          if (!alive) {
            bitmaps.forEach((b) => b.close());
            return;
          }

          const frame = rawFrames[fi];
          const { dims, patch, disposalType } = frame;

          const shouldKeepBitmap =
            fi === 0 || fi % step === 0 || fi === totalFrames - 1;

          if (!patch || patch.length !== dims.width * dims.height * 4) {
            if (shouldKeepBitmap && bitmaps.length > 0) {
              bitmaps.push(await createImageBitmap(bitmaps[bitmaps.length - 1]));
            }
            const decodeFraction = (fi + 1) / totalFrames;
            window.dispatchEvent(
              new CustomEvent("page:progress", {
                detail: { progress: 0.65 + decodeFraction * 0.35, phase: "decode" },
              })
            );
            continue;
          }

          if (disposalType === 3) {
            savedImageData = compCtx.getImageData(0, 0, gifW, gifH);
          }

          scratch.width = dims.width;
          scratch.height = dims.height;
          scratchCtx.putImageData(
            new ImageData(new Uint8ClampedArray(patch), dims.width, dims.height),
            0,
            0,
          );

          compCtx.drawImage(scratch, dims.left, dims.top);

          if (shouldKeepBitmap) {
            bitmaps.push(await createImageBitmap(composite));
          }

          if (disposalType === 2) {
            compCtx.clearRect(dims.left, dims.top, dims.width, dims.height);
          } else if (disposalType === 3 && savedImageData) {
            compCtx.putImageData(savedImageData, 0, 0);
            savedImageData = null;
          }

          // Emit real decode progress (65% to 98%) to PageLoader
          const decodeFraction = (fi + 1) / totalFrames;
          window.dispatchEvent(
            new CustomEvent("page:progress", {
              detail: { progress: 0.65 + decodeFraction * 0.35, phase: "decode" },
            })
          );

          // Yield to event loop every 6 frames so touch scroll and loader never stutter
          if (fi % 6 === 0) {
            await new Promise((r) => setTimeout(r, 0));
          }
        }

        if (!alive) {
          bitmaps.forEach((b) => b.close());
          return;
        }

        frames = bitmaps;
        frameCount = bitmaps.length;

        // Render current progress frame immediately
        const initialIdx = Math.round(
          Math.max(0, Math.min(1, currentProgress)) * (frameCount - 1)
        );
        paintFrame(initialIdx);

        // Mark global ready flag
        (window as unknown as { __bgGifReady?: boolean }).__bgGifReady = true;

        // Signal PageLoader: GIF fully decoded and painted
        window.dispatchEvent(
          new CustomEvent("page:progress", { detail: { progress: 1.0, phase: "ready" } })
        );
        window.dispatchEvent(new CustomEvent("page:ready"));
      } catch (err) {
        console.error("[ScrollGifBackground] Failed to decode GIF:", err);
        (window as unknown as { __bgGifReady?: boolean }).__bgGifReady = true;
        window.dispatchEvent(
          new CustomEvent("page:progress", { detail: { progress: 1.0, phase: "error" } })
        );
        window.dispatchEvent(new CustomEvent("page:ready"));
      }
    }

    resize();
    window.addEventListener("resize", resize);
    loadGif();

    return () => {
      alive = false;
      posterImg = null;
      window.removeEventListener("resize", resize);
      frames.forEach((b) => b.close());
      handleRef.current = null;
    };
  }, [src]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        display: "block",
      }}
    />
  );
}
