import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: { colors: { ink: "#111b2e", lime: "#c8f55a", canvas: "#f4f6f8" } } },
  plugins: [],
} satisfies Config;
