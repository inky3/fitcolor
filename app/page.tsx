"use client";

import dynamic from "next/dynamic";

const GeneratorApp = dynamic(() => import("@/components/GeneratorApp"), {
  ssr: false,
  loading: () => <GeneratorSkeleton />,
});

export default function HomePage() {
  return <GeneratorApp />;
}

function GeneratorSkeleton() {
  return (
    <div className="flex flex-col items-center gap-8 pt-4 animate-pulse">
      <div className="h-8 w-64 rounded-full bg-paper-dim dark:bg-charcoal-line" />
      <div className="h-9 w-full max-w-xl rounded-full bg-paper-dim dark:bg-charcoal-line" />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 w-full">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="aspect-[4/5] rounded-2xl bg-paper-dim dark:bg-charcoal-line" />
        ))}
      </div>
      <div className="h-14 w-56 rounded-full bg-paper-dim dark:bg-charcoal-line" />
    </div>
  );
}
