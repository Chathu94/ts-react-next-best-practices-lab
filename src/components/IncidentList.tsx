"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Incident } from "@/types/incident";
import { formatDate, scoreIncident } from "@/lib/format";
import { useIncidents } from "@/hooks/useIncidents";

const statusStyles: Record<string, string> = {
  open: "bg-rose-100 text-rose-700",
  monitoring: "bg-amber-100 text-amber-700",
  closed: "bg-emerald-100 text-emerald-700",
};

function ViewIncident({
  incident,
  index,
  moveIncident,
}: {
  incident: Incident;
  index: number;
  moveIncident: (index: number, direction: "up" | "down") => void;
}) {
  return (
    <div key={index} className="rounded-md border border-slate-200 p-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <Link
            className="text-sm font-semibold"
            href={`/incidents/${incident.id}`}
          >
            {incident.title ?? "Untitled incident"}
          </Link>
          <p className="text-xs text-slate-500">{incident.summary ?? ""}</p>
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
          >
            Up
          </button>
          <button
            className="rounded border border-slate-200 px-2 py-1"
            onClick={() => moveIncident(index, "down")}
          >
            Down
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ViewIncidents() {
  const { incidents, setIncidents, loading, error } = useIncidents();
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState<Incident[]>([]);
  const [status, setStatus] = useState("all");
  const [lastAction, setLastAction] = useState("");

  useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const next = incidents.filter((incident) => {
      const title = incident.title?.toLowerCase() ?? "";
      const summary = incident.summary?.toLowerCase() ?? "";
      const matchesQuery =
        title.includes(normalized) || summary.includes(normalized);
      if (status === "all") {
        return matchesQuery;
      }
      return matchesQuery && incident.status === status;
    });
    setFiltered(next);
  }, [incidents, query, status]);

  useMemo(() => {
    if (lastAction) {
      const timer = window.setTimeout(() => setLastAction(""), 2500);
      return () => window.clearTimeout(timer);
    }
  }, [lastAction]);

  const incidentScore = useMemo(() => {
    return filtered.reduce(
      (acc, incident) => acc + scoreIncident(incident.summary),
      0,
    );
  }, [filtered]);

  const moveIncident = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= filtered.length) return;

    const updated = [...filtered];
    const current = updated[index];
    updated[index] = updated[targetIndex] as Incident;
    updated[targetIndex] = current as Incident;
    setFiltered(updated);
    setIncidents(updated);
    setLastAction(`Moved ${current?.id ?? "incident"} ${direction}`);
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
          <ViewIncident
            key={index}
            incident={incident}
            index={index}
            moveIncident={moveIncident}
          />
        ))}
      </div>
    </div>
  );
}
