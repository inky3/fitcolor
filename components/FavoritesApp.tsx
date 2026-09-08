"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useI18n } from "@/lib/i18n";
import { findColor } from "@/lib/palette";
import { SLOT_ORDER, SlotKey } from "@/lib/harmonyEngine";
import { FavoriteEntry, loadFavorites, removeFavorite, encodeOutfitToParams } from "@/lib/outfitState";

export default function FavoritesApp() {
  const { t, lang } = useI18n();
  const router = useRouter();
  const [favorites, setFavorites] = useState<FavoriteEntry[] | null>(null);

  useEffect(() => {
    setFavorites(loadFavorites());
  }, []);

  const handleDelete = (id: string) => {
    setFavorites(removeFavorite(id));
  };

  const handleRestore = (entry: FavoriteEntry) => {
    const params = encodeOutfitToParams(entry.outfit);
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className="pt-6 pb-16">
      <header className="text-center max-w-lg mx-auto mb-10">
        <h1 className="font-display text-2xl sm:text-3xl text-ink dark:text-cream">{t("favoritesPage.title")}</h1>
        <p className="font-body text-sm text-ink-soft dark:text-cream/60 mt-2">{t("favoritesPage.subtitle")}</p>
      </header>

      {favorites === null ? null : favorites.length === 0 ? (
        <div className="text-center max-w-sm mx-auto">
          <p className="font-body text-sm text-ink-faint dark:text-cream/50 mb-4">{t("favoritesPage.empty")}</p>
          <Link
            href="/"
            className="inline-block font-body text-sm px-5 py-2.5 rounded-full bg-moss dark:bg-sage text-cream dark:text-charcoal"
          >
            {t("favoritesPage.goGenerate")}
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 max-w-3xl mx-auto">
          {favorites.map((entry) => (
            <div
              key={entry.id}
              className="rounded-2xl border border-ink/10 dark:border-cream/10 bg-paper-card dark:bg-charcoal-card p-4"
            >
              <div className="flex gap-1.5 rounded-xl overflow-hidden mb-3">
                {SLOT_ORDER.map((slot: SlotKey) => {
                  const color = findColor(entry.outfit.colorIds[slot]);
                  return <div key={slot} className="h-16 flex-1" style={{ backgroundColor: color.hex }} title={color.name[lang]} />;
                })}
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body text-sm text-ink dark:text-cream capitalize">
                    {t(`harmony.${entry.outfit.rule}`)}
                  </p>
                  <p className="font-body text-xs text-ink-faint dark:text-cream/40">
                    {t(`styles.${entry.outfit.style}`)} · {t(`occasionsLabel.${entry.outfit.occasion}`)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleRestore(entry)}
                    className="font-body text-xs px-3 py-1.5 rounded-full border border-ink/20 dark:border-cream/20 text-ink-soft dark:text-cream/70 hover:border-ink/40 dark:hover:border-cream/40"
                  >
                    {t("favoritesPage.restore")}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(entry.id)}
                    className="font-body text-xs px-3 py-1.5 rounded-full border border-clay/40 text-clay hover:border-clay"
                  >
                    {t("favoritesPage.delete")}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
