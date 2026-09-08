"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { findColor, PaletteColor, Undertone, Season } from "@/lib/palette";
import { generateOutfit, HarmonyRule, SlotKey, SLOT_ORDER } from "@/lib/harmonyEngine";
import { findStyle, blendFormalityRange, StyleId } from "@/lib/styles";
import { findOccasion, OccasionId } from "@/lib/occasions";
import { OutfitState, Fit, encodeOutfitToParams, decodeOutfitFromParams } from "@/lib/outfitState";

const DEFAULT_RULE: HarmonyRule = "analogous";

function randomOutfitState(overrides?: Partial<OutfitState>): OutfitState {
  const rule = overrides?.rule ?? DEFAULT_RULE;
  const style = overrides?.style ?? "minimalist";
  const occasion = overrides?.occasion ?? "casual";
  const undertone = overrides?.undertone ?? null;
  const season = overrides?.season ?? null;

  const styleObj = findStyle(style);
  const occasionObj = findOccasion(occasion);
  const formalityRange: [number, number] = [
    Math.max(styleObj.formalityRange[0], occasionObj.formalityRange[0]),
    Math.min(styleObj.formalityRange[1], occasionObj.formalityRange[1]),
  ];
  const safeRange: [number, number] =
    formalityRange[0] <= formalityRange[1] ? formalityRange : [0, 3];

  const colors = generateOutfit({ rule, undertone, season, formalityRange: safeRange });
  const colorIds = {} as Record<SlotKey, string>;
  SLOT_ORDER.forEach((s) => (colorIds[s] = colors[s].id));

  return {
    colorIds,
    locks: overrides?.locks ?? { top: false, bottom: false, outerwear: false, shoes: false, accessory: false },
    fits: overrides?.fits ?? { top: "fitted", bottom: "loose", outerwear: "loose" },
    rule,
    style,
    blendStyle: overrides?.blendStyle ?? null,
    blendMix: overrides?.blendMix ?? 0,
    occasion,
    undertone,
    season,
  };
}

export function useOutfit() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initializedFromUrl = useRef(false);

  const [state, setState] = useState<OutfitState>(() => {
    const decoded = decodeOutfitFromParams(searchParams);
    if (decoded && decoded.colorIds) {
      initializedFromUrl.current = true;
      return randomOutfitState(decoded);
    }
    return randomOutfitState();
  });

  const [lastRerollAt, setLastRerollAt] = useState(0);

  const colors: Record<SlotKey, PaletteColor> = useMemo(() => {
    const out = {} as Record<SlotKey, PaletteColor>;
    SLOT_ORDER.forEach((s) => (out[s] = findColor(state.colorIds[s])));
    return out;
  }, [state.colorIds]);

  const reroll = useCallback(() => {
    setState((prev) => {
      const styleObj = findStyle(prev.style);
      const occasionObj = findOccasion(prev.occasion);
      let formalityRange: [number, number] = [
        Math.max(styleObj.formalityRange[0], occasionObj.formalityRange[0]),
        Math.min(styleObj.formalityRange[1], occasionObj.formalityRange[1]),
      ];
      if (prev.blendStyle) {
        const blended = blendFormalityRange(styleObj, findStyle(prev.blendStyle), prev.blendMix);
        formalityRange = [
          Math.max(blended[0], occasionObj.formalityRange[0]),
          Math.min(blended[1], occasionObj.formalityRange[1]),
        ];
      }
      if (formalityRange[0] > formalityRange[1]) formalityRange = [0, 3];

      const lockedColors: Partial<Record<SlotKey, PaletteColor>> = {};
      SLOT_ORDER.forEach((s) => {
        if (prev.locks[s]) lockedColors[s] = findColor(prev.colorIds[s]);
      });

      const generated = generateOutfit({
        rule: prev.rule,
        undertone: prev.undertone,
        season: prev.season,
        formalityRange,
        lockedColors,
      });

      const colorIds = {} as Record<SlotKey, string>;
      SLOT_ORDER.forEach((s) => (colorIds[s] = generated[s].id));

      return { ...prev, colorIds };
    });
    setLastRerollAt(Date.now());
  }, []);

  const toggleLock = useCallback((slot: SlotKey) => {
    setState((prev) => ({ ...prev, locks: { ...prev.locks, [slot]: !prev.locks[slot] } }));
  }, []);

  const setFit = useCallback((slot: SlotKey, fit: Fit) => {
    setState((prev) => ({ ...prev, fits: { ...prev.fits, [slot]: fit } }));
  }, []);

  const setRule = useCallback((rule: HarmonyRule) => {
    setState((prev) => ({ ...prev, rule }));
  }, []);

  const setStyle = useCallback((style: StyleId) => {
    setState((prev) => ({ ...prev, style }));
  }, []);

  const setBlendStyle = useCallback((blendStyle: StyleId | null) => {
    setState((prev) => ({ ...prev, blendStyle }));
  }, []);

  const setBlendMix = useCallback((blendMix: number) => {
    setState((prev) => ({ ...prev, blendMix }));
  }, []);

  const setOccasion = useCallback((occasion: OccasionId) => {
    setState((prev) => ({ ...prev, occasion }));
  }, []);

  const setUndertone = useCallback((undertone: Undertone | null) => {
    setState((prev) => ({ ...prev, undertone }));
  }, []);

  const setSeason = useCallback((season: Season | null) => {
    setState((prev) => ({ ...prev, season }));
  }, []);

  const loadOutfit = useCallback((outfit: OutfitState) => {
    setState(outfit);
  }, []);

  const shareUrl = useCallback(() => {
    if (typeof window === "undefined") return "";
    const params = encodeOutfitToParams(state);
    return `${window.location.origin}${window.location.pathname}?${params.toString()}`;
  }, [state]);

  // Keep the URL in sync (shallow) so the current outfit is always shareable.
  useEffect(() => {
    const params = encodeOutfitToParams(state);
    router.replace(`?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  return {
    state,
    colors,
    lastRerollAt,
    reroll,
    toggleLock,
    setFit,
    setRule,
    setStyle,
    setBlendStyle,
    setBlendMix,
    setOccasion,
    setUndertone,
    setSeason,
    loadOutfit,
    shareUrl,
  };
}
