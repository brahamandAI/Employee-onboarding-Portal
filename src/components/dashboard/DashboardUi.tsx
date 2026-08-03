import Link from "next/link";
import { cn } from "@/lib/utils";

interface DashboardPageHeaderProps {
  title: string;
  description?: string;
  actions?: React.ReactNode;
  className?: string;
}

export function DashboardPageHeader({
  title,
  description,
  actions,
  className,
}: DashboardPageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-start justify-between gap-4 animate-fade-in",
        className
      )}
    >
      <div className="min-w-0">
        <h2 className="font-heading text-2xl font-bold tracking-tight text-primary sm:text-[1.75rem]">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-[#64748B]">
            {description}
          </p>
        )}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}

interface DashboardStatCardProps {
  title: string;
  value: number | string;
  href?: string;
  linkLabel?: string;
  tone?: "default" | "blue" | "green" | "amber" | "red" | "slate";
  hint?: string;
  className?: string;
  style?: React.CSSProperties;
}

const TONE_STYLES: Record<
  NonNullable<DashboardStatCardProps["tone"]>,
  { value: string; bar: string; soft: string }
> = {
  default: {
    value: "text-primary",
    bar: "from-[#0B1F3A] to-[#1D4ED8]",
    soft: "bg-[#EFF6FF]",
  },
  blue: {
    value: "text-[#1D4ED8]",
    bar: "from-[#1D4ED8] to-[#38BDF8]",
    soft: "bg-[#EFF6FF]",
  },
  green: {
    value: "text-[#15803D]",
    bar: "from-[#15803D] to-[#4ADE80]",
    soft: "bg-[#F0FDF4]",
  },
  amber: {
    value: "text-[#B45309]",
    bar: "from-[#B45309] to-[#FBBF24]",
    soft: "bg-[#FFFBEB]",
  },
  red: {
    value: "text-[#B91C1C]",
    bar: "from-[#B91C1C] to-[#F87171]",
    soft: "bg-[#FEF2F2]",
  },
  slate: {
    value: "text-[#334155]",
    bar: "from-[#334155] to-[#94A3B8]",
    soft: "bg-[#F8FAFC]",
  },
};

export function DashboardStatCard({
  title,
  value,
  href,
  linkLabel = "View",
  tone = "default",
  hint,
  className,
  style,
}: DashboardStatCardProps) {
  const tones = TONE_STYLES[tone];
  const content = (
    <>
      <div
        className={cn(
          "absolute inset-x-0 top-0 h-1 rounded-t-2xl bg-gradient-to-r opacity-90",
          tones.bar
        )}
      />
      <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-[#64748B]">
        {title}
      </p>
      <p className={cn("mt-3 font-heading text-3xl font-bold tracking-tight", tones.value)}>
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-[#94A3B8]">{hint}</p>}
      {href && (
        <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-[#1D4ED8] transition group-hover:gap-2">
          {linkLabel}
          <span aria-hidden>→</span>
        </span>
      )}
    </>
  );

  const cardClass = cn(
    "group relative overflow-hidden rounded-2xl border border-[#E2E8F0] bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-[#BFDBFE] hover:shadow-[0_16px_40px_-24px_rgba(29,78,216,0.45)] animate-rise",
    className
  );

  if (href) {
    return (
      <Link href={href} className={cardClass} style={style}>
        {content}
      </Link>
    );
  }

  return (
    <div className={cardClass} style={style}>
      {content}
    </div>
  );
}

export function DashboardSection({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("space-y-4 animate-fade-in", className)}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h3 className="font-heading text-lg font-semibold text-primary">{title}</h3>
        {action}
      </div>
      {children}
    </section>
  );
}
