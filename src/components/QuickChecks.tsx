"use client";

import { useSyncExternalStore } from "react";
import { checksStore } from "@/lib/stores/checksStore";

const badgeMap: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-700",
  warn: "bg-amber-100 text-amber-700",
  down: "bg-rose-100 text-rose-700",
  pending: "bg-slate-100 text-slate-500",
};

export default function QuickChecks() {
  const snapshot = useSyncExternalStore(
    checksStore.subscribe,
    checksStore.getSnapshot,
    checksStore.getSnapshot,
  );

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Quick Checks</h2>
          <p className="text-xs text-slate-500">Auto-refreshes every 20s</p>
        </div>
        <button
          className="rounded border border-slate-200 px-2 py-1 text-xs"
          onClick={() => checksStore.refresh()}
        >
          Refresh now
        </button>
      </div>

      {snapshot.error ? (
        <div className="mt-3 text-sm text-rose-500">{snapshot.error}</div>
      ) : null}

      <div className="mt-3 space-y-2">
        {snapshot.items.map((check) => (
          <div
            key={check.id}
            className="flex items-center justify-between text-sm"
          >
            <span>{check.label ?? "Check"}</span>
            <span className={`badge ${badgeMap[check.status ?? "pending"]}`}>
              {check.status ?? "pending"}
            </span>
          </div>
        ))}
        {snapshot.loading || snapshot.isRefreshing ? (
          <div className="text-xs text-slate-400">Syncing...</div>
        ) : null}
      </div>
    </div>
  );
}
