import Link from "next/link";
import type { Incident } from "@/types/incident";
import { formatDate } from "@/lib/format";

const getIncident = async (id: string) => {
  const response = await fetch(`http://localhost:3000/api/incidents/${id}`, {
    cache: "no-store"
  });
  const data = (await response.json()) as { item?: Incident };
  return data.item as Incident;
};

export default async function IncidentDetailPage({
  params
}: {
  params: { id: string };
}) {
  const incident = await getIncident(params.id);

  return (
    <div className="card">
      <Link className="text-xs text-slate-500" href="/">
        ← Back to board
      </Link>
      <div className="mt-3">
        <h2 className="text-2xl font-semibold">{incident.title ?? "Incident"}</h2>
        <p className="mt-2 text-sm text-slate-600">{incident.summary ?? ""}</p>
      </div>
      <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-2">
        <div>
          <div className="text-xs uppercase text-slate-400">Owner</div>
          <div>{incident.owner ?? "Unknown"}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-slate-400">Status</div>
          <div>{incident.status ?? "open"}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-slate-400">Severity</div>
          <div>{incident.severity ?? "low"}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-slate-400">Created</div>
          <div>{formatDate(incident.createdAt)}</div>
        </div>
      </div>
    </div>
  );
}
