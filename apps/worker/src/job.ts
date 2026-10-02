export interface MonitorCheckJob {
  monitorId: string;
  requestedAt: string;
}

export function isValidMonitorCheckJob(value: unknown): value is MonitorCheckJob {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return typeof candidate.monitorId === "string"
    && candidate.monitorId.trim().length > 0
    && typeof candidate.requestedAt === "string"
    && Number.isFinite(Date.parse(candidate.requestedAt));
}
