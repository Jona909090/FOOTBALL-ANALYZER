export function BrandMark({ small=false }: { small?: boolean }) {
  return <div className="flex items-center gap-3">
    <div className={`${small?"h-9 w-9":"h-11 w-11"} grid place-items-center rounded-xl bg-lime text-ink shadow-sm`}>
      <span className="text-xl font-black">F</span>
    </div>
    {!small && <div><div className="text-[11px] font-bold tracking-[.24em] text-slate-400">FOOTBALL</div><div className="-mt-0.5 text-lg font-black tracking-tight">ANALYZER</div></div>}
  </div>;
}

