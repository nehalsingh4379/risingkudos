"use client";

import React, {
  useEffect,
  useRef,
  useImperativeHandle,
  forwardRef,
  CSSProperties,
} from "react";

// --- Type Definitions ---
export interface SliderItemData {
  title: string;
  num: string;
  imageUrl: string;
  data?: unknown;
}

/** Imperative handle exposed via ref for scroll-driven control */
export interface ThreeDSliderHandle {
  setTargetProgress: (v: number) => void;
}

interface ThreeDSliderProps {
  items: SliderItemData[];
  speedWheel?: number;
  speedDrag?: number;
  /** Initial progress 0-100. Default 0 (first card centred). */
  startProgress?: number;
  /** When true the internal wheel listener is disabled (use with scroll-driven mode). */
  disableWheel?: boolean;
  containerStyle?: CSSProperties;
  className?: string;
  onItemClick?: (item: SliderItemData, index: number) => void;
}

// ─── Pure DOM card renderer ───────────────────────────────────────────────────
function createCard(item: SliderItemData, index: number): HTMLDivElement {
  const card = document.createElement("div");
  card.className =
    "absolute top-1/2 left-1/2 cursor-pointer select-none rounded-2xl shadow-2xl bg-zinc-900 overflow-hidden border border-white/10";
  card.style.cssText = `
    --w: clamp(180px, 28vw, 280px);
    --h: clamp(240px, 36vw, 380px);
    width: var(--w); height: var(--h);
    margin-top: calc(var(--h) / -2);
    margin-left: calc(var(--w) / -2);
    will-change: transform, opacity;
    contain: layout style paint;
    transition: none;
    display: block;
  `;

  const inner = document.createElement("div");
  inner.style.cssText = "position:absolute;inset:0;z-index:10;";

  const grad = document.createElement("div");
  grad.style.cssText =
    "position:absolute;inset:0;z-index:10;background:linear-gradient(to bottom,rgba(0,0,0,.3) 0%,transparent 45%,rgba(0,0,0,.75) 100%);";

  const title = document.createElement("div");
  title.style.cssText =
    "position:absolute;z-index:20;color:#fff;font-weight:700;bottom:20px;left:20px;right:20px;font-size:clamp(18px,2.5vw,26px);letter-spacing:-0.02em;text-shadow:0 2px 8px rgba(0,0,0,.5);";
  title.textContent = item.title;

  const img = document.createElement("img");
  img.src = item.imageUrl;
  img.alt = item.title;
  img.loading = index < 3 ? "eager" : "lazy";
  img.decoding = "async";
  img.style.cssText =
    "width:100%;height:100%;object-fit:cover;pointer-events:none;display:block;";

  inner.appendChild(grad);
  inner.appendChild(title);
  inner.appendChild(img);
  card.appendChild(inner);

  return card;
}

