"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { CheckResult } from "@/types/incident";

type QuickChecksState = {
  checks: CheckResult[];
  loading: boolean;
  error: string;
  refreshAt: Date | null;
};

const createQuickChecksStore = () => {
  let state: QuickChecksState = {
    checks: [],
    loading: false,
    error: "",
    refreshAt: null
  };
  let pollingStarted = false;
  let inFlight = false;
  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const setState = (next: Partial<QuickChecksState>) => {
    state = { ...state, ...next };
    notify();
  };

  const load = async () => {
    if (inFlight) return;
    inFlight = true;
    setState({ loading: true, error: "" });
    try {
      const response = await fetch("/api/checks", { cache: "no-store" });
      const data = (await response.json()) as { items: CheckResult[] };
      setState({
        checks: data.items ?? [],
        refreshAt: new Date()
      });
    } catch (err) {
      setState({ error: (err as Error).message });
    } finally {
      inFlight = false;
      setState({ loading: false });
    }
  };

  const startPolling = () => {
    if (pollingStarted || typeof window === "undefined") return;
    pollingStarted = true;
    void load();
    window.setInterval(() => {
      void load();
    }, 20000);
  };

  return {
    getSnapshot: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      startPolling();
      return () => listeners.delete(listener);
    },
    refresh: () => load()
  };
};

const quickChecksStore = createQuickChecksStore();

export const useQuickChecks = () => {
  const state = useSyncExternalStore(
    quickChecksStore.subscribe,
    quickChecksStore.getSnapshot,
    quickChecksStore.getSnapshot
  );

  const refresh = useCallback(() => {
    void quickChecksStore.refresh();
  }, []);

  return {
    ...state,
    refresh
  };
};
