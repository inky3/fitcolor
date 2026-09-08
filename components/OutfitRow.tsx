"use client";

import React from "react";
import OutfitSlot from "./OutfitSlot";
import { SlotKey, SLOT_ORDER } from "@/lib/harmonyEngine";
import { PaletteColor, Undertone } from "@/lib/palette";
import { OutfitState, Fit } from "@/lib/outfitState";
import { useI18n } from "@/lib/i18n";

interface Props {
  colors: Record<SlotKey, PaletteColor>;
  state: OutfitState;
  rerollTrigger: number;
  onToggleLock: (slot: SlotKey) => void;
  onSetFit: (slot: SlotKey, fit: Fit) => void;
}

const FIT_SLOTS: SlotKey[] = ["top", "bottom", "outerwear"];

export default function OutfitRow({ colors, state, rerollTrigger, onToggleLock, onSetFit }: Props) {
  const { t } = useI18n();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 w-full">
      {SLOT_ORDER.map((slot) => {
        const flatterBadge = getFlatterBadge(colors[slot], state.undertone, t);
        return (
          <OutfitSlot
            key={slot}
            slot={slot}
            color={colors[slot]}
            locked={state.locks[slot]}
            onToggleLock={() => onToggleLock(slot)}
            rerollTrigger={rerollTrigger}
            fit={FIT_SLOTS.includes(slot) ? state.fits[slot] ?? "fitted" : undefined}
            onSetFit={FIT_SLOTS.includes(slot) ? (fit) => onSetFit(slot, fit) : undefined}
            flatterBadge={flatterBadge}
          />
        );
      })}
    </div>
  );
}

function getFlatterBadge(
  color: PaletteColor,
  undertone: Undertone | null,
  t: (path: string, vars?: Record<string, string>) => string
): string | null {
  if (!undertone) return null;
  if (color.undertone === undertone) {
    return t("flatterBadge.strongMatch", { undertone: t(`settings.${undertone}`).toLowerCase() });
  }
  return null;
}
