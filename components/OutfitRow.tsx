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
 * These are the garment slots that support
 * the Fitted / Loose selector.
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
        /*
         * Undertone guidance badge.
         */
        const flatterBadge =
          getFlatterBadge(
            colors[slot],
            state.undertone,
            t
          );

        /*
         * Only Top, Bottom and Outerwear
         * have Fitted / Loose controls.
         */
        const supportsFit =
          FIT_SLOTS.includes(slot);

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
              color={colors[slot]}
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
 * UNDERTONE BADGE
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
   * No undertone selected:
   * don't show a badge.
   */
  if (!undertone) {
    return null;
  }

  /*
   * Exact undertone match:
   * show the flattering badge.
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