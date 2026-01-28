import { getIncidentCount } from "@/app/services/incidents";

export default async function TeamSnapshot() {
  const totalIncidents = await getIncidentCount();

  return (
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
  );
}