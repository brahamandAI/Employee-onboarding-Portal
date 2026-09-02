import { cn } from "@/lib/utils";

/**
 * Presentational marker for data kept current by the dashboard live poller.
 * Polling itself lives in DashboardLiveRefresh.
 */
export function LiveBadge({
  label = "Live",
  className,
}: {
  label?: string;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-green-800",
        className
      )}
    >
      <span className="relative flex h-1.5 w-1.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-500 opacity-75" />
        <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-600" />
      </span>
      {label}
    </span>
  );
}
