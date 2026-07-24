import type { Risk } from "@/types";
export function RiskBadge({ risk }: { risk: Risk }) {
  const style=risk==="Nizak"?"bg-emerald-50 text-emerald-700":risk==="Srednji"?"bg-amber-50 text-amber-700":risk==="Visok"?"bg-rose-50 text-rose-700":"bg-slate-100 text-slate-600";
  return <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-bold ${style}`}>{risk} rizik</span>;
}

