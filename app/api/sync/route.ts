import { NextResponse } from "next/server";
import { getFixtures } from "@/services/sports-api";
export async function POST(request:Request){
  const auth=request.headers.get("authorization");
  if(process.env.CRON_SECRET && auth!==`Bearer ${process.env.CRON_SECRET}`) return NextResponse.json({error:"Nedozvoljen pristup."},{status:401});
  const data=await getFixtures();
  return NextResponse.json({ok:true,mode:process.env.SPORTS_API_KEY?"live":"demo",count:Array.isArray(data)?data.length:0,syncedAt:new Date().toISOString()});
}
