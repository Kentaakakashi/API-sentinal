import {describe,expect,it} from "vitest";
import {isPublicIpAddress,validateMonitorTarget} from "./url-policy.js";

describe("isPublicIpAddress",()=>{
  it.each(["127.0.0.1","10.0.0.1","172.16.0.1","192.168.1.2","169.254.10.20","100.64.0.1","224.0.0.1"])(
    "rejects non-public IPv4 address %s",(ip)=>expect(isPublicIpAddress(ip)).toBe(false)
  );
  it.each(["8.8.8.8","1.1.1.1","93.184.216.34"])(
    "accepts public IPv4 address %s",(ip)=>expect(isPublicIpAddress(ip)).toBe(true)
  );
  it.each(["::","::1","fc00::1","fe80::1","ff02::1","::ffff:127.0.0.1"])(
    "rejects non-public IPv6 address %s",(ip)=>expect(isPublicIpAddress(ip)).toBe(false)
  );
  it("rejects malformed addresses",()=>expect(isPublicIpAddress("not-an-ip")).toBe(false));
});

describe("validateMonitorTarget",()=>{
  it("rejects non-HTTP schemes",async()=>{
    await expect(validateMonitorTarget("file:///etc/passwd")).resolves.toMatchObject({ok:false});
  });
  it("rejects embedded credentials",async()=>{
    await expect(validateMonitorTarget("https://user:pass@example.com")).resolves.toMatchObject({ok:false});
  });
  it("rejects localhost before DNS lookup",async()=>{
    await expect(validateMonitorTarget("http://localhost:8080")).resolves.toMatchObject({ok:false});
  });
  it("rejects private IP literals",async()=>{
    await expect(validateMonitorTarget("http://192.168.1.1")).resolves.toMatchObject({ok:false});
  });
});
