"use client";

import React from "react";
import { useI18n } from "@/lib/i18n";
import { STYLES, StyleId } from "@/lib/styles";
import { OCCASIONS, OccasionId } from "@/lib/occasions";
import { Undertone, Season } from "@/lib/palette";
import { OutfitState } from "@/lib/outfitState";
import { SlotKey } from "@/lib/harmonyEngine";
import { WardrobeItem } from "@/lib/wardrobe";
import WardrobePanel from "./WardrobePanel";

interface Props {
  state: OutfitState;
  onUndertone: (u: Undertone | null) => void;
  onSeason: (s: Season | null) => void;
  onStyle: (s: StyleId) => void;
  onBlendStyle: (s: StyleId | null) => void;
  onBlendMix: (m: number) => void;
  onOccasion: (o: OccasionId) => void;
  soundOn: boolean;
  onSoundToggle: () => void;
  wardrobe: WardrobeItem[];
  useWardrobeColors: boolean;
  onAddWardrobeItem: (item: { slot: SlotKey; hex: string; garmentType?: string }) => void;
  onRemoveWardrobeItem: (id: string) => void;
  onToggleUseWardrobe: () => void;
}

const UNDERTONES: Undertone[] = ["warm", "cool", "neutral"];
const SEASONS: Season[] = ["spring", "summer", "autumn", "winter"];

export default function SettingsPanel({
  state,
  onUndertone,
  onSeason,
  onStyle,
  onBlendStyle,
  onBlendMix,
  onOccasion,
  soundOn,
  onSoundToggle,
  wardrobe,
  useWardrobeColors,
  onAddWardrobeItem,
  onRemoveWardrobeItem,
  onToggleUseWardrobe,
}: Props) {
  const { t } = useI18n();

  return (
    <div className="space-y-7">
      <section>
        <h3 className="font-body text-xs uppercase tracking-wide text-ink-faint dark:text-cream/50 mb-2">
          {t("settings.undertone")}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Chip active={state.undertone === null} onClick={() => onUndertone(null)}>
            {t("settings.seasonNone")}
          </Chip>
          {UNDERTONES.map((u) => (
            <Chip key={u} active={state.undertone === u} onClick={() => onUndertone(u)}>
              {t(`settings.${u}`)}
            </Chip>
          ))}
        </div>
        <p className="font-body text-[11px] text-ink-faint dark:text-cream/40 mt-2 italic">
          {t("settings.photoComingSoon")}
        </p>
      </section>

      <section>
        <h3 className="font-body text-xs uppercase tracking-wide text-ink-faint dark:text-cream/50 mb-2">
          {t("settings.season")}
        </h3>
        <div className="flex flex-wrap gap-2">
          <Chip active={state.season === null} onClick={() => onSeason(null)}>
            {t("settings.seasonNone")}
          </Chip>
          {SEASONS.map((s) => (
            <Chip key={s} active={state.season === s} onClick={() => onSeason(s)}>
              {t(`settings.${s}`)}
            </Chip>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-body text-xs uppercase tracking-wide text-ink-faint dark:text-cream/50 mb-2">
          {t("settings.style")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {STYLES.map((s) => (
            <Chip key={s.id} active={state.style === s.id} onClick={() => onStyle(s.id)}>
              {t(`styles.${s.id}`)}
            </Chip>
          ))}
        </div>

        <div className="mt-3">
          <label className="font-body text-[11px] text-ink-faint dark:text-cream/40 block mb-1">
            {t("settings.blend")}
          </label>
          <select
            value={state.blendStyle ?? ""}
            onChange={(e) => onBlendStyle((e.target.value || null) as StyleId | null)}
            className="w-full rounded-lg border border-ink/15 dark:border-cream/15 bg-paper dark:bg-charcoal text-ink dark:text-cream font-body text-sm px-3 py-2"
          >
            <option value="">{t("settings.seasonNone")}</option>
            {STYLES.filter((s) => s.id !== state.style).map((s) => (
              <option key={s.id} value={s.id}>
                {t(`styles.${s.id}`)}
              </option>
            ))}
          </select>
          {state.blendStyle && (
            <input
              type="range"
              min={0}
              max={1}
              step={0.1}
              value={state.blendMix}
              onChange={(e) => onBlendMix(Number(e.target.value))}
              className="w-full mt-2 accent-moss dark:accent-sage"
            />
          )}
        </div>
      </section>

      <section>
        <h3 className="font-body text-xs uppercase tracking-wide text-ink-faint dark:text-cream/50 mb-2">
          {t("settings.occasion")}
        </h3>
        <div className="flex flex-wrap gap-2">
          {OCCASIONS.map((o) => (
            <Chip key={o.id} active={state.occasion === o.id} onClick={() => onOccasion(o.id)}>
              {t(`occasionsLabel.${o.id}`)}
            </Chip>
          ))}
        </div>
      </section>

      <WardrobePanel
        items={wardrobe}
        useWardrobe={useWardrobeColors}
        onAdd={onAddWardrobeItem}
        onRemove={onRemoveWardrobeItem}
        onToggleUse={onToggleUseWardrobe}
      />

      <section className="flex items-center justify-between pt-2 border-t border-ink/10 dark:border-cream/10">
        <span className="font-body text-sm text-ink-soft dark:text-cream/70">{t("settings.sound")}</span>
        <Toggle checked={soundOn} onChange={onSoundToggle} />
      </section>

      <p className="font-body text-xs leading-relaxed text-ink-faint dark:text-cream/45 pt-1">
        {t("honesty.coherence")}
      </p>
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`font-body text-xs px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-moss text-cream dark:bg-sage dark:text-charcoal border-moss dark:border-sage"
          : "border-ink/15 dark:border-cream/15 text-ink-soft dark:text-cream/70 hover:border-ink/35 dark:hover:border-cream/35"
      }`}
    >
      {children}
    </button>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className={`w-10 h-6 rounded-full relative transition-colors ${
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
