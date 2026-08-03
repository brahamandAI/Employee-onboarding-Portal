"use client";

import { useEffect, useRef, useState } from "react";

interface AutoSaveIndicatorProps {
  isSaving: boolean;
  lastSavedAt?: string | null;
}

export function AutoSaveIndicator({ isSaving, lastSavedAt }: AutoSaveIndicatorProps) {
  return (
    <div className="flex items-center gap-2 text-xs text-[#64748B]">
      {isSaving ? (
        <>
          <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-accent" />
          Saving...
        </>
      ) : lastSavedAt ? (
        <>
          <span className="inline-block h-2 w-2 rounded-full bg-green-500" />
          <RelativeSavedTime iso={lastSavedAt} />
        </>
      ) : (
        <>
          <span className="inline-block h-2 w-2 rounded-full bg-[#CBD5E1]" />
          Auto-save enabled
        </>
      )}
    </div>
  );
}

function RelativeSavedTime({ iso }: { iso: string }) {
  const [label, setLabel] = useState("just now");

  useEffect(() => {
    const update = () => setLabel(formatRelativeTime(iso));
    update();
    const timer = setInterval(update, 30_000);
    return () => clearInterval(timer);
  }, [iso]);

  return <>Saved {label}</>;
}

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins === 1) return "1 min ago";
  if (mins < 60) return `${mins} mins ago`;
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function useAutoSave<T extends Record<string, unknown>>(
  data: T,
  onSave: (data: T) => void | Promise<void>,
  enabled = true,
  delayMs = 2000
) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isFirstRender = useRef(true);
  const onSaveRef = useRef(onSave);
  onSaveRef.current = onSave;

  useEffect(() => {
    if (!enabled) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      onSaveRef.current(data);
    }, delayMs);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, enabled, delayMs]);
}
