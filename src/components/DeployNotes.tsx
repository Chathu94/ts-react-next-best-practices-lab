import { memo } from "react";
import type { DeployNote } from "@/types/incident";
import { formatDate } from "@/lib/format";

interface DeployNotesProps {
  notes: DeployNote[];
}

function DeployNotes({ notes }: DeployNotesProps) {
  if (!notes || notes.length === 0) {
    return (
      <div className="card">
        <h2 className="text-lg font-semibold">Deploy Notes</h2>
        <div className="mt-3 text-sm text-slate-400">
          No deploy notes available
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <h2 className="text-lg font-semibold">Deploy Notes</h2>
      <div className="mt-3 space-y-2">
        {notes.map((note) => (
          <article
            key={note.id}
            className="rounded border border-slate-200 p-3 text-sm"
          >
            <div className="font-medium">{note.service ?? "Service"}</div>
            <div className="text-xs text-slate-500">
              {formatDate(note.when)}
            </div>
            <p className="mt-2 text-sm text-slate-600">{note.note ?? ""}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

export default memo(DeployNotes);
