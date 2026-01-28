export type IncidentSeverity = "low" | "medium" | "high";
export type IncidentStatus = "open" | "monitoring" | "closed";
export type CheckStatus = "ok" | "warn" | "down" | "pending";

export type Incident = {
  id: string;
  title?: string;
  summary?: string;
  severity?: IncidentSeverity;
  status?: IncidentStatus;
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
  status?: CheckStatus;
  detail?: string;
};
