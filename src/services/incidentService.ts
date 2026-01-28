import type { Incident } from "@/types/incident";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "/api";

export const incidentService = {
  async getIncidents(): Promise<Incident[]> {
    const res = await fetch(`${API_BASE}/incidents`, { cache: "no-store" });
    if (!res.ok) {
      throw new Error(`Failed to fetch incidents: ${res.statusText}`);
    }
    try {
      const data = (await res.json()) as { items: Incident[] };
      return data.items ;
    } catch (error) {
      throw new Error(
        `Failed to parse incidents response`
      );
    }
  },

  async getIncidentCount(): Promise<number> {
    const incidents = await this.getIncidents();
    return incidents.length;
  },

  async getIncidentById(id: string): Promise<Incident | null> {
    const res = await fetch(`${API_BASE}/incidents/${id}`, { cache: "no-store" });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch incident: ${res.statusText}`);
    }
    try {
      const data = (await res.json()) as Incident;
      return data;
    } catch (error) {
      throw new Error(
        `Failed to parse incident response`
      );
    }
  },

};
