"use client"

import { useState } from "react"
import type { Incident } from "@/types/incident"
import { incidents as INCIDENTS } from "@/lib/data"

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>(INCIDENTS)
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  return {
    incidents,
    setIncidents,
    loading,
    error
  }
}
