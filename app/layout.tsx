import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans, Fira_Code } from "next/font/google";
import "./globals.css";

const display = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-display"
});
const body = Inter({
  subsets: ["latin"],
  variable: "--font-body"
});
const mono = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono"
});

export const metadata: Metadata = {
  title: "Portfolio — Data & BI Analyst",
  description: "Portfolio Data Analyst / BI Analyst : Power BI, DAX, SQL, Python, Talend, Data Warehousing."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  );
}
