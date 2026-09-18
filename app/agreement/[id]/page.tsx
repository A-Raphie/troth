import React, { Suspense } from "react";
import AgreementDetailClient from "@/components/AgreementDetailClient";

export function generateStaticParams() {
  return [
    { id: "104" },
    { id: "105" },
    { id: "demo-1" },
    { id: "1" },
    { id: "2" },
  ];
}

export default function AgreementPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-4xl mx-auto p-12 text-center text-xs font-mono text-[var(--text-muted)]">
          Loading agreement details...
        </div>
      }
    >
      <AgreementDetailClient />
    </Suspense>
  );
}
