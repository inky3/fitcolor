"use client";

import React, { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";

interface Props {
  onRandomize: () => void;
  soundOn: boolean;
}

function playClick(ctx: AudioContext) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = "sine";
  osc.frequency.setValueAtTime(520, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.09);
  gain.gain.setValueAtTime(0.06, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start();
  osc.stop(ctx.currentTime + 0.13);
}

export default function RandomizeButton({ onRandomize, soundOn }: Props) {
  const { t } = useI18n();
  const audioCtxRef = useRef<AudioContext | null>(null);

  const trigger = () => {
    if (soundOn) {
      try {
        if (!audioCtxRef.current) {
          const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
          audioCtxRef.current = new AudioCtx();
        }
        if (audioCtxRef.current.state === "suspended") audioCtxRef.current.resume();
        playClick(audioCtxRef.current);
      } catch {
        // Sound is a nicety; ignore failures silently.
      }
    }
    onRandomize();
  };

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code !== "Space") return;
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isEditable = tag === "input" || tag === "textarea" || tag === "select" || target?.isContentEditable;
      if (isEditable) return;
      e.preventDefault();
      trigger();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [soundOn]);

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        type="button"
        onClick={trigger}
        className="group relative rounded-full bg-moss dark:bg-sage text-cream dark:text-charcoal font-display text-lg sm:text-xl px-9 py-4 sm:px-11 sm:py-5 shadow-lg shadow-moss/20 dark:shadow-black/30 transition-transform duration-150 hover:scale-[1.03] active:scale-[0.97] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-moss dark:focus-visible:outline-sage"
      >
        {t("randomize")}
      </button>
      <p className="text-xs font-body text-ink-faint dark:text-cream/50 tracking-wide">
        {t("spaceHint")}
      </p>
    </div>
  );
}
