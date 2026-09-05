"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface DashboardChromeValue {
  /** Mobile drawer closed when true */
  collapsed: boolean;
  /** Desktop icon-rail when true */
  desktopCollapsed: boolean;
  toggle: () => void;
  toggleDesktop: () => void;
  setCollapsed: (value: boolean) => void;
}

const DashboardChromeContext = createContext<DashboardChromeValue | null>(null);

export function DashboardChromeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsedState] = useState(true);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    function sync() {
      if (mq.matches) setCollapsedState(false);
      else setCollapsedState(true);
    }
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem("rs-sidebar-collapsed");
      if (stored === "1") setDesktopCollapsed(true);
    } catch {
      /* ignore */
    }
  }, []);

  const setCollapsed = useCallback((value: boolean) => {
    setCollapsedState(value);
  }, []);

  const toggle = useCallback(() => {
    setCollapsedState((prev) => !prev);
  }, []);

  const toggleDesktop = useCallback(() => {
    setDesktopCollapsed((prev) => {
      const next = !prev;
      try {
        window.localStorage.setItem("rs-sidebar-collapsed", next ? "1" : "0");
      } catch {
        /* ignore */
      }
      return next;
    });
  }, []);

  return (
    <DashboardChromeContext.Provider
      value={{ collapsed, desktopCollapsed, toggle, toggleDesktop, setCollapsed }}
    >
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
