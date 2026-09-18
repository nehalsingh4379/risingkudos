"use client";

import Reveal from "@/components/ui/Reveal";
import { benefits } from "@/content/site";
import { cn } from "@/lib/cn";
import Image from "next/image";

export default function Benefits() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 md:px-8 md:py-24">
      <div className="mb-8 sm:mb-10 max-w-xl">
        <p className="text-xs sm:text-sm font-semibold tracking-wide text-teal uppercase">Why families choose us</p>
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold text-ink">Room to grow, without the noise.</h2>
      </div>
      <Reveal className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
        {benefits.map((item) => (
          <article
            key={item.title}
            data-reveal
            className={cn(
              "card-radius group relative overflow-hidden bg-white shadow-[0_10px_30px_rgba(43,36,31,0.05)] transition duration-500 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(43,36,31,0.1)] flex flex-col border border-white/80",
              item.span,
            )}
          >
            <div className="relative w-full h-48 sm:h-56 md:h-64 lg:h-auto lg:flex-1 min-h-[180px] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:group-hover:rounded-b-[24px]">
              {item.image && (
                <>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 lg:group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/70 via-ink/15 to-transparent opacity-60 transition-opacity duration-500 lg:group-hover:opacity-0" />
                </>
              )}
            </div>
            
            {/* Always visible on mobile/tablet so touch users can read details; interactive on desktop */}
            <div className="grid grid-rows-[1fr] lg:grid-rows-[0fr] transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] lg:group-hover:grid-rows-[1fr]">
              <div className="overflow-hidden">
                <div className="p-5 sm:p-6">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink">{item.title}</h3>
                  <p className="mt-2 sm:mt-3 text-sm sm:text-base leading-relaxed sm:leading-7 text-ink-soft">{item.body}</p>
                </div>
              </div>
            </div>
          </article>
        ))}
      </Reveal>
    </section>
  );
}
