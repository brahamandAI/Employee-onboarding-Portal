"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface DashboardChromeValue {
  /** On mobile: true = drawer closed. Desktop always treats as open. */
  collapsed: boolean;
  toggle: () => void;
  setCollapsed: (value: boolean) => void;
}

const DashboardChromeContext = createContext<DashboardChromeValue | null>(null);

export function DashboardChromeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Start closed on small screens; desktop sidebar is always visible via CSS
  const [collapsed, setCollapsedState] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    function sync() {
      // Desktop: keep "collapsed" false so mobile-only drawer CSS does not hide it
      if (mq.matches) setCollapsedState(false);
      else setCollapsedState(true);
    }
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((prev) => !prev);
  }, []);

  return (
    <DashboardChromeContext.Provider value={{ collapsed, toggle, setCollapsed }}>
      {children}
    </DashboardChromeContext.Provider>
  );
}

export function useDashboardChrome() {
  const ctx = useContext(DashboardChromeContext);
  if (!ctx) {
    throw new Error("useDashboardChrome must be used within DashboardChromeProvider");
  }
  return ctx;
}
