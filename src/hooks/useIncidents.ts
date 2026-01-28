"use client";

import { useEffect, useState, useCallback } from "react";
import type { Incident } from "@/types/incident";

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/incidents", { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch incidents");

      const data = (await res.json()) as { items: Incident[] };
      setIncidents(data.items ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      if (!ignore) {
        await fetchIncidents();
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [fetchIncidents]);

  return {
    incidents,
    setIncidents,
    loading,
    error,
    refetch: fetchIncidents,
  };
};
