"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";

interface Props {
  saved: boolean;
  onToggle: () => void;
}

export default function FavoriteButton({ saved, onToggle }: Props) {
  const { t } = useI18n();
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={saved}
      className={`flex items-center gap-2 font-body text-sm px-4 py-2.5 rounded-full border transition-colors ${
        saved
          ? "bg-clay/10 border-clay text-clay dark:bg-clay/20"
          : "border-ink/20 dark:border-cream/20 text-ink-soft dark:text-cream/70 hover:border-ink/40 dark:hover:border-cream/40"
      }`}
    >
      <HeartIcon filled={saved} />
      {saved ? t("favorite.saved") : t("favorite.save")}
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2">
      <path d="M12 21s-7.5-4.6-10-9.3C0.3 8.1 2 4.5 5.6 4.1c2-.2 3.6.8 4.9 2.4C11.4 4.9 13 3.9 15 4.1c3.6.4 5.3 4 3.6 7.6C19.5 16.4 12 21 12 21z" />
    </svg>
  );
}
