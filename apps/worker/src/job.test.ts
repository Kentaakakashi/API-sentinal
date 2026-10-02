import {describe,expect,it} from "vitest";
import {isValidMonitorCheckJob} from "./job.js";

describe("isValidMonitorCheckJob",()=>{
  it("accepts a complete job payload",()=>{
    expect(isValidMonitorCheckJob({monitorId:"mon_123",requestedAt:"2026-10-02T08:00:00.000Z"})).toBe(true);
  });
  it("rejects missing monitor identifiers",()=>{
    expect(isValidMonitorCheckJob({monitorId:" ",requestedAt:"2026-10-02T08:00:00.000Z"})).toBe(false);
  });
  it("rejects invalid timestamps",()=>{
    expect(isValidMonitorCheckJob({monitorId:"mon_123",requestedAt:"not-a-date"})).toBe(false);
  });
  it("rejects non-object payloads",()=>{
    expect(isValidMonitorCheckJob(null)).toBe(false);
    expect(isValidMonitorCheckJob("job")).toBe(false);
  });
});
