import Link from "next/link";
import { formatDate } from "@/lib/format";
import { getIncident } from "@/services/incident.c";

export default async function IncidentDetailPage({
  params,
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
        <h2 className="text-2xl font-semibold">
          {incident.title ?? "Incident"}
        </h2>
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