// ─── Main Component ───────────────────────────────────────────────────────────
const ThreeDSlider = forwardRef<ThreeDSliderHandle, ThreeDSliderProps>(
  (
    {
      items,
      speedWheel = 0.04,
      speedDrag = -0.15,
      startProgress = 0,
      disableWheel = false,
      containerStyle = {},
      className = "",
      onItemClick,
    },
    ref,
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const onItemClickRef = useRef(onItemClick);
    useEffect(() => {
      onItemClickRef.current = onItemClick;
    }, [onItemClick]);

    // Internal control bridge — populated by the effect, consumed by the handle
    const controlRef = useRef<{ setTargetProgress: (v: number) => void } | null>(
      null,
    );

    // Expose imperative handle for scroll-driven usage
    useImperativeHandle(ref, () => ({
      setTargetProgress: (v: number) => controlRef.current?.setTargetProgress(v),
    }));

    useEffect(() => {
      const container = containerRef.current;
      if (!container || items.length === 0) return;

      const numItems = items.length;

      let progress = startProgress;
      let targetProgress = startProgress;
      let isDown = false;
      let startX = 0;
      let rafId: number | null = null;
      let isAnimating = false;

      const cards: HTMLDivElement[] = items.map((item, i) => createCard(item, i));
      cards.forEach((card, i) => {
        card.addEventListener(
          "click",
          () => {
            const denom = numItems > 1 ? numItems - 1 : 1;
            targetProgress = (i / denom) * 100;
            startLoop();
            onItemClickRef.current?.(items[i], i);
          },
          { passive: true },
        );
        container.appendChild(card);
      });

      const cache: { tx: string; ty: string; rot: string; z: string; op: string }[] =
        items.map(() => ({ tx: "", ty: "", rot: "", z: "", op: "" }));

      function update() {
        const lerpFactor = isDown ? 1 : 0.12;
        progress += (targetProgress - progress) * lerpFactor;

        const clamped = Math.max(0, Math.min(100, progress));
        const activeFloat = (clamped / 100) * (numItems - 1);
        const denom = numItems > 1 ? numItems - 1 : 1;

        for (let i = 0; i < numItems; i++) {
          const card = cards[i];
          if (!card) continue;

          const ratio = (i - activeFloat) / denom;
          const tx = (ratio * 750).toFixed(2);
          const ty = (ratio * 180).toFixed(2);
          const rot = (ratio * 110).toFixed(2);

          const dist = Math.abs(i - activeFloat);
          const z = numItems - dist;
          const op = Math.max(0, Math.min(1, (z / numItems) * 3 - 1.8)).toFixed(2);
          const zStr = Math.round(z * 10).toString();

          const c = cache[i];

          if (c.tx !== tx || c.ty !== ty || c.rot !== rot) {
            card.style.transform = `translate3d(${tx}%, ${ty}%, 0) rotate(${rot}deg)`;
            c.tx = tx;
            c.ty = ty;
            c.rot = rot;
          }
          if (c.z !== zStr) {
            card.style.zIndex = zStr;
            c.z = zStr;
          }
          if (c.op !== op) {
            card.style.opacity = op;
            c.op = op;
          }
        }
      }

      function loop() {
        update();
        const diff = Math.abs(targetProgress - progress);
        if (diff > 0.01 || isDown) {
          rafId = requestAnimationFrame(loop);
        } else {
          progress = targetProgress;
          update();
          isAnimating = false;
          rafId = null;
        }
      }

      function startLoop() {
        if (isAnimating) return;
        isAnimating = true;
        rafId = requestAnimationFrame(loop);
      }

      // Populate the control bridge for the imperative handle
      controlRef.current = {
        setTargetProgress: (v: number) => {
          targetProgress = Math.max(0, Math.min(100, v));
          startLoop();
        },
      };

      // Initial draw
      update();

      function getX(e: MouseEvent | TouchEvent): number | undefined {
        return "touches" in e
          ? e.touches[0]?.clientX
          : (e as MouseEvent).clientX;
      }

      function onWheel(e: WheelEvent) {
        const delta = e.deltaY * speedWheel;
        const next = targetProgress + delta;
        if ((next <= 0 && e.deltaY < 0) || (next >= 100 && e.deltaY > 0)) return;
        e.preventDefault();
        targetProgress = Math.max(0, Math.min(100, next));
        startLoop();
      }

      function onDown(e: MouseEvent | TouchEvent) {
        isDown = true;
        const x = getX(e);
        if (x !== undefined) startX = x;
        if (!isAnimating) {
          isAnimating = true;
          rafId = requestAnimationFrame(loop);
        }
      }

      function onMove(e: MouseEvent | TouchEvent) {
        if (!isDown) return;
        const x = getX(e);
        if (x === undefined) return;
        const diff = (x - startX) * speedDrag;
        targetProgress = Math.max(0, Math.min(100, targetProgress + diff));
        startX = x;
      }

      function onUp() {
        if (!isDown) return;
        isDown = false;
      }

      if (!disableWheel) {
        container.addEventListener("wheel", onWheel, { passive: false });
      }
      container.addEventListener("mousedown", onDown, { passive: true });
      container.addEventListener("touchstart", onDown, { passive: true });
      window.addEventListener("mousemove", onMove, { passive: true });
      window.addEventListener("mouseup", onUp, { passive: true });
      window.addEventListener("touchmove", onMove, { passive: true });
      window.addEventListener("touchend", onUp, { passive: true });

      return () => {
        controlRef.current = null;
        if (!disableWheel) container.removeEventListener("wheel", onWheel);
        container.removeEventListener("mousedown", onDown);
        container.removeEventListener("touchstart", onDown);
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
        window.removeEventListener("touchmove", onMove);
        window.removeEventListener("touchend", onUp);
        if (rafId) cancelAnimationFrame(rafId);
        cards.forEach((c) => c.remove());
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [items, speedWheel, speedDrag, startProgress, disableWheel]);

    return (
      <div
        ref={containerRef}
        className={`relative w-full h-[380px] sm:h-[500px] md:h-[620px] overflow-hidden ${className}`}
        style={{ ...containerStyle, touchAction: "pan-y" }}
      />
    );
  },
);

ThreeDSlider.displayName = "ThreeDSlider";

export default ThreeDSlider;
