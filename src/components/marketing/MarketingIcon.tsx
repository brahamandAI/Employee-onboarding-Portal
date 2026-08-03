import * as LucideIcons from "lucide-react";
import { LucideIcon } from "lucide-react";

export function MarketingIcon({ name, className }: { name: string; className?: string }) {
  const Icon =
    (LucideIcons as unknown as Record<string, LucideIcon | undefined>)[name] ?? LucideIcons.Shield;
  return <Icon className={className} aria-hidden />;
}
