"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function SettingsDrawer({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block w-72 shrink-0">
        <div className="sticky top-8 rounded-2xl border border-ink/10 dark:border-cream/10 bg-paper-card dark:bg-charcoal-card p-5">
          <h2 className="font-display text-lg text-ink dark:text-cream mb-4">{t("settings.title")}</h2>
          {children}
        </div>
      </aside>

      {/* Mobile drawer trigger */}
      <div className="lg:hidden fixed bottom-5 right-5 z-30">
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label={t("settings.title")}
          className="rounded-full bg-ink dark:bg-cream text-paper dark:text-charcoal p-4 shadow-lg"
        >
          <SlidersIcon />
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 z-40 flex items-end">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-ink/40 dark:bg-black/60"
          />
          <div className="relative w-full max-h-[85vh] overflow-y-auto rounded-t-2xl bg-paper dark:bg-charcoal p-5 pb-8 animate-popIn">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-lg text-ink dark:text-cream">{t("settings.title")}</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close"
                className="text-ink-soft dark:text-cream/70 text-xl leading-none px-2"
              >
                ×
              </button>
            </div>
            {children}
          </div>
        </div>
      )}
    </>
  );
}

function SlidersIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="4" y1="6" x2="20" y2="6" />
      <line x1="4" y1="12" x2="20" y2="12" />
      <line x1="4" y1="18" x2="20" y2="18" />
      <circle cx="9" cy="6" r="2" fill="currentColor" stroke="none" />
      <circle cx="16" cy="12" r="2" fill="currentColor" stroke="none" />
      <circle cx="7" cy="18" r="2" fill="currentColor" stroke="none" />
    </svg>
  );
}
