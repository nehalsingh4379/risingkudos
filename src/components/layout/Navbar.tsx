"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { navLinks, site } from "@/content/site";
import { cn } from "@/lib/cn";
import AuroraButton from "@/components/ui/AuroraButton";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Lock body scroll and close on Escape when mobile menu is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") setOpen(false);
      };
      window.addEventListener("keydown", onKeyDown);
      return () => {
        document.body.style.overflow = "";
        window.removeEventListener("keydown", onKeyDown);
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [open]);

  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 flex justify-center">
      <div
        className={cn(
          "pointer-events-auto flex items-center justify-between gap-3 transition-all duration-[400ms] ease-out",
          scrolled
            ? "mt-2.5 sm:mt-3 w-[min(1080px,calc(100%-1.5rem))] rounded-full border border-white/60 bg-white/70 px-3.5 py-1.5 shadow-[0_10px_40px_rgba(43,36,31,0.08)] backdrop-blur-xl sm:px-5 sm:py-2 md:px-6"
            : "mt-0 w-full max-w-7xl px-4 py-3.5 sm:px-6 sm:py-5 md:px-8",
        )}
      >
        <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
          <Image
            src="/logo_1.png"
            alt="Rising Kudos logo"
            width={scrolled ? 56 : 72}
            height={scrolled ? 56 : 72}
            priority
            className="transition-all duration-[400ms] shrink-0 sm:w-auto"
            style={{ objectFit: "contain", height: scrolled ? "44px" : "56px", width: "auto" }}
          />
          <span
            className={cn(
              "font-display font-semibold tracking-tight text-ink transition-all duration-[400ms]",
              scrolled ? "text-sm sm:text-base" : "text-base sm:text-lg",
            )}
          >
            {site.name}
          </span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex lg:gap-7">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-ink-soft font-medium transition-all hover:text-ink",
                scrolled ? "text-sm" : "text-[15px]",
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <AuroraButton href="/get-started" aurora={scrolled} className="hidden sm:inline-flex">
            Get Started
          </AuroraButton>
          <button
            type="button"
            className="grid h-11 w-11 place-items-center rounded-full border border-ink/10 bg-white/80 active:bg-white md:hidden"
            aria-expanded={open}
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className={cn("h-0.5 w-4.5 bg-ink transition", open && "translate-y-2 rotate-45")} />
              <span className={cn("h-0.5 w-4.5 bg-ink transition", open && "opacity-0")} />
              <span className={cn("h-0.5 w-4.5 bg-ink transition", open && "-translate-y-2 -rotate-45")} />
            </span>
          </button>
        </div>
      </div>

      {open ? (
        <>
          {/* Backdrop overlay */}
          <div
            className="pointer-events-auto fixed inset-0 z-40 bg-ink/30 backdrop-blur-xs transition-opacity duration-300 md:hidden"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer card */}
          <div className="pointer-events-auto absolute top-18 right-4 left-4 z-50 max-w-md mx-auto rounded-3xl border border-white/70 bg-white/95 p-6 shadow-2xl backdrop-blur-2xl md:hidden">
            <nav className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center rounded-2xl px-4 py-3 text-base font-semibold text-ink hover:bg-cream-deep active:bg-cream transition-colors"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 pt-3 border-t border-ink/10">
                <AuroraButton href="/get-started" aurora className="w-full justify-center" onClick={() => setOpen(false)}>
                  Get Started
                </AuroraButton>
              </div>
            </nav>
          </div>
        </>
      ) : null}
    </header>
  );
}
