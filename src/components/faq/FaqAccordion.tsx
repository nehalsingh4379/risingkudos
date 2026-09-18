"use client";

import { useState } from "react";
import { faqs } from "@/content/site";
import { cn } from "@/lib/cn";

export default function FaqAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {faqs.map((item, i) => {
        const isOpen = open === i;
        return (
          <div key={item.q} className="card-radius border border-white/80 bg-white/80">
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
              aria-expanded={isOpen}
              onClick={() => setOpen(isOpen ? -1 : i)}
            >
              <span className="font-medium">{item.q}</span>
              <span className={cn("text-coral transition duration-300", isOpen && "rotate-180")}>⌄</span>
            </button>
            <div
              className="grid transition-[grid-template-rows] duration-300 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 leading-7 text-ink-soft">{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
