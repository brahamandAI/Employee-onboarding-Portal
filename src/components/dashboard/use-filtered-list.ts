"use client";

import { useMemo, useState } from "react";
import { EmployeeStatus } from "@/types/enums";
import { matchesApprovalStatusFilter } from "@/lib/ui/approval-status-filter";

export type ListSort = "default" | "name" | "newest" | "oldest";

const PAGE_SIZE = 10;

export function useFilteredList<T>(
  items: T[],
  getStatus: (item: T) => EmployeeStatus,
  getSearchText: (item: T) => string,
  getDate?: (item: T) => string | undefined,
  getName?: (item: T) => string
) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sort, setSort] = useState<ListSort>("default");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let next = items.filter((item) => {
      if (!matchesApprovalStatusFilter(getStatus(item), statusFilter)) return false;
      if (!q) return true;
      return getSearchText(item).toLowerCase().includes(q);
    });

    if (sort === "name" && getName) {
      next = [...next].sort((a, b) =>
        (getName(a) ?? "").localeCompare(getName(b) ?? "", "en", {
          sensitivity: "base",
        })
      );
    } else if ((sort === "newest" || sort === "oldest") && getDate) {
      next = [...next].sort((a, b) => {
        const da = getDate(a) ? new Date(getDate(a)!).getTime() : 0;
        const db = getDate(b) ? new Date(getDate(b)!).getTime() : 0;
        return sort === "newest" ? db - da : da - db;
      });
    }

    return next;
    // Intentional: getters are stable per call-site shape, not identity.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items, search, statusFilter, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pageCount);
  const paged = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  function updateSearch(value: string) {
    setSearch(value);
    setPage(1);
  }

  function updateStatus(value: string) {
    setStatusFilter(value);
    setPage(1);
  }

  function updateSort(value: ListSort) {
    setSort(value);
    setPage(1);
  }

  return {
    search,
    statusFilter,
    sort,
    page: safePage,
    pageCount,
    pageSize: PAGE_SIZE,
    total: filtered.length,
    rows: paged,
    setSearch: updateSearch,
    setStatusFilter: updateStatus,
    setSort: updateSort,
    setPage,
  };
}
