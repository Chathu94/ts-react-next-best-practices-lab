import type { DeployNote } from "@/types/incident";
import { formatDate } from "@/lib/format";

export default function DeployNotes({ notes }: { notes: DeployNote[] }) {
  return (
    <div className="card">
      <h2 className="text-lg font-semibold">Deploy Notes</h2>
      <div className="mt-3 space-y-2">
        {notes.map((note) => (
          <div key={note.id} className="rounded border border-slate-200 p-3 text-sm">
            <div className="font-medium">{note.service ?? "Service"}</div>
            <div className="text-xs text-slate-500">{formatDate(note.when)}</div>
            <p className="mt-2 text-sm text-slate-600">{note.note ?? ""}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
