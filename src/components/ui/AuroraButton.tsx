import Link from "next/link";
import { cn } from "@/lib/cn";

type Props = {
  href: string;
  children: React.ReactNode;
  aurora?: boolean;
  className?: string;
  onClick?: () => void;
};

export default function AuroraButton({
  href,
  children,
  aurora = false,
  className,
  onClick,
}: Props) {
  if (!aurora) {
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "inline-flex items-center justify-center rounded-full bg-coral px-6 py-3 text-sm font-semibold text-white shadow-[0_8px_20px_rgba(224,122,95,0.28)] transition duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-[0_12px_28px_rgba(224,122,95,0.38)] active:scale-[0.98]",
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
        "group relative inline-flex items-center justify-center rounded-full p-[1.5px] transition duration-300 hover:scale-[1.04] active:scale-[0.98]",
        className,
      )}
    >
      <span className="aurora-ring pointer-events-none absolute inset-0 rounded-full" />
      <span className="relative z-10 inline-flex items-center rounded-full bg-white/55 px-6 py-3 text-sm font-semibold text-ink backdrop-blur-md">
        {children}
      </span>
    </Link>
  );
}
