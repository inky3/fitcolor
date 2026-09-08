"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { HARMONY_RULES } from "@/lib/harmonyEngine";

export default function HowItWorksApp() {
  const { t } = useI18n();

  return (
    <div className="pt-6 pb-16 max-w-2xl mx-auto">
      <header className="text-center mb-10">
        <h1 className="font-display text-2xl sm:text-3xl text-ink dark:text-cream">{t("howItWorksPage.title")}</h1>
        <p className="font-body text-sm text-ink-soft dark:text-cream/60 mt-2">{t("howItWorksPage.subtitle")}</p>
      </header>

      <section className="mb-10 rounded-2xl border border-moss/30 dark:border-sage/30 bg-moss/5 dark:bg-sage/10 p-5">
        <h2 className="font-display text-lg text-ink dark:text-cream mb-2">{t("howItWorksPage.honestyTitle")}</h2>
        <p className="font-body text-sm text-ink-soft dark:text-cream/70 leading-relaxed">
          {t("howItWorksPage.honestyBody")}
        </p>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-lg text-ink dark:text-cream mb-3">{t("howItWorksPage.harmonyTitle")}</h2>
        <div className="space-y-3">
          {HARMONY_RULES.map((rule) => (
            <div key={rule} className="rounded-xl bg-paper-card dark:bg-charcoal-card border border-ink/10 dark:border-cream/10 p-4">
              <p className="font-body text-sm font-semibold text-ink dark:text-cream mb-1">{t(`harmony.${rule}`)}</p>
              <p className="font-body text-sm text-ink-soft dark:text-cream/60">{t(`showYourWork.${rule}`)}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mb-10">
        <h2 className="font-display text-lg text-ink dark:text-cream mb-3">{t("howItWorksPage.ratioTitle")}</h2>
        <ul className="space-y-2 font-body text-sm text-ink-soft dark:text-cream/70 leading-relaxed list-disc pl-5">
          <li>{t("howItWorksPage.ratio6030101")}</li>
          <li>{t("howItWorksPage.ratio5050")}</li>
        </ul>
      </section>

      <section>
        <h2 className="font-display text-lg text-ink dark:text-cream mb-3">{t("howItWorksPage.undertoneTitle")}</h2>
        <p className="font-body text-sm text-ink-soft dark:text-cream/70 leading-relaxed">
          {t("howItWorksPage.undertoneBody")}
        </p>
      </section>
    </div>
  );
}
