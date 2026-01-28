"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import type { CheckResult } from "@/types/incident"

type ChecksResponse = {
  items: CheckResult[]
}

export const useChecks = (autoRefreshMs = 20000) => {
  const [checks, setChecks] = useState<CheckResult[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const timerRef = useRef<number | null>(null)

  const fetchChecks = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/checks", { cache: "no-store" })

      if (!res.ok) {
        throw new Error(`Failed to load checks (${res.status})`)
      }

      const data = (await res.json()) as ChecksResponse
      setChecks(data.items ?? [])
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchChecks()

    timerRef.current = window.setInterval(fetchChecks, autoRefreshMs)

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [fetchChecks, autoRefreshMs])

  return {
    checks,
    loading,
    error,
    refresh: fetchChecks
  }
}
