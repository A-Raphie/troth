"use client";

import React, { useState } from "react";
import { WagmiProvider, createConfig, http } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { injected } from "wagmi/connectors";
import { arcMainnet, arcTestnet } from "@/lib/arc";

export const wagmiConfig = createConfig({
  chains: [arcMainnet, arcTestnet],
  connectors: [injected()],
  transports: {
    [arcMainnet.id]: http(),
    [arcTestnet.id]: http(),
  },
  ssr: true,
});

export function Web3Provider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
