"use client";

import { useCallback, useSyncExternalStore } from "react";
import type { Incident } from "@/types/incident";

type IncidentState = {
  incidents: Incident[];
  loading: boolean;
  error: string | null;
};

const createIncidentStore = () => {
  let state: IncidentState = {
    incidents: [],
    loading: true,
    error: null
  };
  let hasLoaded = false;
  let isLoading = false;
  const listeners = new Set<() => void>();

  const notify = () => {
    listeners.forEach((listener) => listener());
  };

  const setState = (next: Partial<IncidentState>) => {
    state = { ...state, ...next };
    notify();
  };

  const load = async () => {
    if (hasLoaded || isLoading) return;
    isLoading = true;
    setState({ loading: true, error: null });
    try {
      const res = await fetch("/api/incidents", { cache: "no-store" });
      const data = (await res.json()) as { items: Incident[] };
      setState({ incidents: data.items ?? [] });
      hasLoaded = true;
    } catch (err) {
      setState({ error: (err as Error).message });
    } finally {
      isLoading = false;
      setState({ loading: false });
    }
  };

  return {
    getSnapshot: () => state,
    subscribe: (listener: () => void) => {
      listeners.add(listener);
      void load();
      return () => listeners.delete(listener);
    },
    setIncidents: (next: Incident[] | ((prev: Incident[]) => Incident[])) => {
      const nextValue =
        typeof next === "function" ? (next as (prev: Incident[]) => Incident[])(state.incidents) : next;
      setState({ incidents: nextValue });
    }
  };
};

const incidentStore = createIncidentStore();

export const useIncidents = () => {
  const state = useSyncExternalStore(
    incidentStore.subscribe,
    incidentStore.getSnapshot,
    incidentStore.getSnapshot
  );

  const setIncidents = useCallback(
    (next: Incident[] | ((prev: Incident[]) => Incident[])) => {
      incidentStore.setIncidents(next);
    },
    []
  );

  return {
    incidents: state.incidents,
    loading: state.loading,
    error: state.error,
    setIncidents
  };
};
