import { expectedValue, fairOdds, riskFrom } from "@/utils/analysis";
export function analyzeMarket(input:{probability:number;odds:number;dataQuality:number}) {
  const probability=Math.max(.01,Math.min(.99,input.probability));
  const ev=expectedValue(probability,input.odds);
  return {probability,fairOdds:fairOdds(probability),ev,risk:riskFrom(probability,input.dataQuality,ev)};
}
