import Fastify,{type FastifyInstance} from "fastify";
import helmet from "@fastify/helmet";
import {Redis} from "ioredis";
import {prisma} from "@sentinel/database";
import {env} from "./config/env.js";

export async function buildApp():Promise<FastifyInstance>{
  const app=Fastify({
    logger:{level:env.logLevel},
    requestIdHeader:"x-request-id",
    trustProxy:false,
    bodyLimit:1_048_576
  });
  const redis=new Redis(env.redisUrl,{lazyConnect:true,maxRetriesPerRequest:1,enableReadyCheck:true});
  await app.register(helmet,{contentSecurityPolicy:false});

  app.get("/health/live",async()=>({
    status:"ok",
    service:"api-sentinel-api",
    timestamp:new Date().toISOString()
  }));

  app.get("/health/ready",async(_request,reply)=>{
    const checks:{database:"ok"|"error";redis:"ok"|"error"}={database:"error",redis:"error"};
    try{await prisma.$queryRaw`SELECT 1`;checks.database="ok";}
    catch(error){app.log.warn({err:error},"Database readiness check failed");}
    try{
      if(redis.status==="wait") await redis.connect();
      await redis.ping();
      checks.redis="ok";
    }catch(error){app.log.warn({err:error},"Redis readiness check failed");}
    const ready=checks.database==="ok"&&checks.redis==="ok";
    return reply.code(ready?200:503).send({
      status:ready?"ready":"not_ready",checks,timestamp:new Date().toISOString()
    });
  });

  app.addHook("onClose",async()=>{
    if(redis.status==="ready") await redis.quit().catch(()=>undefined);
    else redis.disconnect();
    await prisma.$disconnect();
  });
  return app;
}
