import {describe,expect,it} from "vitest";
import {createMonitorSchema} from "./index.js";

describe("createMonitorSchema",()=>{
  it("applies safe defaults",()=>{
    expect(createMonitorSchema.parse({name:"Primary API",url:"https://example.com/health"})).toMatchObject({
      name:"Primary API",method:"GET",intervalSeconds:300,timeoutMs:10000
    });
  });
  it("rejects intervals below one minute",()=>{
    expect(createMonitorSchema.safeParse({name:"API",url:"https://example.com",intervalSeconds:30}).success).toBe(false);
  });
  it("rejects unsupported methods",()=>{
    expect(createMonitorSchema.safeParse({name:"API",url:"https://example.com",method:"POST"}).success).toBe(false);
  });
  it("rejects unexpected fields",()=>{
    expect(createMonitorSchema.safeParse({name:"API",url:"https://example.com",ownerId:"other-user"}).success).toBe(false);
  });
});
