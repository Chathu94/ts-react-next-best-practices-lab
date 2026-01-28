"use client";

import { useLayoutEffect } from "react";
import type { CheckResult } from "@/types/incident";
import { usePolling } from "@/hooks/usePolling";

const badgeMap: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-700",
  warn: "bg-amber-100 text-amber-700",
  down: "bg-rose-100 text-rose-700",
  pending: "bg-slate-100 text-slate-500",
};

const REFRESH_INTERVAL = 20000;

const fetchChecks = async () => {
  const response = await fetch("/api/checks");

  if (!response.ok) {
    throw new Error(`Failed to fetch checks: ${response.status}`);
  }

  const data = (await response.json()) as { items: CheckResult[] };
  return data.items ?? [];
};

export default function QuickChecks() {
  const {
    data: checks = [],
    loading,
    error,
    refresh,
    start,
    stop,
  } = usePolling({
    fetcher: fetchChecks,
    interval: REFRESH_INTERVAL,
  });

  useLayoutEffect(() => {
    start();
    return stop;
  }, [start, stop]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Quick Checks</h2>
          <p className="text-xs text-slate-500">Auto-refreshes every 20s</p>
        </div>
        <button
          className="rounded border border-slate-200 px-2 py-1 text-xs hover:bg-slate-50 disabled:opacity-50"
          onClick={refresh}
          disabled={loading}
        >
          Refresh now
        </button>
      </div>

      {error ? <div className="mt-3 text-sm text-rose-500">{error}</div> : null}

      <div className="mt-3 space-y-2">
        {checks?.map((check) => (
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
        {loading ? (
          <div className="text-xs text-slate-400">Syncing...</div>
        ) : null}
      </div>
    </div>
  );
}
