"use client";

import type { CheckResult } from "@/types/incident";

type ChecksSnapshot = {
  items: CheckResult[];
  loading: boolean;
  error: string | null;
  isRefreshing: boolean;
};

type Listener = () => void;

type ChecksStore = {
  getSnapshot: () => ChecksSnapshot;
  subscribe: (listener: Listener) => () => void;
  refresh: () => void;
};

const listeners = new Set<Listener>();

let snapshot: ChecksSnapshot = {
  items: [],
  loading: true,
  error: null,
  isRefreshing: false,
};

let inFlight: Promise<void> | null = null;
let hasLoadedOnce = false;
let pollTimer: ReturnType<typeof setInterval> | null = null;

const emit = () => {
  for (const listener of listeners) listener();
};

const refresh = () => {
  if (inFlight) return;

  snapshot = {
    ...snapshot,
    loading: !hasLoadedOnce,
    isRefreshing: hasLoadedOnce,
    error: null,
  };
  emit();

  inFlight = (async () => {
    try {
      const res = await fetch("/api/checks", { cache: "no-store" });
      if (!res.ok) {
        throw new Error(`Request failed: ${res.status}`);
      }
      const data = (await res.json()) as { items?: CheckResult[] };
      snapshot = {
        items: data.items ?? [],
        loading: false,
        isRefreshing: false,
        error: null,
      };
      hasLoadedOnce = true;
    } catch (err) {
      snapshot = {
        items: hasLoadedOnce ? snapshot.items : [],
        loading: false,
        isRefreshing: false,
        error: (err as Error).message,
      };
    } finally {
      inFlight = null;
      emit();
    }
  })();
};

const startPollingIfNeeded = () => {
  if (pollTimer) return;
  pollTimer = setInterval(() => {
    if (listeners.size === 0) return;
    refresh();
  }, 20000);
};

const stopPollingIfNeeded = () => {
  if (listeners.size > 0) return;
  if (pollTimer) {
    clearInterval(pollTimer);
    pollTimer = null;
  }
};

export const checksStore: ChecksStore = {
  getSnapshot: () => snapshot,
  subscribe: (listener) => {
    listeners.add(listener);

    startPollingIfNeeded();
    if (!hasLoadedOnce && !inFlight) {
      refresh();
    }

    return () => {
      listeners.delete(listener);
      stopPollingIfNeeded();
    };
  },
  refresh,
};
