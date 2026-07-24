"use client";
import { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Activity, BarChart3, Bell, CalendarDays, ChevronDown, CircleUserRound, Clock3, Filter, Heart, Home, LayoutDashboard, LineChart, ListFilter, LogOut, Menu, Plus, Search, Settings, ShieldCheck, Sparkles, Star, Target, Ticket, TrendingUp, Trophy, Users, Wallet, X } from "lucide-react";
import { matches, modelHistory, picks } from "@/lib/demo-data";
import type { Match, Pick, TicketItem } from "@/types";
import { BrandMark } from "./brand-mark";
import { MatchCard } from "./match-card";
import { RiskBadge } from "./risk-badge";
import { StatCard } from "./stat-card";
import { TeamCrest } from "./team-crest";

type View="Početna"|"Utakmice"|"Predlozi dana"|"Moj tiket"|"Moje analize"|"Rezultati modela"|"Omiljeno"|"Profil"|"Podešavanja"|"Admin panel";
const nav:[View,typeof Home][]=[["Početna",Home],["Utakmice",CalendarDays],["Predlozi dana",Sparkles],["Moj tiket",Ticket],["Moje analize",Target],["Rezultati modela",LineChart],["Omiljeno",Heart]];
const secondary:[View,typeof Home][]=[["Profil",CircleUserRound],["Podešavanja",Settings],["Admin panel",ShieldCheck]];

function Header({view,onMenu}:{view:View|"Utakmica";onMenu:()=>void}) {
  return <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-canvas/90 px-4 backdrop-blur md:px-8">
    <div className="flex items-center gap-3"><button onClick={onMenu} className="rounded-lg p-2 lg:hidden"><Menu/></button><div><p className="text-[10px] font-bold uppercase tracking-[.2em] text-slate-400">Pregled</p><h1 className="text-xl font-black tracking-tight md:text-2xl">{view}</h1></div></div>
    <div className="flex items-center gap-2 md:gap-4"><div className="relative hidden md:block"><Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400"/><input className="focus-ring w-64 rounded-xl border border-slate-200 bg-white py-2 pl-9 pr-3 text-sm" placeholder="Pretraži tim, ligu, utakmicu..."/></div><button className="relative rounded-xl border border-slate-200 bg-white p-2.5"><Bell className="h-4 w-4"/><span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-rose-500"/></button><div className="hidden items-center gap-2 sm:flex"><div className="grid h-9 w-9 place-items-center rounded-xl bg-ink text-sm font-bold text-lime">AM</div><div className="text-xs"><b>Aleksandar</b><p className="text-[10px] text-slate-400">Demo nalog</p></div><ChevronDown className="h-3 w-3"/></div></div>
  </header>
}

