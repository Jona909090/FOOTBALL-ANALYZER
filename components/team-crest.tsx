import type { Team } from "@/types";
export function TeamCrest({ team, size="md" }: { team:Team; size?:"sm"|"md"|"lg" }) {
  const cls=size==="lg"?"h-16 w-16 text-base":size==="sm"?"h-8 w-8 text-[9px]":"h-10 w-10 text-[10px]";
  return <div title={team.name} style={{background:`linear-gradient(145deg, ${team.color}, #111827)`}} className={`${cls} grid shrink-0 place-items-center rounded-full border-2 border-white font-black text-white shadow`}>{team.short.slice(0,3)}</div>;
}

