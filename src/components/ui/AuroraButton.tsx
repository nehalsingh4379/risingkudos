import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  aurora?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  innerClassName?: string;
  onClick?: () => void;
};

export default function AuroraButton({
  href,
  children,
  aurora = false,
  size = "md",
  className,
  innerClassName,
  onClick,
}: Props) {
  const isFullWidth = className?.includes("w-full");
  const sizeClasses = {
    sm: "px-4 py-1.5 text-xs sm:text-sm",
    md: "px-6 py-3 text-sm",
    lg: "px-7 py-3.5 text-base",
  }[size];

  if (!aurora) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-coral font-semibold text-white shadow-[0_8px_20px_rgba(224,122,95,0.28)] transition duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_12px_28px_rgba(224,122,95,0.38)] active:scale-[0.98] touch-manipulation select-none",
          sizeClasses,
          className,
        )}
      >
        {children}
      </Link>
    );
  }

  return (
    <Link
      href={href}
      onClick={onClick}
      className={cn(
        "group relative inline-flex items-center justify-center overflow-hidden rounded-full font-semibold text-white shadow-[0_8px_20px_rgba(224,122,95,0.28)] transition duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_12px_28px_rgba(224,122,95,0.38)] active:scale-[0.98] touch-manipulation select-none",
        className,
      )}
    >
      <span className="aurora-ring pointer-events-none absolute inset-0 rounded-full" />
      <span
        className={cn(
          "relative z-10 inline-flex items-center justify-center font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.32)]",
          sizeClasses,
          isFullWidth && "w-full text-center",
          innerClassName,
        )}
      >
        {children}
      </span>
    </Link>
  );
}


