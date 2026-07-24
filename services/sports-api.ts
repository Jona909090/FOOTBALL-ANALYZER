import { matches } from "@/lib/demo-data";
export async function getFixtures(date?: string) {
  if (!process.env.SPORTS_API_KEY) {
    return date ? matches.filter(m=>m.kickoff.startsWith(date)) : matches;
  }
  const response=await fetch(`${process.env.SPORTS_API_BASE_URL}/fixtures?date=${date ?? new Date().toISOString().slice(0,10)}`,{
    headers:{"x-apisports-key":process.env.SPORTS_API_KEY},next:{revalidate:300}
  });
  if(!response.ok) throw new Error("Sportski API trenutno nije dostupan.");
  return response.json();
}
