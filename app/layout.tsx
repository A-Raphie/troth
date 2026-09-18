import type { Metadata } from "next";
import { Web3Provider } from "@/context/Web3Provider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Troth — Trustless Milestone Escrow on Arc L1",
  description:
    "Multi-milestone escrow with sub-second USDC release and anti-ghosting protection on Arc Mainnet.",
  icons: {
    icon: [],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Prevent favicon 404s */}
        <link rel="icon" href="data:," />
      </head>
      <body className="min-h-screen flex flex-col antialiased bg-[var(--bg-base)] text-[var(--text-primary)]">
        <Web3Provider>
          <Navbar />
          <main className="flex-1">{children}</main>
        </Web3Provider>
      </body>
    </html>
  );
}
