"use client";

import React from "react";
import { SlotKey } from "@/lib/harmonyEngine";
import { PaletteColor } from "@/lib/palette";
import { getContrastText } from "@/lib/colorUtils";
import { SLOT_ICONS } from "@/components/icons/GarmentIcons";
import { useI18n } from "@/lib/i18n";
import { Fit } from "@/lib/outfitState";

interface Props {
  slot: SlotKey;
  color: PaletteColor;
  locked: boolean;
  onToggleLock: () => void;
  fit?: Fit;
  onSetFit?: (fit: Fit) => void;
  flatterBadge?: string | null;
}

export default function OutfitSlot({
  slot,
  color,
  locked,
  onToggleLock,
  fit,
  onSetFit,
  flatterBadge,
}: Props) {
  const { t, lang } = useI18n();

  const Icon = SLOT_ICONS[slot];

  /*
   * Use the actual color from the outfit state.
   *
   * There is intentionally:
   * - no random color
   * - no flicker
   * - no animation
   */
  const textColor = getContrastText(color.hex);

  const hasFit = Boolean(onSetFit && fit);

  return (
    <article
      className="
        w-full
        min-w-0
        overflow-hidden
        rounded-2xl
        border
        border-ink/10
        dark:border-cream/10
        bg-paper-card
        dark:bg-charcoal-card
        shadow-sm
      "
    >
      {/* ==================================================
          COLOR PANEL
      ================================================== */}

      <div
        className="
          relative
          w-full
          aspect-[4/5]
          p-4
          sm:p-5
          flex
          flex-col
        "
        style={{
          backgroundColor: color.hex,
          color: textColor,
        }}
      >
        {/* ==================================================
            TOP ROW
        ================================================== */}

        <div className="flex items-start justify-between gap-2">
          <span
            className="
              min-w-0
              flex-1
              font-body
              text-xs
              sm:text-sm
              uppercase
              tracking-wide
              truncate
            "
            style={{
              opacity: 0.8,
            }}
          >
            {t(`slots.${slot}`)}
          </span>

          {/* Lock button */}

          <button
            type="button"
            onClick={onToggleLock}
            aria-pressed={locked}
            aria-label={
              locked
                ? t("unlock")
                : t("lock")
            }
            className="
              shrink-0
              w-10
              h-10
              sm:w-11
              sm:h-11
              rounded-full
              border
              flex
              items-center
              justify-center
              hover:opacity-100
            "
            style={{
              borderColor: textColor,
              color: textColor,
              opacity: locked ? 1 : 0.65,
              backgroundColor: locked
                ? textColor === "#22201B"
                  ? "rgba(34,32,27,0.12)"
                  : "rgba(245,241,232,0.18)"
                : "transparent",
            }}
          >
            {locked ? (
              <LockClosedIcon />
            ) : (
              <LockOpenIcon />
            )}
          </button>
        </div>

        {/* ==================================================
            GARMENT ICON
        ================================================== */}

        <div className="flex-1 flex items-center justify-center">
          <Icon
            className="
              w-12
              h-12
              sm:w-14
              sm:h-14
            "
            style={{
              color: textColor,
              opacity: 0.9,
            }}
          />
        </div>

        {/* ==================================================
            COLOR INFORMATION
        ================================================== */}

        <div className="min-w-0">
          {/* -----------------------------------------------
              COLOR NAME

              Explicitly 14px.
              No text-lg / text-xl / text-2xl.
          ----------------------------------------------- */}

          <div
            className="
              h-[56px]
              flex
              items-start
            "
          >
            <p
              className="
                font-display
                text-[14px]
                leading-[1.25]
                line-clamp-2
                overflow-hidden
              "
            >
              {color.name[lang] ??
                color.name.en}
            </p>
          </div>

          {/* -----------------------------------------------
              HEX COLOR
          ----------------------------------------------- */}

          <p
            className="
              font-body
              text-xs
              tracking-wide
              opacity-75
            "
          >
            {color.hex}
          </p>
        </div>

        {/* ==================================================
            UNDERTONE BADGE
        ================================================== */}

        {flatterBadge && (
          <span
            className="
              absolute
              bottom-3
              right-3
              max-w-[80%]
              px-2
              py-1
              rounded-full
              text-[9px]
              font-body
              truncate
              backdrop-blur-sm
            "
            style={{
              color: textColor,
              backgroundColor:
                textColor === "#22201B"
                  ? "rgba(255,255,255,0.35)"
                  : "rgba(0,0,0,0.25)",
            }}
          >
            {flatterBadge}
          </span>
        )}
      </div>

      {/* ==================================================
          FIT CONTROL

          Always the same height.
          Shoes/accessory have an empty area.
      ================================================== */}

      <div
        className="
          h-16
          w-full
          shrink-0
          flex
          items-center
          justify-center
          px-2
          bg-paper
          dark:bg-charcoal
        "
      >
        {hasFit && (
          <div
            className="
              w-full
              grid
              grid-cols-2
              gap-1
            "
          >
            {(
              ["fitted", "loose"] as Fit[]
            ).map((option) => {
              const active =
                fit === option;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() =>
                    onSetFit?.(option)
                  }
                  className={`
                    w-full
                    min-w-0
                    rounded-full
                    px-2
                    py-2
                    font-body
                    text-xs
                    whitespace-nowrap
                    ${
                      active
                        ? "bg-moss text-cream dark:bg-sage dark:text-charcoal"
                        : "text-ink-soft dark:text-cream/70 hover:bg-ink/5 dark:hover:bg-cream/10"
                    }
                  `}
                >
                  {t(
                    `fit.${option}`
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </article>
  );
}

/* ==========================================================
   LOCK ICONS
========================================================== */

function LockClosedIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function LockOpenIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 0 1 8-4 4 4 0 0 1 4 4v1" />
    </svg>
  );
}