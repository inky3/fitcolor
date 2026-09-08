"use client";

import React from "react";
import OutfitSlot from "./OutfitSlot";

import {
  SlotKey,
  SLOT_ORDER,
} from "@/lib/harmonyEngine";

import {
  PaletteColor,
  Undertone,
} from "@/lib/palette";

import {
  OutfitState,
  Fit,
} from "@/lib/outfitState";

import { useI18n } from "@/lib/i18n";

interface Props {
  colors: Record<
    SlotKey,
    PaletteColor
  >;

  state: OutfitState;

  onToggleLock: (
    slot: SlotKey
  ) => void;

  onSetFit: (
    slot: SlotKey,
    fit: Fit
  ) => void;
}

/*
 * Slots that support the
 * Fitted / Loose selector.
 */
const FIT_SLOTS: SlotKey[] = [
  "top",
  "bottom",
  "outerwear",
];

export default function OutfitRow({
  colors,
  state,
  onToggleLock,
  onSetFit,
}: Props) {
  const { t } = useI18n();

  return (
    <div
      className="
        w-full
        flex
        flex-wrap
        justify-center
        items-start
        gap-3
        sm:gap-4
      "
    >
      {SLOT_ORDER.map((slot) => {
        const color = colors[slot];

        const supportsFit =
          FIT_SLOTS.includes(slot);

        const flatterBadge =
          getFlatterBadge(
            color,
            state.undertone,
            t
          );

        return (
          <div
            key={slot}
            className="
              w-[calc(50%-6px)]
              sm:w-[calc(33.333%-11px)]
              lg:flex-1
              lg:w-auto
              lg:min-w-0
            "
          >
            <OutfitSlot
              slot={slot}
              color={color}
              locked={
                state.locks[slot]
              }
              onToggleLock={() =>
                onToggleLock(slot)
              }
              fit={
                supportsFit
                  ? state.fits[slot] ??
                    "fitted"
                  : undefined
              }
              onSetFit={
                supportsFit
                  ? (fit) =>
                      onSetFit(
                        slot,
                        fit
                      )
                  : undefined
              }
              flatterBadge={
                flatterBadge
              }
            />
          </div>
        );
      })}
    </div>
  );
}

/*
 * ==========================================================
 * UNDERTONE / FLATTER BADGE
 * ==========================================================
 */

function getFlatterBadge(
  color: PaletteColor,
  undertone: Undertone | null,
  t: (
    path: string,
    vars?: Record<string, string>
  ) => string
): string | null {
  /*
   * If the user hasn't selected
   * an undertone, don't show anything.
   */
  if (!undertone) {
    return null;
  }

  /*
   * Show the badge when the color
   * matches the selected undertone.
   */
  if (
    color.undertone ===
    undertone
  ) {
    return t(
      "flatterBadge.strongMatch",
      {
        undertone: t(
          `settings.${undertone}`
        ).toLowerCase(),
      }
    );
  }

  return null;
}