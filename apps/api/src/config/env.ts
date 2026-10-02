const required=(name:string,fallback?:string):string=>{
  const value=process.env[name]??fallback;
  if(!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
};
const port=Number(process.env.API_PORT??"4000");
if(!Number.isInteger(port)||port<1||port>65535) throw new Error("API_PORT must be between 1 and 65535");
export const env={
  nodeEnv:process.env.NODE_ENV??"development",
  host:process.env.HOST??"0.0.0.0",
  port,
  databaseUrl:required("DATABASE_URL","postgresql://sentinel:sentinel_dev_only@localhost:5432/api_sentinel?schema=public"),
  redisUrl:required("REDIS_URL","redis://localhost:6379"),
  logLevel:process.env.LOG_LEVEL??"info"
} as const;
