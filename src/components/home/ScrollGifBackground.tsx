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

    /** Keep the canvas buffer sized to its CSS layout box at device pixel ratio */
    function resize() {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
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

    // Imperative handle — Hero.tsx calls this on every ScrollTrigger update
    handleRef.current = {
      setProgress: (p: number) => {
        if (!frameCount) return;
        const idx = Math.round(Math.max(0, Math.min(1, p)) * (frameCount - 1));
        paintFrame(idx);
        onProgress?.(p);
      },
    };

    // Expose handle on canvas dataset so Hero can reach it without prop drilling
    (canvas as unknown as { __gifHandle: ScrollGifHandle }).__gifHandle =
      handleRef.current;

    // ── GIF decode ────────────────────────────────────────────────────────────
    async function loadGif() {
      try {
        const res = await fetch(src);
        const buf = await res.arrayBuffer();
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
          const frame = rawFrames[fi];
          const { dims, patch, disposalType } = frame;

          if (!patch || patch.length !== dims.width * dims.height * 4) {
            if (bitmaps.length > 0) {
              bitmaps.push(await createImageBitmap(bitmaps[bitmaps.length - 1]));
            }
            window.dispatchEvent(
              new CustomEvent("page:progress", { detail: (fi + 1) / totalFrames })
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
          bitmaps.push(await createImageBitmap(composite));

          if (disposalType === 2) {
            compCtx.clearRect(dims.left, dims.top, dims.width, dims.height);
          } else if (disposalType === 3 && savedImageData) {
            compCtx.putImageData(savedImageData, 0, 0);
            savedImageData = null;
          }

          // Emit real decode progress to PageLoader
          window.dispatchEvent(
            new CustomEvent("page:progress", { detail: (fi + 1) / totalFrames })
          );
        }

        if (!alive) {
          bitmaps.forEach((b) => b.close());
          return;
        }

        frames = bitmaps;
        frameCount = bitmaps.length;
        // Update the handle now that frameCount is known
        handleRef.current!.setProgress = (p: number) => {
          if (!frameCount) return;
          const idx = Math.round(Math.max(0, Math.min(1, p)) * (frameCount - 1));
          paintFrame(idx);
          onProgress?.(p);
        };
        (canvas as unknown as { __gifHandle: ScrollGifHandle }).__gifHandle =
          handleRef.current!;

        paintFrame(0); // show first frame immediately
        // Signal PageLoader: GIF fully decoded and painted
        window.dispatchEvent(new CustomEvent("page:ready"));
      } catch (err) {
        console.error("[ScrollGifBackground] Failed to decode GIF:", err);
      }
    }

    resize();
    window.addEventListener("resize", resize);
    loadGif();

    return () => {
      alive = false;
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
