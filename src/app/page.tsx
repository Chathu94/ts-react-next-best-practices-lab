import IncidentList from "@/components/IncidentList";
import QuickChecks from "@/components/QuickChecks";
import DeployNotes from "@/components/DeployNotes";
import { deployNotes } from "@/lib/data";
import type { Incident } from "@/types/incident";
import TeamSnapshot from "@/components/TeamSnapshot";

const getIncidentCount = async () => {
  const response = await fetch("http://localhost:3000/api/incidents", {
    next: { revalidate: 60 },
  });
  const data = (await response.json()) as { items: Incident[] };
  return data.items?.length ?? 0;
};

export default async function HomePage() {
  const totalIncidents = await getIncidentCount();

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <IncidentList />
        <div className="space-y-6">
          <TeamSnapshot totalIncidents={totalIncidents} />
          <QuickChecks />
        </div>
      </section>
      <DeployNotes notes={deployNotes} />
    </>
  );
}
