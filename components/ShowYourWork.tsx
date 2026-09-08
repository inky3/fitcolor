"use client";

import React from "react";
import { HarmonyRule } from "@/lib/harmonyEngine";
import { useI18n } from "@/lib/i18n";

export default function ShowYourWork({ rule }: { rule: HarmonyRule }) {
  const { t } = useI18n();

  return (
    <div className="max-w-xl mx-auto text-center px-4">
      <p className="font-display text-base sm:text-lg text-ink dark:text-cream leading-relaxed">
        {t(`showYourWork.${rule}`)}
      </p>
    </div>
  );
}
