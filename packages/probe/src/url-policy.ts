import {lookup} from "node:dns/promises";
import {isIP} from "node:net";

export interface TargetValidationResult{ok:boolean;normalizedUrl?:string;reason?:string;}
const blockedHostnames=new Set(["localhost","localhost.localdomain","metadata.google.internal"]);

function ipv4ToNumber(address:string):number{
  return address.split(".").reduce((value,octet)=>(value*256)+Number(octet),0)>>>0;
}
function inIpv4Range(address:string,base:string,prefix:number):boolean{
  const mask=prefix===0?0:(0xffffffff<<(32-prefix))>>>0;
  return (ipv4ToNumber(address)&mask)===(ipv4ToNumber(base)&mask);
}
function isPublicIpv4(address:string):boolean{
  const blocked:Array<[string,number]>=[
    ["0.0.0.0",8],["10.0.0.0",8],["100.64.0.0",10],["127.0.0.0",8],
    ["169.254.0.0",16],["172.16.0.0",12],["192.0.0.0",24],["192.0.2.0",24],
    ["192.88.99.0",24],["192.168.0.0",16],["198.18.0.0",15],["198.51.100.0",24],
    ["203.0.113.0",24],["224.0.0.0",4],["240.0.0.0",4]
  ];
  return !blocked.some(([base,prefix])=>inIpv4Range(address,base,prefix));
}
function isPublicIpv6(address:string):boolean{
  const normalized=address.toLowerCase().split("%")[0]??address.toLowerCase();
  if(normalized==="::"||normalized==="::1") return false;
  if(normalized.startsWith("fc")||normalized.startsWith("fd")) return false;
  if(/^fe[89ab]/.test(normalized)||normalized.startsWith("ff")) return false;
  if(normalized.startsWith("2001:db8:")||normalized.startsWith("2001:0000:")||normalized.startsWith("2001:10:")) return false;
  const mapped=normalized.match(/::ffff:(\d+\.\d+\.\d+\.\d+)$/);
  if(mapped?.[1]) return isPublicIpv4(mapped[1]);
  return /^[23][0-9a-f]{0,3}:/i.test(normalized);
}
export function isPublicIpAddress(address:string):boolean{
  const family=isIP(address);
  if(family===4) return isPublicIpv4(address);
  if(family===6) return isPublicIpv6(address);
  return false;
}
export async function validateMonitorTarget(input:string):Promise<TargetValidationResult>{
  let url:URL;
  try{url=new URL(input);}catch{return {ok:false,reason:"Target must be a valid absolute URL"};}
  if(url.protocol!=="https:"&&url.protocol!=="http:") return {ok:false,reason:"Only HTTP and HTTPS targets are allowed"};
  if(url.username||url.password) return {ok:false,reason:"Credentials embedded in target URLs are not allowed"};
  const hostname=url.hostname.toLowerCase().replace(/\.$/,"");
  if(!hostname||blockedHostnames.has(hostname)||hostname.endsWith(".localhost")||hostname.endsWith(".local")){
    return {ok:false,reason:"Local hostnames are not allowed"};
  }
  if(isIP(hostname)){
    if(!isPublicIpAddress(hostname)) return {ok:false,reason:"Non-public IP addresses are not allowed"};
  }else{
    try{
      const records=await lookup(hostname,{all:true,verbatim:true});
      if(records.length===0||records.some(record=>!isPublicIpAddress(record.address))){
        return {ok:false,reason:"Target resolves to a non-public or invalid IP address"};
      }
    }catch{return {ok:false,reason:"Target hostname could not be resolved"};}
  }
  url.hash="";
  return {ok:true,normalizedUrl:url.toString()};
}
