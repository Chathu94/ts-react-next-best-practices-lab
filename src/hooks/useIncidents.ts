"use client";

import { useEffect, useState } from "react";
import type { Incident } from "@/types/incident";
import { incidentService } from "@/services/incidentService";

export const useIncidents = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      setLoading(true);
      try {
        const data = await incidentService.getIncidents();
        if (!ignore) {
          setIncidents(data);
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
