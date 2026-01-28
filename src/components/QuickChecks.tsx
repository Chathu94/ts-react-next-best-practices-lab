"use client";

import { useCallback, useEffect, useState } from "react";
import type { CheckResult } from "@/types/incident";

const badgeMap: Record<string, string> = {
  ok: "bg-emerald-100 text-emerald-700",
  warn: "bg-amber-100 text-amber-700",
  down: "bg-rose-100 text-rose-700",
  pending: "bg-slate-100 text-slate-500",
};

export default function QuickChecks() {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [refreshAt, setRefreshAt] = useState<Date | null>(new Date());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/checks");
      const data = (await response.json()) as { items: CheckResult[] };
      setChecks(data.items ?? []);
      setError("");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (refreshAt) {
      load();
    }
  }, [refreshAt, load]);

  useEffect(() => {
    if (!refreshAt) return;
    const timer = window.setInterval(() => {
      setRefreshAt(new Date());
    }, 20000);
    return () => window.clearInterval(timer);
  }, [refreshAt]);

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Quick Checks</h2>
          <p className="text-xs text-slate-500">Auto-refreshes every 20s</p>
        </div>
        <button
          className="rounded border border-slate-200 px-2 py-1 text-xs"
          onClick={() => setRefreshAt(new Date())}
        >
          Refresh now
        </button>
      </div>

      {error ? <div className="mt-3 text-sm text-rose-500">{error}</div> : null}

      <div className="mt-3 space-y-2">
        {checks.map((check) => (
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
