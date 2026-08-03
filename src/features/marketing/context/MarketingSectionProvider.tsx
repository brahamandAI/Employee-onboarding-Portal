"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DEFAULT_SECTION,
  MARKETING_SECTIONS,
  MarketingSectionId,
  getSectionMeta,
  isMarketingSection,
  sectionHref,
} from "@/features/marketing/sections";

interface MarketingSectionContextValue {
  section: MarketingSectionId;
  setSection: (id: MarketingSectionId) => void;
  sections: typeof MARKETING_SECTIONS;
  meta: ReturnType<typeof getSectionMeta>;
  isHomePage: boolean;
  isPending: boolean;
}

const MarketingSectionContext = createContext<MarketingSectionContextValue | null>(null);

export function MarketingSectionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const isHomePage = pathname === "/";

  const paramSection = searchParams.get("section");
  const initialSection =
    isHomePage && paramSection && isMarketingSection(paramSection)
      ? paramSection
      : DEFAULT_SECTION;

  const [section, setSectionState] = useState<MarketingSectionId>(initialSection);

  useEffect(() => {
    if (!isHomePage) return;
    if (paramSection === "careers") {
      router.replace("/", { scroll: false });
      setSectionState(DEFAULT_SECTION);
      return;
    }
    if (paramSection && isMarketingSection(paramSection)) {
      setSectionState(paramSection);
      return;
    }
    if (!paramSection) {
      setSectionState(DEFAULT_SECTION);
    }
  }, [paramSection, isHomePage, router]);

  useEffect(() => {
    MARKETING_SECTIONS.forEach((item) => {
      router.prefetch(sectionHref(item.id));
    });
  }, [router]);

  const setSection = useCallback(
    (id: MarketingSectionId) => {
      if (id === section) {
        window.scrollTo({ top: 0, behavior: "auto" });
        return;
      }

      setSectionState(id);
      window.scrollTo({ top: 0, behavior: "auto" });

      startTransition(() => {
        router.replace(sectionHref(id), { scroll: false });
      });
    },
    [router, section]
  );

  const value = useMemo(
    () => ({
      section,
      setSection,
      sections: MARKETING_SECTIONS,
      meta: getSectionMeta(section),
      isHomePage,
      isPending,
    }),
    [section, setSection, isHomePage, isPending]
  );

  return (
    <MarketingSectionContext.Provider value={value}>{children}</MarketingSectionContext.Provider>
  );
}

export function useMarketingSection() {
  const context = useContext(MarketingSectionContext);
  if (!context) {
    throw new Error("useMarketingSection must be used within MarketingSectionProvider");
  }
  return context;
}
