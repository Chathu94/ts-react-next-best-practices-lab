import { NextResponse } from "next/server";
import { checks } from "@/lib/data";

export async function GET() {
  const items = checks.map((check) => {
    const roll = Math.random();
    if (roll > 0.85) {
      return { ...check, status: "down", detail: "Pager triggered" };
    }
    if (roll > 0.65) {
      return { ...check, status: "warn", detail: "Slow responses" };
    }
    return { ...check, status: "ok", detail: "Within SLO" };
  });

  return NextResponse.json({ items, generatedAt: new Date().toISOString() });
}
