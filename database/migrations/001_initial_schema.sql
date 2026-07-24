-- FOOTBALL ANALYZER: osnovna šema, PostgreSQL / Supabase
create extension if not exists "uuid-ossp";

create type public.match_status as enum ('scheduled','live','finished','postponed','cancelled');
create type public.risk_level as enum ('low','medium','high','avoid');
create type public.outcome_status as enum ('pending','won','lost','void');
create type public.ticket_status as enum ('draft','placed','won','lost','void');

create table public.countries (
  id bigint generated always as identity primary key, name text not null unique, code text not null unique, flag_url text, is_active boolean not null default true
);
create table public.leagues (
  id bigint generated always as identity primary key, provider_id text unique, country_id bigint references public.countries on delete set null,
  name text not null, logo_url text, quality_score smallint not null default 70 check (quality_score between 0 and 100), is_active boolean not null default true
);
create table public.seasons (
  id bigint generated always as identity primary key, league_id bigint not null references public.leagues on delete cascade,
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

