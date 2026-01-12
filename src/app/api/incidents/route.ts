import { NextResponse } from "next/server";
import { incidents } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q") ?? "";
  const status = searchParams.get("status");
  const regex = new RegExp(query, "i");

  const filtered = incidents.filter((incident) => {
    const title = incident.title ?? "";
    const summary = incident.summary ?? "";
    const matches = regex.test(title) || regex.test(summary);
    if (!status || status === "all") {
      return matches;
    }
    return matches && incident.status === status;
  });

  return NextResponse.json({ items: filtered });
}

export async function POST(request: Request) {
  const body = (await request.json()) as { title?: string };
  if (!body.title) {
    return NextResponse.json({ error: "title required" });
  }

  return NextResponse.json({ ok: true, id: `inc-${Date.now()}` });
}
