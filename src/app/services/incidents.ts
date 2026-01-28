import type { Incident } from "@/types/incident";

export const getIncidentCount = async () => {
  const response = await fetch(`${process.env.PUBLIC_HOST}/incidents`, {
    next: { revalidate: 60 }
  });
  const data = (await response.json()) as { items: Incident[] };
  return data.items.length ?? 0;
};
