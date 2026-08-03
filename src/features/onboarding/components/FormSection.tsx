"use client";

interface FormSectionProps {
  title: string;
  subtitle?: string;
  sectionNumber?: number;
  children: React.ReactNode;
  variant?: "default" | "office" | "highlight";
}

export function FormSection({
  title,
  subtitle,
  sectionNumber,
  children,
  variant = "default",
}: FormSectionProps) {
  const styles = {
    default: "border-[#BFDBFE] bg-white shadow-sm",
    office: "border-[#CBD5E1] bg-[#F1F5F9]",
    highlight: "border-[#93C5FD] bg-[#EFF6FF]",
  };

  return (
    <section className={`overflow-hidden rounded-xl border ${styles[variant]}`}>
      <div className="border-b border-[#BFDBFE] bg-gradient-to-r from-[#1D4ED8] to-[#2563EB] px-5 py-3">
        <div className="flex items-center gap-3">
          {sectionNumber !== undefined && (
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
              {sectionNumber}
            </span>
          )}
          <div>
            <h3 className="font-heading text-sm font-bold uppercase tracking-wide text-white">
              {title}
            </h3>
            {subtitle && <p className="mt-0.5 text-xs text-blue-100">{subtitle}</p>}
          </div>
        </div>
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}
