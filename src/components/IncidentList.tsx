"use client"

import { useMemo, useState, useCallback, useEffect } from "react"
import Link from "next/link"
import type { Incident } from "@/types/incident"
import { formatDate, scoreIncident } from "@/lib/format"
import { useIncidents } from "@/hooks/useIncidents"

const statusStyles: Record<string, string> = {
  open: "bg-rose-100 text-rose-700",
  monitoring: "bg-amber-100 text-amber-700",
  closed: "bg-emerald-100 text-emerald-700"
}

export default function IncidentList() {
  const { incidents, setIncidents, loading, error } = useIncidents()
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<"all" | "open" | "monitoring" | "closed">("all")
  const [lastAction, setLastAction] = useState("")

  const filteredIncidents = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    return incidents.filter((incident) => {
      const title = incident.title?.toLowerCase() ?? ""
      const summary = incident.summary?.toLowerCase() ?? ""

      const matchesQuery = !normalized || title.includes(normalized) || summary.includes(normalized)
      const matchesStatus = status === "all" || incident.status === status

      return matchesQuery && matchesStatus
    })
  }, [incidents, query, status])

 
  const incidentScore = useMemo(() => {
    return filteredIncidents.reduce((acc, incident) => acc + scoreIncident(incident.summary), 0)
  }, [filteredIncidents])

  
  useEffect(() => {
    if (!lastAction) return
    const timer = setTimeout(() => setLastAction(""), 2500)
    return () => clearTimeout(timer)
  }, [lastAction])


  const moveIncident = useCallback(
    (id: string, direction: "up" | "down") => {
      setIncidents((prev) => {
        const index = prev.findIndex((i) => i.id === id)
        if (index === -1) return prev

        const targetIndex = direction === "up" ? index - 1 : index + 1
        if (targetIndex < 0 || targetIndex >= prev.length) return prev

        const next = [...prev]
        if (next[index] !== undefined && next[targetIndex] !== undefined) {
          [next[index], next[targetIndex]] = [next[targetIndex], next[index]]
        }

        return next
      })
      setLastAction(`Moved incident ${id} ${direction}`)
    },
    [setIncidents]
  )

  if (loading) return <div className="card">Loading incidents...</div>
  if (error) return <div className="card text-rose-500">{error}</div>

  return (
    <div className="card">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Incidents</h2>
          <p className="text-xs text-slate-500">Impact score: {incidentScore}</p>
        </div>
        <div className="text-xs text-slate-400">{filteredIncidents.length} active</div>
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
          onChange={(event) => setStatus(event.target.value as typeof status)}
        >
          <option value="all">All</option>
          <option value="open">Open</option>
          <option value="monitoring">Monitoring</option>
          <option value="closed">Closed</option>
        </select>

        {lastAction && <div className="text-xs text-slate-400">{lastAction}</div>}
      </div>

      <div className="mt-4 space-y-3">
        {filteredIncidents.map((incident) => (
          <div key={incident.id} className="rounded-md border border-slate-200 p-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <Link className="text-sm font-semibold" href={`/incidents/${incident.id}`}>
                  {incident.title ?? "Untitled incident"}
                </Link>
                <p className="text-xs text-slate-500">{incident.summary ?? ""}</p>
              </div>
              <span className={`badge ${statusStyles[incident.status ?? "open"] ?? ""}`}>
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
                  onClick={() => moveIncident(incident.id, "up")}
                >
                  Up
                </button>
                <button
                  className="rounded border border-slate-200 px-2 py-1"
                  onClick={() => moveIncident(incident.id, "down")}
                >
                  Down
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
