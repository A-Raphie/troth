import type { Metadata } from "next";
import { ThemeProvider } from "@/context/ThemeContext";
import { Web3Provider } from "@/context/Web3Provider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Troth — Trustless Milestone Escrow on Arc L1",
  description:
    "Multi-milestone escrow with sub-second USDC release and anti-ghosting protection on Arc Mainnet.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <Web3Provider>
          <ThemeProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
          </ThemeProvider>
        </Web3Provider>
      </body>
    </html>
  );
}
