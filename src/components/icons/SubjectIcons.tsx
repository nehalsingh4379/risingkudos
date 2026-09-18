import { cn } from "@/lib/cn";

const accentFill: Record<string, string> = {
  english: "fill-coral",
  maths: "fill-teal",
  science: "fill-[#7c6aa8]",
  eleven: "fill-amber",
  gcse: "fill-[#4d7aa8]",
};

export function SubjectIcon({ accent, className }: { accent: string; className?: string }) {
  const fill = accentFill[accent] ?? "fill-coral";
  if (accent === "english") {
    return (
      <svg viewBox="0 0 48 48" className={cn("h-10 w-10", className)} aria-hidden>
        <path className={fill} d="M10 12h18a6 6 0 0 1 6 6v18H16a6 6 0 0 1-6-6V12Z" opacity=".9" />
        <path className="fill-white" d="M16 18h14v2H16zm0 5h11v2H16z" />
      </svg>
    );
  }
  if (accent === "maths") {
    return (
      <svg viewBox="0 0 48 48" className={cn("h-10 w-10", className)} aria-hidden>
        <circle cx="24" cy="24" r="16" className={fill} />
        <path className="stroke-white" strokeWidth="2.5" d="M16 24h16M24 16v16" />
      </svg>
    );
  }
  if (accent === "science") {
    return (
      <svg viewBox="0 0 48 48" className={cn("h-10 w-10", className)} aria-hidden>
        <path className={fill} d="M18 8h12l-4 14h6L18 40l4-16h-6L18 8Z" />
      </svg>
    );
  }
  if (accent === "eleven") {
    return (
      <svg viewBox="0 0 48 48" className={cn("h-10 w-10", className)} aria-hidden>
        <path className={fill} d="M24 8 28 20h12l-10 8 4 12-10-7-10 7 4-12-10-8h12Z" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 48 48" className={cn("h-10 w-10", className)} aria-hidden>
      <rect x="10" y="12" width="28" height="24" rx="6" className={fill} />
      <path className="stroke-white" strokeWidth="2" d="M16 24h16" />
    </svg>
  );
}
