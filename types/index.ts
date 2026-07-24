export type Risk = "Nizak" | "Srednji" | "Visok" | "Izbegavati";
export type MatchStatus = "Uskoro" | "Zakazano" | "Uživo" | "Završeno";

export interface Team { id: string; name: string; short: string; color: string; }
export interface Match {
  id: string; country: string; flag: string; league: string; kickoff: string;
  home: Team; away: Team; homeScore?: number; awayScore?: number; status: MatchStatus;
  stadium: string; odds: { home: number; draw: number; away: number };
  risk: Risk; value: number; xgHome: number; xgAway: number;
}
export interface Pick {
  id: string; matchId: string; market: string; selection: string; odds: number;
  probability: number; fairOdds: number; ev: number; confidence: number; risk: Risk;
  explanation: string; category: "Golovi" | "Ishod" | "Korneri" | "Kartoni";
}
export interface TicketItem { pick: Pick; match: Match; }
