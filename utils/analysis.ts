import type { Risk } from "@/types";

export const fairOdds = (probability: number) => Number((1 / probability).toFixed(2));
export const expectedValue = (probability: number, odds: number) =>
  Number(((probability * odds - 1) * 100).toFixed(1));
export const riskFrom = (probability: number, confidence: number, ev: number): Risk => {
  if (confidence < 45 || ev < 0) return "Izbegavati";
  if (probability >= .68 && confidence >= 75) return "Nizak";
  if (probability >= .52 && confidence >= 60) return "Srednji";
  return "Visok";
};
