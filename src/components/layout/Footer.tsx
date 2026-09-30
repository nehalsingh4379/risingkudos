import Link from "next/link";
import { site } from "@/content/site";
import { EmeraldHorizonBackground } from "@/shaders/emerald-horizon/EmeraldHorizonBackground";
import "@/shaders/threeui.css";

export default function Footer() {
  return (
    <footer className="border-t border-ink/8 relative overflow-hidden bg-cream-deep/50 rounded-t-3xl sm:rounded-t-[48px] md:rounded-t-[60px]">
      <div className="absolute inset-0 -z-10 h-full w-full">
        <EmeraldHorizonBackground
          speed={1.00}
          waveScale={1.00}
          variation={1.00}
          hue={0}
          glow={1.00}
          vignette={1.00}
        />
      </div>
      <div className="mx-auto grid max-w-7xl gap-8 sm:gap-10 px-5 py-12 sm:px-6 sm:py-16 sm:grid-cols-2 lg:grid-cols-4 md:px-8 relative z-10">
        <div>
          <p className="font-display text-xl font-semibold">{site.name}</p>
          <p className="mt-3 max-w-sm text-sm leading-6 text-ink-soft">{site.tagline}</p>
        </div>
        <div className="flex flex-col gap-2 text-sm">
          <p className="font-semibold text-ink">Navigation</p>
          <Link href="/subjects" className="hover:text-coral transition-colors">
            Subjects
          </Link>
          <Link href="/pricing" className="hover:text-coral transition-colors">
            Pricing
          </Link>
          <Link href="/faq" className="hover:text-coral transition-colors">
            FAQ
          </Link>
          <Link href="/enquiry" className="hover:text-coral transition-colors">
            Book a consultation
          </Link>
        </div>
        <div className="text-sm">
          <p className="font-semibold text-ink">Office</p>
          <address className="mt-2 not-italic leading-6 text-ink-soft">
            Molanachak Jagdishpur<br />
            Bhagalpur, Bihar-813105
          </address>
          <p className="mt-3 font-semibold text-ink">Phone</p>
          <a
            href={`tel:${site.phone.replace(/\s+/g, "")}`}
            className="mt-1 inline-block text-ink-soft hover:text-coral transition-colors"
          >
            {site.phone}
          </a>
        </div>
        <div className="flex flex-col gap-2 text-sm text-ink-soft">
          <p className="font-semibold text-ink">Legal</p>
          <Link href="/privacy" className="hover:text-ink transition-colors">
            Privacy (placeholder)
          </Link>
          <Link href="/terms" className="hover:text-ink transition-colors">
            Terms (placeholder)
          </Link>
          <p className="mt-4 text-xs">© {new Date().getFullYear()} {site.name}. Legal copy to be confirmed.</p>
        </div>
      </div>
    </footer>
  );
}
