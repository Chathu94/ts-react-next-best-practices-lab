"use client";

import { useState, useMemo, useRef } from "react";
import Link from "next/link";
import type { Incident } from "@/types/incident";
import { formatDate, scoreIncident } from "@/lib/format";
import { useIncidents } from "@/hooks/useIncidents";

const statusStyles: Record<string, string> = {
  open: "bg-rose-100 text-rose-700",
  monitoring: "bg-amber-100 text-amber-700",
  closed: "bg-emerald-100 text-emerald-700",
};

export default function IncidentList() {
  const { incidents, setIncidents, loading, error, loadIncidents } =
    useIncidents();

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("all");
  const [lastAction, setLastAction] = useState("");
  const timeoutRef = useRef<number | null>(null);
  const hasLoadedRef = useRef(false);

  // Load incidents on mount
  if (!hasLoadedRef.current) {
    hasLoadedRef.current = true;
    loadIncidents();
  }

  // Compute filtered incidents directly (no separate state needed)
  const filtered = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return incidents.filter((incident) => {
      const title = incident.title?.toLowerCase() ?? "";
      const summary = incident.summary?.toLowerCase() ?? "";
      const matchesQuery =
        title.includes(normalized) || summary.includes(normalized);

      if (status === "all") {
        return matchesQuery;
      }
      return matchesQuery && incident.status === status;
    });
  }, [incidents, query, status]);

  // Compute score directly (already memoized via filtered)
  const incidentScore = filtered.reduce(
    (acc, incident) => acc + scoreIncident(incident.summary),
    0,
  );

  const showFeedback = (message: string) => {
    setLastAction(message);

    // Clear existing timeout
    if (timeoutRef.current !== null) {
      window.clearTimeout(timeoutRef.current);
    }

    // Set new timeout
    timeoutRef.current = window.setTimeout(() => {
      setLastAction("");
      timeoutRef.current = null;
    }, 2500);
  };

  const moveIncident = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;

    // Find the actual indices in the main incidents array
    const currentIncident = filtered[index];
    const targetIncident = filtered[targetIndex];

    const currentMainIndex = incidents.findIndex(
      (inc) => inc.id === currentIncident?.id,
    );
    const targetMainIndex = incidents.findIndex(
      (inc) => inc.id === targetIncident?.id,
    );

    if (currentMainIndex === -1 || targetMainIndex === -1) return;

    // Swap in the main array
    const updated = [...incidents];
    const temp = updated[currentMainIndex];
    updated[currentMainIndex] = updated[targetMainIndex] as Incident;
    updated[targetMainIndex] = temp as Incident;

    setIncidents(updated);
    showFeedback(`Moved ${currentIncident?.id ?? "incident"} ${direction}`);
  };

  if (loading) {
    return <div className="card">Loading incidents...</div>;
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Incidents</h2>
          <p className="text-xs text-slate-500">
            Impact score: {incidentScore}
          </p>
        </div>
        <div className="text-xs text-slate-400">{filtered.length} active</div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <input
          className="w-64 rounded-md border border-slate-200 px-3 py-2 text-sm"
          placeholder="Search incidents"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <select
          className="rounded-md border border-slate-200 px-2 py-2 text-sm"
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="monitoring">Monitoring</option>
          <option value="closed">Closed</option>
        </select>
        {lastAction ? (
          <div className="text-xs text-slate-400">{lastAction}</div>
        ) : null}
      </div>

      {error ? <div className="mt-3 text-sm text-rose-500">{error}</div> : null}

      <div className="mt-4 space-y-3">
        {filtered.map((incident, index) => (
          <div
            key={incident.id}
            className="rounded-md border border-slate-200 p-3"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link
                  className="text-sm font-semibold"
                  href={`/incidents/${incident.id}`}
                >
                  {incident.title ?? "Untitled incident"}
                </Link>
                <p className="text-xs text-slate-500">
                  {incident.summary ?? ""}
                </p>
              </div>
              <span
                className={`badge ${statusStyles[incident.status ?? "open"] ?? ""}`}
              >
                {incident.status ?? "open"}
              </span>
            </div>
            <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
              <div>
                <span>{incident.owner ?? "Unassigned"}</span>
                <span className="mx-2">•</span>
                <span>{formatDate(incident.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  className="rounded border border-slate-200 px-2 py-1"
                  onClick={() => moveIncident(index, "up")}
                  disabled={index === 0}
                >
                  Up
                </button>
                <button
                  className="rounded border border-slate-200 px-2 py-1"
                  onClick={() => moveIncident(index, "down")}
                  disabled={index === filtered.length - 1}
                >
                  Down
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
