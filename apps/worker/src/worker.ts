import {Worker,type Job} from "bullmq";
import Redis from "ioredis";
import {isValidMonitorCheckJob,type MonitorCheckJob} from "./job.js";

const connection=new Redis(process.env.REDIS_URL??"redis://localhost:6379",{
  maxRetriesPerRequest:null,enableReadyCheck:true
});
const worker=new Worker<MonitorCheckJob>("monitor-checks",async(job:Job<MonitorCheckJob>)=>{
  if(!isValidMonitorCheckJob(job.data)) throw new Error("Invalid monitor-check job payload");
  // Fail closed until persistent lookup, SSRF-hardened transport, and result writer exist.
  throw new Error("Monitor check processor is not implemented yet");
},{connection,concurrency:5});

worker.on("completed",job=>console.info(JSON.stringify({event:"job.completed",jobId:job.id})));
worker.on("failed",(job,error)=>console.error(JSON.stringify({event:"job.failed",jobId:job?.id,error:error.message})));
console.info("API Sentinel worker started; monitor processor is not enabled.");

const shutdown=async(signal:string):Promise<void>=>{
  console.info(`Received ${signal}; closing worker`);
  await worker.close();
  await connection.quit();
};
process.once("SIGINT",()=>void shutdown("SIGINT"));
process.once("SIGTERM",()=>void shutdown("SIGTERM"));
