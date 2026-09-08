"use client";

import React from "react";
import { HARMONY_RULES, HarmonyRule } from "@/lib/harmonyEngine";
import { useI18n } from "@/lib/i18n";

interface Props {
  rule: HarmonyRule;
  onChange: (rule: HarmonyRule) => void;
}

export default function HarmonySelector({ rule, onChange }: Props) {
  const { t } = useI18n();

  return (
    <div className="flex flex-wrap items-center justify-center gap-2">
      {HARMONY_RULES.map((r) => (
        <button
          key={r}
          type="button"
          onClick={() => onChange(r)}
          aria-pressed={rule === r}
          className={`font-body text-sm px-4 py-2 rounded-full border transition-colors ${
            rule === r
              ? "bg-ink text-paper dark:bg-cream dark:text-charcoal border-ink dark:border-cream"
              : "border-ink/20 dark:border-cream/20 text-ink-soft dark:text-cream/70 hover:border-ink/40 dark:hover:border-cream/40"
          }`}
        >
          {t(`harmony.${r}`)}
        </button>
      ))}
    </div>
  );
}
