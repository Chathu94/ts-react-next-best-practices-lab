import type { Incident, DeployNote, CheckResult } from "@/types/incident";

export const incidents: Incident[] = [
  {
    id: "inc-1024",
    title: "Payments webhook retries",
    summary: "Retry queue grew after a partner timeout spike.",
    severity: "medium",
    status: "monitoring",
    owner: "Kira",
    createdAt: "2024-05-03T08:42:00Z",
    tags: ["payments", "queue"]
  },
  {
    id: "inc-1025",
    title: "Analytics lag",
    summary: "Hourly aggregates are 30m behind.",
    severity: "low",
    status: "open",
    owner: "Jo",
    createdAt: "2024-05-04T10:12:00Z",
    tags: ["analytics"]
  },
  {
    id: "inc-1026",
    title: "Notifications flaky",
    summary: "iOS push delivery at 80% in EU.",
    severity: "high",
    status: "open",
    owner: "Marta",
    createdAt: "2024-05-05T14:25:00Z",
    tags: ["mobile", "push"]
  }
];

export const deployNotes: DeployNote[] = [
  {
    id: "dep-21",
    service: "edge-api",
    note: "Rolled new rate limiter config.",
    when: "2024-05-04T09:15:00Z"
  },
  {
    id: "dep-22",
    service: "payments",
    note: "Hotfix for retries and backoff.",
    when: "2024-05-04T18:02:00Z"
  },
  {
    id: "dep-23",
    service: "web-app",
    note: "Minor build perf updates.",
    when: "2024-05-05T07:45:00Z"
  }
];

export const checks: CheckResult[] = [
  { id: "check-1", label: "Build pipeline", status: "pending" },
  { id: "check-2", label: "Edge latency", status: "pending" },
  { id: "check-3", label: "Queue backlog", status: "pending" }
];