function Sidebar({view,setView,open,setOpen}:{view:View;setView:(v:View)=>void;open:boolean;setOpen:(x:boolean)=>void}) {
  const link=([label,Icon]:[View,typeof Home])=><button key={label} onClick={()=>{setView(label);setOpen(false)}} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${view===label?"bg-lime text-ink":"text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon className="h-4 w-4"/>{label}{label==="Moj tiket"&&<span className="ml-auto rounded-full bg-white/15 px-2 text-[10px]">2</span>}</button>;
  return <><div onClick={()=>setOpen(false)} className={`fixed inset-0 z-30 bg-black/40 lg:hidden ${open?"block":"hidden"}`}/><aside className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col bg-ink p-5 text-white transition-transform lg:translate-x-0 ${open?"translate-x-0":"-translate-x-full"}`}><div className="flex items-center justify-between"><BrandMark/><button onClick={()=>setOpen(false)} className="lg:hidden"><X/></button></div><div className="mt-8 rounded-2xl bg-white/5 p-3"><div className="flex items-center gap-2 text-[11px] font-bold text-lime"><span className="h-2 w-2 animate-pulse rounded-full bg-lime"/>DEMO REŽIM</div><p className="mt-1 text-[10px] leading-4 text-slate-400">Prikazani podaci služe za demonstraciju funkcionalnosti.</p></div><nav className="mt-6 space-y-1">{nav.map(link)}</nav><div className="my-4 border-t border-white/10"/><nav className="space-y-1">{secondary.map(link)}</nav><div className="mt-auto rounded-2xl border border-white/10 p-3"><div className="flex items-center gap-2 text-xs font-bold"><ShieldCheck className="h-4 w-4 text-lime"/>Odgovorno klađenje</div><p className="mt-2 text-[10px] leading-4 text-slate-400">Analize su statističke procene i ne garantuju dobitak.</p></div><button className="mt-3 flex items-center gap-2 px-3 py-2 text-xs text-slate-400"><LogOut className="h-4 w-4"/>Odjavi se</button></aside></>;
}

function PickRow({pick,onAdd}:{pick:Pick;onAdd:(p:Pick)=>void}) {
  const match=matches.find(m=>m.id===pick.matchId)!;
  return <div className="grid items-center gap-4 border-b border-slate-100 py-4 last:border-0 md:grid-cols-[1.4fr_1.2fr_.7fr_.7fr_.7fr_auto]">
    <div className="flex items-center gap-3"><div className="flex -space-x-2"><TeamCrest team={match.home} size="sm"/><TeamCrest team={match.away} size="sm"/></div><div><b className="text-xs">{match.home.short} – {match.away.short}</b><p className="text-[10px] text-slate-400">{match.league}</p></div></div>
    <div><p className="text-[10px] font-bold uppercase text-slate-400">{pick.market}</p><b className="text-xs">{pick.selection}</b></div>
    <div><p className="text-[10px] text-slate-400">Kvota</p><b className="text-sm">{pick.odds.toFixed(2)}</b></div>
    <div><p className="text-[10px] text-slate-400">Verovatnoća</p><b className="text-sm">{(pick.probability*100).toFixed(0)}%</b></div>
    <div><p className="text-[10px] text-slate-400">EV</p><b className="text-sm text-emerald-600">+{pick.ev}%</b></div>
    <button onClick={()=>onAdd(pick)} className="focus-ring rounded-lg bg-ink px-3 py-2 text-xs font-bold text-white hover:bg-slate-700"><Plus className="inline h-3 w-3"/> Tiket</button>
  </div>
}

function Dashboard({setView,onOpen,onAdd}:{setView:(v:View)=>void;onOpen:(m:Match)=>void;onAdd:(p:Pick)=>void}) {
  const today=new Date().toISOString().slice(0,10); const featured=matches.filter(m=>m.kickoff.slice(0,10)===today).slice(0,3);
  return <div className="space-y-7">
    <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end"><div><p className="text-sm text-slate-500">Četvrtak, 23. jul</p><h2 className="mt-1 text-2xl font-black md:text-3xl">Dobro veče, Aleksandre.</h2><p className="mt-2 text-sm text-slate-500">Današnji pregled modela i tržišnih prilika.</p></div><button onClick={()=>setView("Utakmice")} className="focus-ring rounded-xl bg-lime px-5 py-3 text-sm font-black text-ink shadow-sm"><Sparkles className="mr-2 inline h-4 w-4"/>Analiziraj utakmicu</button></section>
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><StatCard label="Analizirane utakmice" value="1.284" change="+12 danas" icon={Activity} tone="dark"/><StatCard label="Uspešnost modela" value="64,8%" change="+2,4%" icon={Target}/><StatCard label="ROI modela" value="+11,6%" change="+1,8%" icon={TrendingUp}/><StatCard label="Aktivne analize" value="28" change="6 uskoro" icon={Clock3}/></section>
    <section><div className="mb-4 flex items-center justify-between"><div><h3 className="text-lg font-black">Najzanimljivije danas</h3><p className="text-xs text-slate-400">Utakmice sa najboljim odnosom podataka i vrednosti</p></div><button onClick={()=>setView("Utakmice")} className="text-xs font-bold">Sve utakmice →</button></div><div className="grid gap-4 xl:grid-cols-3">{(featured.length?featured:matches.slice(4,7)).map(m=><MatchCard key={m.id} match={m} onOpen={onOpen}/>)}</div></section>
    <section className="grid gap-5 xl:grid-cols-[1.55fr_.8fr]"><div className="card p-5"><div className="flex items-center justify-between"><div><h3 className="font-black">Predlozi sa najvećom vrednošću</h3><p className="text-xs text-slate-400">Sortirano prema očekivanoj vrednosti</p></div><ListFilter className="h-4 w-4 text-slate-400"/></div><div className="mt-2">{picks.slice().sort((a,b)=>b.ev-a.ev).slice(0,4).map(p=><PickRow key={p.id} pick={p} onAdd={onAdd}/>)}</div></div><div className="card p-5"><div className="flex items-center justify-between"><h3 className="font-black">Učinak modela</h3><span className="text-[10px] text-slate-400">6 meseci</span></div><div className="mt-5 h-52"><ResponsiveContainer width="100%" height="100%"><AreaChart data={modelHistory}><defs><linearGradient id="roi" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#a4d735" stopOpacity=".4"/><stop offset="100%" stopColor="#a4d735" stopOpacity="0"/></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf0f2"/><XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={10}/><YAxis axisLine={false} tickLine={false} fontSize={10}/><Tooltip/><Area type="monotone" dataKey="roi" stroke="#7ba51a" strokeWidth={3} fill="url(#roi)"/></AreaChart></ResponsiveContainer></div><div className="mt-3 grid grid-cols-2 gap-2"><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Dobitni niz</p><b className="text-xl">7</b></div><div className="rounded-xl bg-slate-50 p-3"><p className="text-[10px] text-slate-400">Prosečna kvota</p><b className="text-xl">1,84</b></div></div></div></section>
  </div>
}

function MatchesView({onOpen}:{onOpen:(m:Match)=>void}) {
  const [period,setPeriod]=useState("Danas"); const [search,setSearch]=useState("");
  const filtered=matches.filter(m=>`${m.home.name} ${m.away.name} ${m.league}`.toLowerCase().includes(search.toLowerCase())).slice(0,period==="Sve"?50:12);
  return …6156 tokens truncated…y, league_id bigint not null references public.leagues on delete cascade,
  name text not null, starts_on date, ends_on date, is_current boolean not null default false, unique(league_id,name)
);
create table public.venues (
  id bigint generated always as identity primary key, provider_id text unique, name text not null, city text, capacity integer
);
create table public.teams (
  id bigint generated always as identity primary key, provider_id text unique, country_id bigint references public.countries,
  name text not null, short_name text, logo_url text, venue_id bigint references public.venues, is_active boolean not null default true
);
create table public.matches (
  id bigint generated always as identity primary key, provider_id text unique, league_id bigint not null references public.leagues,
  season_id bigint references public.seasons, venue_id bigint references public.venues, home_team_id bigint not null references public.teams,
  away_team_id bigint not null references public.teams, kickoff_at timestamptz not null, status public.match_status not null default 'scheduled',
  minute smallint, ht_home smallint, ht_away smallint, ft_home smallint, ft_away smallint, et_home smallint, et_away smallint,
  pen_home smallint, pen_away smallint, round text, importance smallint check(importance between 0 and 100), is_demo boolean not null default false,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now(), check(home_team_id <> away_team_id)
);
create index matches_kickoff_idx on public.matches(kickoff_at);
create index matches_league_status_idx on public.matches(league_id,status);

create table public.standings (
  id bigint generated always as identity primary key, season_id bigint not null references public.seasons on delete cascade,
  team_id bigint not null references public.teams, position smallint not null, played smallint default 0, won smallint default 0, drawn smallint default 0,
  lost smallint default 0, goals_for smallint default 0, goals_against smallint default 0, points smallint default 0,
  snapshot_at timestamptz not null default now(), unique(season_id,team_id,snapshot_at)
);
create table public.match_statistics (
  match_id bigint primary key references public.matches on delete cascade, home_possession numeric(5,2), away_possession numeric(5,2),
  home_shots smallint, away_shots smallint, home_shots_on_target smallint, away_shots_on_target smallint,
  home_corners smallint, away_corners smallint, home_cards smallint, away_cards smallint, home_xg numeric(5,2), away_xg numeric(5,2),
  payload jsonb not null default '{}'::jsonb, updated_at timestamptz not null default now()
);
create table public.match_events (
  id bigint generated always as identity primary key, provider_id text unique, match_id bigint not null references public.matches on delete cascade,
  team_id bigint references public.teams, minute smallint, extra_minute smallint, event_type text not null check(event_type in ('goal','card','substitution','var','other')),
  player_name text, detail text, payload jsonb not null default '{}'::jsonb
);
create table public.lineups (
  id bigint generated always as identity primary key, match_id bigint not null references public.matches on delete cascade, team_id bigint not null references public.teams,
  formation text, confirmed boolean not null default false, players jsonb not null default '[]'::jsonb, unique(match_id,team_id)
);
create table public.absences (
  id bigint generated always as identity primary key, match_id bigint references public.matches on delete cascade, team_id bigint not null references public.teams,
  player_name text not null, absence_type text not null check(absence_type in ('injury','suspension','doubtful','other')), reason text, expected_return date
);
create table public.bookmakers (id bigint generated always as identity primary key, name text not null unique, website text);
create table public.markets (id bigint generated always as identity primary key, code text not null unique, name text not null, category text not null, is_active boolean not null default true);
create table public.odds (
  id bigint generated always as identity primary key, match_id bigint not null references public.matches on delete cascade,
  bookmaker_id bigint not null references public.bookmakers, market_id bigint not null references public.markets,
  selection text not null, price numeric(8,3) not null check(price > 1), captured_at timestamptz not null default now(), is_opening boolean not null default false
);
create index odds_history_idx on public.odds(match_id,market_id,selection,captured_at);

create table public.profiles (
  id uuid primary key references auth.users on delete cascade, display_name text, avatar_url text, role text not null default 'user' check(role in ('user','admin')),
  monthly_stake_limit numeric(12,2), spending_warning_percent smallint not null default 75, pause_until timestamptz,
  hide_high_risk boolean not null default false, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.user_favorite_teams (user_id uuid references auth.users on delete cascade, team_id bigint references public.teams on delete cascade, primary key(user_id,team_id));
create table public.user_favorite_leagues (user_id uuid references auth.users on delete cascade, league_id bigint references public.leagues on delete cascade, primary key(user_id,league_id));
create table public.user_favorite_markets (user_id uuid references auth.users on delete cascade, market_id bigint references public.markets on delete cascade, primary key(user_id,market_id));

create table public.analyses (
  id uuid primary key default uuid_generate_v4(), match_id bigint not null references public.matches,
  model_version text not null, data_snapshot jsonb not null, factor_scores jsonb not null, data_quality smallint not null check(data_quality between 0 and 100),
  created_at timestamptz not null default now(), is_demo boolean not null default false
);
create table public.analysis_predictions (
  id uuid primary key default uuid_generate_v4(), analysis_id uuid not null references public.analyses on delete cascade,
  market_id bigint references public.markets, market_code text not null, selection text not null, probability numeric(7,6) not null check(probability > 0 and probability < 1),
  fair_odds numeric(8,3) not null, offered_odds numeric(8,3), expected_value numeric(8,4), risk public.risk_level not null,
  confidence smallint not null check(confidence between 0 and 100), explanation text, result public.outcome_status not null default 'pending',
  settled_at timestamptz
);
create table public.tickets (
  id uuid primary key default uuid_generate_v4(), user_id uuid not null references auth.users on delete cascade, status public.ticket_status not null default 'draft',
  bookmaker_id bigint references public.bookmakers, stake numeric(12,2) check(stake >= 0), total_odds numeric(12,3), possible_payout numeric(12,2),
  actual_payout numeric(12,2), note text, placed_at timestamptz, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.ticket_items (
  id uuid primary key default uuid_generate_v4(), ticket_id uuid not null references public.tickets on delete cascade,
  prediction_id uuid references public.analysis_predictions, match_id bigint not null references public.matches,
  market_code text not null, selection text not null, odds_snapshot numeric(8,3) not null, result public.outcome_status not null default 'pending',
  unique(ticket_id,match_id,market_code,selection)
);
create table public.api_sync_logs (
  id bigint generated always as identity primary key, service text not null, started_at timestamptz not null default now(), finished_at timestamptz,
  status text not null check(status in ('running','success','error')), records_processed integer not null default 0, api_calls integer not null default 0, error_message text
);
create table public.analysis_settings (
  id boolean primary key default true, risk_thresholds jsonb not null, factor_weights jsonb not null, updated_by uuid references auth.users, updated_at timestamptz not null default now(), check(id)
);

alter table public.profiles enable row level security;
alter table public.user_favorite_teams enable row level security;
alter table public.user_favorite_leagues enable row level security;
alter table public.user_favorite_markets enable row level security;
alter table public.tickets enable row level security;
alter table public.ticket_items enable row level security;

create policy "profile_owner_select" on public.profiles for select using (auth.uid()=id);
create policy "profile_owner_update" on public.profiles for update using (auth.uid()=id);
create policy "favorites_team_owner" on public.user_favorite_teams for all using (auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "favorites_league_owner" on public.user_favorite_leagues for all using (auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "favorites_market_owner" on public.user_favorite_markets for all using (auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "ticket_owner" on public.tickets for all using (auth.uid()=user_id) with check(auth.uid()=user_id);
create policy "ticket_item_owner" on public.ticket_items for all using (
  exists(select 1 from public.tickets t where t.id=ticket_id and t.user_id=auth.uid())
) with check (exists(select 1 from public.tickets t where t.id=ticket_id and t.user_id=auth.uid()));

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
begin insert into public.profiles(id,display_name) values(new.id,coalesce(new.raw_user_meta_data->>'display_name','Korisnik')); return new; end; $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();
