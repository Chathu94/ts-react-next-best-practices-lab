"use client";

import type { Incident } from "@/types/incident";
import { useCallback, useSyncExternalStore } from "react";
import { incidentsStore } from "@/lib/stores/incidentsStore";

export const useIncidents = () => {
  const snapshot = useSyncExternalStore(
    incidentsStore.subscribe,
    incidentsStore.getSnapshot,
    incidentsStore.getSnapshot,
  );

  const setIncidents = useCallback((items: Incident[]) => {
    incidentsStore.setItems(items);
  }, []);

  return {
    incidents: snapshot.items,
    setIncidents,
    loading: snapshot.loading,
    error: snapshot.error,
  };
};
