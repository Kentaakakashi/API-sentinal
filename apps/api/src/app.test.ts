import {afterEach,describe,expect,it} from "vitest";
import type {FastifyInstance} from "fastify";
import {buildApp} from "./app.js";

describe("API health routes",()=>{
  let app:FastifyInstance|undefined;
  afterEach(async()=>{if(app) await app.close();});
  it("exposes a liveness response without dependency checks",async()=>{
    app=await buildApp();
    const response=await app.inject({method:"GET",url:"/health/live"});
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({status:"ok",service:"api-sentinel-api"});
  });
  it("does not expose a monitor probe endpoint yet",async()=>{
    app=await buildApp();
    const response=await app.inject({method:"POST",url:"/v1/probe",payload:{url:"http://127.0.0.1"}});
    expect(response.statusCode).toBe(404);
  });
});
