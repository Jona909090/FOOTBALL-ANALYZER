"use client";
import { ArrowRight, Clock3 } from "lucide-react";
import type { Match } from "@/types";
import { RiskBadge } from "./risk-badge";
import { TeamCrest } from "./team-crest";

export function MatchCard({match,onOpen}:{match:Match;onOpen:(match:Match)=>void}){
  const time=new Date(match.kickoff).toLocaleTimeString("sr-RS",{hour:"2-digit",minute:"2-digit"});
  return <article className="card p-4 transition hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-start justify-between gap-3">
      <div><div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{match.flag} {match.country}</div><div className="mt-1 text-xs font-bold text-slate-700">{match.league}</div></div>
      <RiskBadge risk={match.risk}/>
    </div>
    <div className="my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
      <div className="flex flex-col items-center text-center"><TeamCrest team={match.home}/><span className="mt-2 text-xs font-bold">{match.home.name}</span></div>
      <div className="text-center">
        {match.status==="Završeno"?<div className="text-2xl font-black">{match.homeScore} : {match.awayScore}</div>:<><div className="text-xl font-black">{time}</div><div className="mt-1 flex items-center gap-1 text-[10px] font-bold text-emerald-600"><Clock3 className="h-3 w-3"/>{match.status}</div></>}
      </div>
      <div className="flex flex-col items-center text-center"><TeamCrest team={match.away}/><span className="mt-2 text-xs font-bold">{match.away.name}</span></div>
    </div>
    <div className="grid grid-cols-3 gap-2">{[["1",match.odds.home],["X",match.odds.draw],["2",match.odds.away]].map(([x,o])=><div key={String(x)} className="rounded-lg bg-slate-50 px-2 py-2 text-center text-xs"><span className="mr-2 text-slate-400">{x}</span><b>{Number(o).toFixed(2)}</b></div>)}</div>
    <button onClick={()=>onOpen(match)} className="focus-ring mt-4 flex w-full items-center justify-between border-t border-slate-100 pt-3 text-xs font-bold text-slate-700">Detaljna analiza <ArrowRight className="h-4 w-4"/></button>
  </article>
}

