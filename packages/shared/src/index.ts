import {z} from "zod";

export const monitorMethodSchema=z.enum(["GET","HEAD"]);
export const createMonitorSchema=z.object({
  name:z.string().trim().min(1).max(80),
  url:z.string().trim().url().max(2048),
  method:monitorMethodSchema.default("GET"),
  intervalSeconds:z.number().int().min(60).max(86400).default(300),
  timeoutMs:z.number().int().min(1000).max(30000).default(10000)
}).strict();

export type CreateMonitorInput=z.infer<typeof createMonitorSchema>;
export type MonitorMethod=z.infer<typeof monitorMethodSchema>;
export interface HealthResponse{
  status:"ok"|"ready"|"not_ready";
  service?:string;
  timestamp:string;
}
