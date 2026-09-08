"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";

export default function LangToggle() {
  const { lang, setLang } = useI18n();

  return (
    <div className="flex items-center rounded-full border border-ink/15 dark:border-cream/15 p-0.5 text-xs font-body">
      {(["en", "th"] as const).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`px-2.5 py-1 rounded-full transition-colors ${
            lang === l
              ? "bg-ink text-paper dark:bg-cream dark:text-charcoal"
              : "text-ink-soft dark:text-cream/60"
          }`}
        >
          {l === "en" ? "EN" : "TH"}
        </button>
      ))}
    </div>
  );
}
