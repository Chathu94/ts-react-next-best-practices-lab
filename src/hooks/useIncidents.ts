"use client";

import { useEffect, useState } from "react";
import type { Incident } from "@/types/incident";

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/incidents", { cache: "no-store" });
        const data = (await res.json()) as { items: Incident[] };
        if (!ignore) {
          setIncidents(data.items ?? []);
        }
      } catch (err) {
        if (!ignore) {
          setError((err as Error).message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, []);

  return { incidents, setIncidents, loading, error };
};
