"use client";

import { Suspense, use } from "react";

let lastUnreadCount = 0;

function UnreadCountValue({
  promise,
  children,
}: {
  promise: Promise<number>;
  children: (count: number) => React.ReactNode;
}) {
  const count = use(promise);
  lastUnreadCount = count;
  return <>{children(count)}</>;
}

export function DeferredUnreadCount({
  promise,
  children,
}: {
  promise: Promise<number>;
  children: (count: number) => React.ReactNode;
}) {
  return (
    <Suspense fallback={<>{children(lastUnreadCount)}</>}>
      <UnreadCountValue promise={promise}>{children}</UnreadCountValue>
    </Suspense>
  );
}
