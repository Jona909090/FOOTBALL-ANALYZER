import type { Match, Pick, Team } from "@/types";
import { expectedValue, fairOdds, riskFrom } from "@/utils/analysis";

const teams: Team[] = [
  ["ars","Arsenal","ARS","#e30613"],["mci","Manchester City","MCI","#6cabdd"],
  ["liv","Liverpool","LIV","#c8102e"],["che","Chelsea","CHE","#034694"],
  ["rma","Real Madrid","RMA","#d6b646"],["bar","Barcelona","BAR","#a50044"],
  ["atm","Atlético Madrid","ATM","#cb3524"],["sev","Sevilla","SEV","#d71920"],
  ["int","Inter","INT","#0068a8"],["mil","Milan","MIL","#fb090b"],
  ["juv","Juventus","JUV","#111111"],["nap","Napoli","NAP","#12a0d7"],
  ["bay","Bayern","BAY","#dc052d"],["bvb","Dortmund","BVB","#fdeb06"],
  ["lev","Leverkusen","LEV","#e32221"],["lei","Leipzig","RBL","#dd0741"],
  ["psg","Paris SG","PSG","#004170"],["mar","Marseille","OM","#2faee0"],
  ["lyo","Lyon","LYO","#1f3c90"],["mon","Monaco","ASM","#e51b2b"],
  ["din","Dinamo Zagreb","DIN","#0057b8"],["haj","Hajduk Split","HAJ","#164194"],
  ["rij","Rijeka","RIJ","#6fb7e9"],["osi","Osijek","OSI","#1d4f91"],
  ["zve","Crvena zvezda","CZV","#d71920"],["par","Partizan","PAR","#222222"],
  ["tsc","TSC Bačka Topola","TSC","#325ea8"],["voj","Vojvodina","VOJ","#d71920"],
  ["ben","Benfica","BEN","#e83030"],["por","Porto","POR","#004b98"],
].map(([id,name,short,color]) => ({ id, name, short, color }));

const leaguePairs = [
  ["🇬🇧","Engleska","Premier League"],["🇪🇸","Španija","LaLiga"],["🇮🇹","Italija","Serie A"],
  ["🇩🇪","Nemačka","Bundesliga"],["🇫🇷","Francuska","Ligue 1"],["🇭🇷","Hrvatska","HNL"],
  ["🇷🇸","Srbija","SuperLiga"],["🇵🇹","Portugal","Primeira Liga"],["🇳🇱","Holandija","Eredivisie"],
  ["🇧🇪","Belgija","Pro League"]
];
const day = 86400000;
const base = new Date(); base.setHours(0,0,0,0);
export const matches: Match[] = Array.from({ length: 50 }, (_, i) => {
  const home = teams[(i * 2) % teams.length]; const away = teams[(i * 2 + 7) % teams.length];
  const [flag,country,league] = leaguePairs[i % leaguePairs.length];
  const offset = (i % 9) - 4; const hour = 13 + (i * 2) % 9;
  const kickoff = new Date(base.getTime() + offset * day + hour * 3600000 + (i%2)*1800000);
  const done = offset < 0; const soon = offset === 0 && i % 3 === 0;
  return {
    id:`m${i+1}`, flag, country, league, kickoff:kickoff.toISOString(), home, away,
    status: done ? "Završeno" : soon ? "Uskoro" : "Zakazano",
    homeScore: done ? (i*7)%4 : undefined, awayScore: done ? (i*5)%3 : undefined,
    stadium:`${home.name} Arena`, odds:{home:1.62+(i%7)*.13,draw:3.2+(i%5)*.18,away:2.1+(i%9)*.24},
    risk: i%4===0?"Nizak":i%4===1?"Srednji":i%4===2?"Visok":"Srednji",
    value: 4.8+(i%8)*1.7, xgHome:1.15+(i%7)*.13, xgAway:.74+(i%6)*.12
  };
});

const markets = [
  ["Golovi","Više od 1,5 gola"],["Ishod","Domaćin DNB"],["Golovi","Oba tima daju gol"],
  ["Korneri","Više od 8,5 kornera"],["Kartoni","Više od 3,5 kartona"]
] as const;
export const picks: Pick[] = matches.slice(0,24).map((match, i) => {
  const probability=.54+(i%8)*.035; const odds=1.58+(i%6)*.11; const confidence=58+(i%7)*5;
  const ev=expectedValue(probability,odds); const [category,selection]=markets[i%markets.length];
  return {
    id:`p${i+1}`,matchId:match.id,market:category,selection,odds,
    probability,fairOdds:fairOdds(probability),ev,confidence,
    risk:riskFrom(probability,confidence,ev),category,
    explanation:`Model koristi formu u poslednjih 10 utakmica, učinak domaćina i gosta i tržišnu kvotu. Procena se zasniva na dostupnim demonstracionim podacima; izostanci nisu potvrđeni.`
  };
});

export const modelHistory = [
  { month:"Feb", roi:4.1, success:58 },{ month:"Mar", roi:6.8, success:61 },
  { month:"Apr", roi:5.4, success:59 },{ month:"Maj", roi:9.2, success:64 },
  { month:"Jun", roi:7.8, success:62 },{ month:"Jul", roi:11.6, success:66 },
];

export const demoStats = { countries:5, leagues:10, teams:30, matches:50, analyses:24 };
