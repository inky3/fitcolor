"use client";

import React, { useEffect, useRef, useState } from "react";
import { SlotKey } from "@/lib/harmonyEngine";
import { PaletteColor, PALETTE } from "@/lib/palette";
import { getContrastText } from "@/lib/colorUtils";
import { SLOT_ICONS } from "@/components/icons/GarmentIcons";
import { useI18n } from "@/lib/i18n";
import { Fit } from "@/lib/outfitState";

interface Props {
  slot: SlotKey;
  color: PaletteColor;
  locked: boolean;
  onToggleLock: () => void;
  rerollTrigger: number;
  fit?: Fit;
  onSetFit?: (fit: Fit) => void;
  flatterBadge?: string | null;
}

const FLICKER_STEPS = 6;
const FLICKER_INTERVAL = 45;

export default function OutfitSlot({
  slot,
  color,
  locked,
  onToggleLock,
  rerollTrigger,
  fit,
  onSetFit,
  flatterBadge,
}: Props) {
  const { t, lang } = useI18n();
  const Icon = SLOT_ICONS[slot];
  const [displayHex, setDisplayHex] = useState(color.hex);
  const [flickering, setFlickering] = useState(false);
  const isFirstRun = useRef(true);

  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      setDisplayHex(color.hex);
      return;
    }
    if (locked) {
      setDisplayHex(color.hex);
      return;
    }

    setFlickering(true);
    let step = 0;
    const interval = setInterval(() => {
      step += 1;
      const randomColor = PALETTE[Math.floor(Math.random() * PALETTE.length)];
      setDisplayHex(randomColor.hex);
      if (step >= FLICKER_STEPS) {
        clearInterval(interval);
        setDisplayHex(color.hex);
        setFlickering(false);
      }
    }, FLICKER_INTERVAL);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rerollTrigger]);

  useEffect(() => {
    if (locked) setDisplayHex(color.hex);
  }, [color.hex, locked]);

  const textColor = getContrastText(displayHex);

  return (
    <div className="flex flex-col rounded-2xl overflow-hidden border border-ink/10 dark:border-cream/10 bg-paper-card dark:bg-charcoal-card shadow-sm w-full">
      <div
        className="relative flex flex-col p-4 sm:p-5 aspect-[4/5] transition-colors duration-100"
        style={{ backgroundColor: displayHex }}
      >
        <div className="flex items-start justify-between">
          <span
            className="text-xs font-body tracking-wide uppercase opacity-80"
            style={{ color: textColor }}
          >
            {t(`slots.${slot}`)}
          </span>
          <button
            type="button"
            onClick={onToggleLock}
            aria-pressed={locked}
            aria-label={locked ? t("unlock") : t("lock")}
            className="rounded-full p-1.5 border transition-opacity hover:opacity-100"
            style={{
              borderColor: textColor,
              color: textColor,
              opacity: locked ? 1 : 0.65,
              backgroundColor: locked ? (textColor === "#22201B" ? "rgba(34,32,27,0.12)" : "rgba(245,241,232,0.18)") : "transparent",
            }}
          >
            {locked ? <LockClosedIcon /> : <LockOpenIcon />}
          </button>
        </div>

        <Icon className="w-14 h-14 self-center opacity-90 my-auto" style={{ color: textColor } as React.CSSProperties} />

        <div className="mt-auto space-y-1.5" style={{ color: textColor }}>
          {flatterBadge && !flickering && (
            <span
              className="inline-block max-w-full text-[10px] font-body px-2 py-1 rounded-full backdrop-blur-sm"
              style={{
                color: textColor,
                backgroundColor: textColor === "#22201B" ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.28)",
              }}
            >
              {flatterBadge}
            </span>
          )}
          <div className="space-y-0.5">
            {color.garmentType && (
              <p className="font-body text-[11px] uppercase tracking-wide opacity-70">
                {color.garmentType[lang] ?? color.garmentType.en}
              </p>
            )}
            <p className="font-display text-base sm:text-lg leading-tight">
              {color.name[lang] ?? color.name.en}
            </p>
            <p className="font-body text-xs opacity-75 uppercase tracking-wide">{color.hex}</p>
          </div>
        </div>
      </div>

      {onSetFit && fit && (
        <div className="flex items-center justify-center gap-1 p-2 bg-paper dark:bg-charcoal">
          {(["fitted", "loose"] as Fit[]).map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onSetFit(f)}
              title={t(`fit.${f}Hint`)}
              className={`text-xs font-body px-3 py-1 rounded-full transition-colors ${
                fit === f
                  ? "bg-moss text-cream dark:bg-sage dark:text-charcoal"
                  : "text-ink-soft dark:text-cream/70 hover:bg-ink/5 dark:hover:bg-cream/10"
              }`}
            >
              {t(`fit.${f}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function LockClosedIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 018 0v4" />
    </svg>
  );
}

function LockOpenIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="5" y="11" width="14" height="9" rx="2" />
      <path d="M8 11V7a4 4 0 017.5-2" />
    </svg>
  );
}
