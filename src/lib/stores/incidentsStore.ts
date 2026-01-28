"use client";

import type { Incident } from "@/types/incident";

type IncidentsSnapshot = {
  items: Incident[];
  loading: boolean;
  error: string | null;
};

type Listener = () => void;

type IncidentsStore = {
  getSnapshot: () => IncidentsSnapshot;
  subscribe: (listener: Listener) => () => void;
  refresh: () => void;
  setItems: (items: Incident[]) => void;
};

const listeners = new Set<Listener>();

let snapshot: IncidentsSnapshot = {
  items: [],
  loading: true,
  error: null,
};

let inFlight: Promise<void> | null = null;
let hasLoadedOnce = false;

const emit = () => {
  for (const listener of listeners) listener();
};

const refresh = () => {
  if (inFlight) return;

  snapshot = { ...snapshot, loading: true, error: null };
  emit();

  inFlight = (async () => {
    try {
      const res = await fetch("/api/incidents", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      const data = (await res.json()) as { items?: Incident[] };
      snapshot = {
        items: data.items ?? [],
        loading: false,
        error: null,
      };
      hasLoadedOnce = true;
    } catch (err) {
      snapshot = {
        items: hasLoadedOnce ? snapshot.items : [],
        loading: false,
        error: (err as Error).message,
      };
    } finally {
      inFlight = null;
      emit();
    }
  })();
};

export const incidentsStore: IncidentsStore = {
  getSnapshot: () => snapshot,
  subscribe: (listener) => {
    listeners.add(listener);

    if (!hasLoadedOnce && !inFlight) {
      refresh();
    }

    return () => {
      listeners.delete(listener);
    };
  },
  refresh,
  setItems: (items) => {
    snapshot = { ...snapshot, items };
    emit();
  },
};
