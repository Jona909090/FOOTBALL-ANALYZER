import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";

const schema=z.object({
  fixture:z.string().max(120),market:z.string().max(80),probability:z.number().min(0).max(1),
  odds:z.number().positive(),fairOdds:z.number().positive(),facts:z.array(z.string().max(220)).max(12)
});
export async function POST(request:Request){
  const parsed=schema.safeParse(await request.json());
  if(!parsed.success) return NextResponse.json({error:"Neispravni podaci."},{status:400});
  if(!process.env.OPENAI_API_KEY) return NextResponse.json({demo:true,text:`Model procenjuje ${(parsed.data.probability*100).toFixed(0)}% verovatnoće za ${parsed.data.market}. Poštena kvota je ${parsed.data.fairOdds.toFixed(2)}, dok je ponuđena ${parsed.data.odds.toFixed(2)}. Objašnjenje je zasnovano samo na dostupnim demo podacima.`});
  const openai=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
  const response=await openai.responses.create({model:process.env.OPENAI_MODEL??"gpt-4.1-mini",input:[
    {role:"system",content:"Piši kratko na srpskom. Koristi isključivo prosleđene činjenice. Ne izmišljaj podatke i jasno navedi šta nije dostupno. Ne garantuj dobitak."},
    {role:"user",content:JSON.stringify(parsed.data)}
  ]});
  return NextResponse.json({text:response.output_text});
}
