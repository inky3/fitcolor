"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";

export default function ShareButton({ getUrl }: { getUrl: () => string }) {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const url = getUrl();
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API may be unavailable; the URL is already reflected in the
      // address bar, so this is a soft failure.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex items-center gap-2 font-body text-sm px-4 py-2.5 rounded-full border border-ink/20 dark:border-cream/20 text-ink-soft dark:text-cream/70 hover:border-ink/40 dark:hover:border-cream/40 transition-colors"
    >
      <ShareIcon />
      {copied ? t("share.copied") : t("share.copy")}
    </button>
  );
}

function ShareIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" />
      <circle cx="6" cy="12" r="3" />
      <circle cx="18" cy="19" r="3" />
      <line x1="8.6" y1="10.5" x2="15.4" y2="6.5" />
      <line x1="8.6" y1="13.5" x2="15.4" y2="17.5" />
    </svg>
  );
}
