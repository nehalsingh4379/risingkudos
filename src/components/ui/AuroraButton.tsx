import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  href?: string;
  children: React.ReactNode;
  aurora?: boolean;
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function AuroraButton({
  href,
  children,
  aurora = false,
  className,
  onClick,
  type = "button",
  disabled,
}: Props) {
  const commonClasses = aurora
    ? "group relative inline-flex items-center justify-center rounded-full p-[2px] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
    : "inline-flex items-center justify-center rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white shadow-[0_6px_20px_rgba(224,122,95,0.28)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_26px_rgba(224,122,95,0.38)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none";

  const content = aurora ? (
    <>
      <span className="aurora-ring pointer-events-none absolute inset-0 rounded-full" />
      <span className="relative z-10 flex h-full w-full items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-ink transition-colors duration-200 group-hover:bg-cream-deep/60">
        {children}
      </span>
    </>
  ) : (
    children
  );

  if (href) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(commonClasses, className)}
      >
        {content}
      </Link>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(commonClasses, className)}
    >
      {content}
    </button>
  );
}
