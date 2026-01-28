"use client";

import { useCallback, useEffect, useState } from "react";
import type { CheckResult } from "@/types/incident";

export const useQuickChecks = (pollInterval = 20000) => {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/checks");
      if (!response.ok) throw new Error("Failed to fetch checks");

      const data = (await response.json()) as { items: CheckResult[] };
      setChecks(data.items ?? []);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    const run = async () => {
      if (active) {
        await load();
      }
    };

    run();

    const timer = window.setInterval(run, pollInterval);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [load, pollInterval]);

  return {
    checks,
    loading,
    error,
    refetch: load,
  };
};
