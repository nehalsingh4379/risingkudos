import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  href?: string;
  children: React.ReactNode;
  aurora?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
};

export default function AuroraButton({
  href,
  children,
  aurora = false,
  size = "md",
  className,
  onClick,
  type = "button",
  disabled,
}: Props) {
  const sizeClasses = {
    sm: "px-5 py-2 text-xs sm:text-sm font-semibold tracking-wide",
    md: "px-6 py-2.5 sm:py-3 text-sm font-semibold",
    lg: "px-7 py-3.5 text-base font-semibold",
  }[size];

  const commonClasses = aurora
    ? "group relative inline-flex items-center justify-center rounded-full p-[1.5px] transition-transform duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
    : cn(
        "inline-flex items-center justify-center rounded-full bg-coral text-white shadow-[0_4px_16px_rgba(224,122,95,0.25)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(224,122,95,0.35)] active:translate-y-0 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none",
        sizeClasses,
      );

  const content = aurora ? (
    <>
      <span className="aurora-ring pointer-events-none absolute inset-0 rounded-full" />
      <span
        className={cn(
          "relative z-10 flex h-full w-full items-center justify-center rounded-full bg-white text-ink transition-colors duration-200 group-hover:bg-cream-deep/60",
          sizeClasses,
        )}
      >
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
