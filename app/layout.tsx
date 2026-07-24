import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FOOTBALL ANALYZER",
  description: "Statistička analiza fudbalskih utakmica i odgovorno sportsko klađenje.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sr"><body>{children}</body></html>;
}
