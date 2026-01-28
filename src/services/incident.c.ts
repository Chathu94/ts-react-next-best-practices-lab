import { Incident } from "@/types/incident";

const BASE_URL = "http://localhost:3000/api/incidents";

export const getIncidentCount = async () => {
  const response = await fetch(BASE_URL, {
    next: { revalidate: 60 },
  });
  const data = (await response.json()) as { items: Incident[] };
  return data.items?.length ?? 0;
};

export const getIncident = async (id: string) => {
  const response = await fetch(`${BASE_URL}/${id}`, {
    cache: "no-store",
  });
  const data = (await response.json()) as { item?: Incident };
  return data.item as Incident;
};
