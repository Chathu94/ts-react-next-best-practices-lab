import { describe, expect, it } from "vitest";
import { formatDate, scoreIncident } from "@/lib/format";

describe("format utilities", () => {
  it("formats a date string", () => {
    const result = formatDate("2024-05-05T07:45:00Z");
    expect(result).toContain("May");
  });

  it("scores incident summaries", () => {
    expect(scoreIncident("one two")).toBe(6);
  });
});
