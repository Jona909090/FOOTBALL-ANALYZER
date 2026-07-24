import type { LucideIcon } from "lucide-react";
export function StatCard({label,value,change,icon:Icon,tone="dark"}:{label:string;value:string;change:string;icon:LucideIcon;tone?:"dark"|"light"}){
  return <div className={`card overflow-hidden p-5 ${tone==="dark"?"!border-ink !bg-ink text-white":""}`}>
    <div className="flex items-center justify-between"><span className={`text-xs font-semibold ${tone==="dark"?"text-slate-400":"text-slate-500"}`}>{label}</span><Icon className={`h-4 w-4 ${tone==="dark"?"text-lime":"text-slate-400"}`}/></div>
    <div className="mt-3 flex items-end justify-between"><strong className="text-3xl tracking-tight">{value}</strong><span className={`rounded-full px-2 py-1 text-[10px] font-bold ${change.startsWith("+")?"bg-emerald-100 text-emerald-700":"bg-slate-100 text-slate-600"}`}>{change}</span></div>
  </div>
}

