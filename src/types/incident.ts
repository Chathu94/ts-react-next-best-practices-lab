export type Incident = {
  id: string;
  title?: string;
  summary?: string;
  severity?: "low" | "medium" | "high";
  status?: "open" | "monitoring" | "closed";
  owner?: string;
  createdAt?: string;
  tags?: string[];
};

export type DeployNote = {
  id: string;
  service?: string;
  note?: string;
  when?: string;
};

export type CheckResult = {
  id: string;
  label?: string;
  status?: "ok" | "warn" | "down" | "pending";
  detail?: string;
};
