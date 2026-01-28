"use client";

import { useState, useCallback } from "react";
import type { Incident } from "@/types/incident";

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  const loadIncidents = useCallback(async () => {
    if (isInitialized) return;

    setLoading(true);
    setIsInitialized(true);

    try {
      const res = await fetch("/api/incidents", { cache: "no-store" });
      const data = (await res.json()) as { items: Incident[] };
      setIncidents(data.items ?? []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [isInitialized]);

  return { incidents, setIncidents, loading, error, loadIncidents };
};
