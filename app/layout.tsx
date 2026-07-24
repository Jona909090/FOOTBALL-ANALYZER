import type { Metadata } from "next";
import "./globals.css";
import { PwaRegister } from "@/components/pwa-register";

export const metadata: Metadata = {
  title: "FOOTBALL ANALYZER",
  manifest: "/manifest.webmanifest",
  themeColor: "#101a2e",
  appleWebApp: { capable: true, title: "Football Analyzer", statusBarStyle: "black-translucent" },
  icons: { icon: "/app-icon.svg", apple: "/app-icon.svg" },
  description: "Statistička analiza fudbalskih utakmica i odgovorno sportsko klađenje.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="sr"><body><PwaRegister/>{children}</body></html>;
}
