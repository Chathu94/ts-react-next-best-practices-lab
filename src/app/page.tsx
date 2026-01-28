import IncidentList from "@/components/IncidentList";
import QuickChecks from "@/components/QuickChecks";
import DeployNotes from "@/components/DeployNotes";
import { deployNotes } from "@/lib/data";
import type { Incident } from "@/types/incident";
import { incidentService } from "@/services/incidentService";



export default async function HomePage() {
  const totalIncidents = await incidentService.getIncidentCount();

  return (
    <>
      <section className="grid gap-6 lg:grid-cols-[2fr,1fr]">
        <IncidentList />
        <div className="space-y-6">
          <div className="card">
            <h2 className="text-lg font-semibold">Team Snapshot</h2>
            <div className="mt-3 text-sm text-slate-600">
              <div className="flex items-center justify-between">
                <span>Open incidents</span>
                <span className="font-semibold">{totalIncidents}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span>On-call</span>
                <span className="font-semibold">Marta</span>
              </div>
            </div>
          </div>
          <QuickChecks />
        </div>
      </section>
      <DeployNotes notes={deployNotes} />
    </>
  );
}