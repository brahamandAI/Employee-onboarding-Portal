import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "center",
  light = false,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        align === "center" && "mx-auto max-w-2xl text-center",
        className
      )}
    >
      {eyebrow && (
        <p
          className={cn(
            "text-sm font-semibold uppercase tracking-widest",
            light ? "text-accent" : "text-accent"
          )}
        >
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "font-heading text-3xl font-bold tracking-tight md:text-4xl",
          light ? "text-white" : "text-primary",
          eyebrow && "mt-2"
        )}
      >
        {title}
      </h2>
      {description && (
        <p
          className={cn(
            "mt-4 text-base leading-relaxed md:text-lg",
            light ? "text-white/75" : "text-[#64748B]"
          )}
        >
          {description}
        </p>
      )}
    </div>
  );
}
