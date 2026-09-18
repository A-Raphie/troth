import type { Metadata, Viewport } from "next";
import { Web3Provider } from "@/context/Web3Provider";
import { Navbar } from "@/components/Navbar";
import "./globals.css";

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Troth - Trustless Milestone Escrow on Arc L1",
  description:
    "Multi-milestone escrow with sub-second USDC release and anti-ghosting protection on Arc Mainnet.",
  keywords: [
    "Arc Network",
    "Circle USDC",
    "Milestone Escrow",
    "Smart Contracts",
    "Freelance Escrow",
    "BFT Finality",
    "Native Gas",
  ],
  authors: [{ name: "Troth Protocol" }],
  creator: "Troth Protocol",
  openGraph: {
    title: "Troth - Trustless Milestone Escrow on Arc L1",
    description:
      "Break work into verifiable milestones. Lock USDC upfront with native gas. Releases in ~350ms.",
    url: "https://trytroth.netlify.app",
    siteName: "Troth",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Troth - Trustless Milestone Escrow on Arc L1",
    description:
      "Sub-second milestone releases with native USDC gas on Arc Layer 1.",
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="overflow-x-hidden max-w-full">
      <body className="min-h-screen flex flex-col antialiased bg-[var(--bg-base)] text-[var(--text-primary)] overflow-x-hidden max-w-full w-full">
        <Web3Provider>
          <Navbar />
          <main className="flex-1 w-full max-w-full overflow-x-hidden">{children}</main>
        </Web3Provider>
      </body>
    </html>
  );
}
