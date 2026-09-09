"use client";

import React, { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { SlotKey, SLOT_ORDER } from "@/lib/harmonyEngine";
import { WardrobeItem } from "@/lib/wardrobe";

interface Props {
  items: WardrobeItem[];
  useWardrobe: boolean;
  onAdd: (item: { slot: SlotKey; hex: string; garmentType?: string }) => void;
  onRemove: (id: string) => void;
  onToggleUse: () => void;
}

export default function WardrobePanel({ items, useWardrobe, onAdd, onRemove, onToggleUse }: Props) {
  const { t } = useI18n();
  const [slot, setSlot] = useState<SlotKey>("top");
  const [hex, setHex] = useState("#4A6B8A");
  const [garmentType, setGarmentType] = useState("");

  const handleAdd = () => {
    onAdd({ slot, hex, garmentType: garmentType.trim() || undefined });
    setGarmentType("");
  };

  return (
    <section className="pt-2 border-t border-ink/10 dark:border-cream/10">
      <div className="flex items-center justify-between mb-2 gap-3">
        <h3 className="font-body text-xs uppercase tracking-wide text-ink-faint dark:text-cream/50">
          {t("wardrobe.title")}
        </h3>
        <Toggle checked={useWardrobe} onChange={onToggleUse} label={t("wardrobe.useToggle")} />
      </div>
      <p className="font-body text-[11px] text-ink-faint dark:text-cream/40 mb-3 leading-relaxed">
        {t("wardrobe.hint")}
      </p>

      <div className="flex flex-wrap items-center gap-2 mb-3">
        <select
          value={slot}
          onChange={(e) => setSlot(e.target.value as SlotKey)}
          className="rounded-lg border border-ink/15 dark:border-cream/15 bg-paper dark:bg-charcoal text-ink dark:text-cream font-body text-xs px-2 py-1.5"
        >
          {SLOT_ORDER.map((s) => (
            <option key={s} value={s}>
              {t(`slots.${s}`)}
            </option>
          ))}
        </select>
        <input
          type="color"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          aria-label={t("wardrobe.colorLabel")}
          className="w-9 h-8 rounded-md border border-ink/15 dark:border-cream/15 bg-transparent cursor-pointer p-0.5"
        />
        <input
          type="text"
          value={garmentType}
          onChange={(e) => setGarmentType(e.target.value)}
          placeholder={t("wardrobe.garmentPlaceholder")}
          className="flex-1 min-w-[110px] rounded-lg border border-ink/15 dark:border-cream/15 bg-paper dark:bg-charcoal text-ink dark:text-cream font-body text-xs px-2 py-1.5"
        />
        <button
          type="button"
          onClick={handleAdd}
          className="rounded-lg bg-moss dark:bg-sage text-cream dark:text-charcoal font-body text-xs px-3 py-1.5 shrink-0"
        >
          {t("wardrobe.add")}
        </button>
      </div>

      {items.length === 0 ? (
        <p className="font-body text-[11px] text-ink-faint dark:text-cream/40 italic">{t("wardrobe.empty")}</p>
      ) : (
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {items.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-xs font-body">
              <span
                className="w-4 h-4 rounded-full border border-ink/15 dark:border-cream/15 shrink-0"
                style={{ backgroundColor: item.hex }}
              />
              <span className="text-ink-soft dark:text-cream/70">{t(`slots.${item.slot}`)}</span>
              {item.garmentType && (
                <span className="text-ink-faint dark:text-cream/40 truncate">· {item.garmentType}</span>
              )}
              <button
                type="button"
                onClick={() => onRemove(item.id)}
                aria-label={t("wardrobe.remove")}
                className="ml-auto text-ink-faint dark:text-cream/40 hover:text-ink dark:hover:text-cream text-sm leading-none px-1"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: () => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={onChange}
      className={`w-10 h-6 rounded-full relative transition-colors shrink-0 ${
        checked ? "bg-moss dark:bg-sage" : "bg-ink/15 dark:bg-cream/15"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-paper-card dark:bg-charcoal-card shadow transition-transform ${
          checked ? "translate-x-4" : "translate-x-0"
        }`}
      />
    </button>
  );
}
