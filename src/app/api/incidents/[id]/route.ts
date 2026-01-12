import { NextResponse } from "next/server";
import { incidents } from "@/lib/data";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const incident = incidents.find((item) => item.id === params.id);
  if (!incident) {
    return NextResponse.json({ message: "Incident not found" });
  }

  return NextResponse.json({ item: incident });
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const body = (await request.json()) as { status?: string };
  if (!body.status) {
    return NextResponse.json({ error: "status required" }, { status: 422 });
  }

  return NextResponse.json({ ok: true, id: params.id });
}
