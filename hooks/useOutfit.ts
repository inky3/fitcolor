"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

import {
  findColor,
  PaletteColor,
  Undertone,
  Season,
} from "@/lib/palette";

import {
  generateOutfit,
  HarmonyRule,
  SlotKey,
  SLOT_ORDER,
} from "@/lib/harmonyEngine";

import {
  findStyle,
  blendFormalityRange,
  StyleId,
} from "@/lib/styles";

import {
  findOccasion,
  OccasionId,
} from "@/lib/occasions";

import {
  OutfitState,
  Fit,
  encodeOutfitToParams,
  decodeOutfitFromParams,
} from "@/lib/outfitState";


/* =========================================================
   Constants
========================================================= */

const DEFAULT_RULE: HarmonyRule = "analogous";

const CURRENT_OUTFIT_KEY = "fitcolor.current";

const DEFAULT_LOCKS: Record<SlotKey, boolean> = {
  top: false,
  bottom: false,
  outerwear: false,
  shoes: false,
  accessory: false,
};

const DEFAULT_FITS: Partial<Record<SlotKey, Fit>> = {
  top: "fitted",
  bottom: "loose",
  outerwear: "loose",
};


/*
 * IMPORTANT:
 * These are deterministic.
 *
 * We do NOT call Math.random() during the first render.
 * This prevents:
 *
 * Server: "Blush"
 * Client: "Lavender"
 *
 * hydration errors.
 *
 * After the component mounts, we load the real saved/current
 * outfit or generate a random outfit.
 */
const INITIAL_COLOR_IDS: Record<SlotKey, string> = {
  top: "ink-navy",
  bottom: "stone-grey",
  outerwear: "bone",
  shoes: "espresso",
  accessory: "taupe",
};


/* =========================================================
   Utility: create a deterministic initial state
========================================================= */

function createInitialOutfitState(): OutfitState {
  return {
    colorIds: {
      ...INITIAL_COLOR_IDS,
    },

    locks: {
      ...DEFAULT_LOCKS,
    },

    fits: {
      ...DEFAULT_FITS,
    },

    rule: DEFAULT_RULE,

    style: "minimalist",

    blendStyle: null,

    blendMix: 0,

    occasion: "casual",

    undertone: null,

    season: null,
  };
}


/* =========================================================
   Utility: calculate formality range
========================================================= */

function getFormalityRange(
  style: StyleId,
  blendStyle: StyleId | null,
  blendMix: number,
  occasion: OccasionId
): [number, number] {
  const styleObj = findStyle(style);
  const occasionObj = findOccasion(occasion);

  let formalityRange: [number, number] = [
    Math.max(
      styleObj.formalityRange[0],
      occasionObj.formalityRange[0]
    ),

    Math.min(
      styleObj.formalityRange[1],
      occasionObj.formalityRange[1]
    ),
  ];

  /*
   * If a second style is selected, blend both styles first.
   */
  if (blendStyle) {
    const blended = blendFormalityRange(
      styleObj,
      findStyle(blendStyle),
      blendMix
    );

    formalityRange = [
      Math.max(
        blended[0],
        occasionObj.formalityRange[0]
      ),

      Math.min(
        blended[1],
        occasionObj.formalityRange[1]
      ),
    ];
  }

  /*
   * Safety fallback.
   */
  if (formalityRange[0] > formalityRange[1]) {
    return [0, 3];
  }

  return formalityRange;
}


/* =========================================================
   Generate a completely new random outfit
========================================================= */

function randomOutfitState(
  overrides?: Partial<OutfitState>
): OutfitState {
  const rule = overrides?.rule ?? DEFAULT_RULE;

  const style = overrides?.style ?? "minimalist";

  const occasion = overrides?.occasion ?? "casual";

  const undertone = overrides?.undertone ?? null;

  const season = overrides?.season ?? null;

  const blendStyle = overrides?.blendStyle ?? null;

  const blendMix = overrides?.blendMix ?? 0;

  const formalityRange = getFormalityRange(
    style,
    blendStyle,
    blendMix,
    occasion
  );

  /*
   * Generate colors only when we actually want a new outfit.
   */
  const generatedColors = generateOutfit({
    rule,
    undertone,
    season,
    formalityRange,
  });

  const generatedColorIds =
    {} as Record<SlotKey, string>;

  SLOT_ORDER.forEach((slot) => {
    generatedColorIds[slot] =
      generatedColors[slot].id;
  });


  /*
   * IMPORTANT:
   *
   * If colorIds are provided in overrides, preserve them.
   *
   * This fixes the old bug where:
   *
   * URL -> decode colors -> randomOutfitState()
   * -> colors get randomly generated again.
   */
  const colorIds = {
    ...generatedColorIds,
    ...(overrides?.colorIds ?? {}),
  };


  return {
    colorIds,

    locks: {
      ...DEFAULT_LOCKS,
      ...(overrides?.locks ?? {}),
    },

    fits: {
      ...DEFAULT_FITS,
      ...(overrides?.fits ?? {}),
    },

    rule,

    style,

    blendStyle,

    blendMix,

    occasion,

    undertone,

    season,
  };
}


/* =========================================================
   Validate a saved OutfitState
========================================================= */

function isValidOutfitState(
  value: unknown
): value is OutfitState {
  if (!value || typeof value !== "object") {
    return false;
  }

  const outfit = value as Partial<OutfitState>;

  if (!outfit.colorIds) {
    return false;
  }

  if (!outfit.locks) {
    return false;
  }

  if (!outfit.fits) {
    return false;
  }

  /*
   * Make sure every slot has a real palette color.
   */
  for (const slot of SLOT_ORDER) {
    const colorId = outfit.colorIds[slot];

    if (!colorId) {
      return false;
    }

    if (!findColor(colorId)) {
      return false;
    }
  }

  if (!outfit.rule) {
    return false;
  }

  if (!outfit.style) {
    return false;
  }

  if (!outfit.occasion) {
    return false;
  }

  return true;
}


/* =========================================================
   Load current outfit from localStorage
========================================================= */

function loadCurrentOutfit(): OutfitState | null {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    const raw =
      window.localStorage.getItem(
        CURRENT_OUTFIT_KEY
      );

    if (!raw) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    if (!isValidOutfitState(parsed)) {
      return null;
    }

    return parsed;
  } catch {
    return null;
  }
}


/* =========================================================
   Save current outfit to localStorage
========================================================= */

function saveCurrentOutfit(
  outfit: OutfitState
) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(
      CURRENT_OUTFIT_KEY,
      JSON.stringify(outfit)
    );
  } catch {
    /*
     * Ignore localStorage errors.
     *
     * For example:
     * - private browsing restrictions
     * - storage quota
     * - disabled storage
     */
  }
}


/* =========================================================
   Main Hook
========================================================= */

export function useOutfit() {
  const router = useRouter();

  const searchParams = useSearchParams();

  /*
   * This is intentionally separate from state.
   *
   * The first render MUST be deterministic.
   *
   * After mounting, we decide whether the real source
   * of truth is:
   *
   * 1. URL
   * 2. current localStorage
   * 3. new random outfit
   */
  const [state, setState] =
    useState<OutfitState>(
      createInitialOutfitState
    );

  const [lastRerollAt, setLastRerollAt] =
    useState(0);

  const initialized = useRef(false);


  /* =======================================================
     Initialize after client mount
  ======================================================= */

  useEffect(() => {
    if (initialized.current) {
      return;
    }

    /*
     * Priority:
     *
     * URL
     * ↓
     * saved current outfit
     * ↓
     * new random outfit
     */

    const decoded =
      decodeOutfitFromParams(searchParams);


    /* -------------------------------------------------------
       1. Restore from URL
    ------------------------------------------------------- */

    if (decoded && decoded.colorIds) {
      const restored = randomOutfitState(
        decoded
      );

      setState(restored);

      saveCurrentOutfit(restored);

      initialized.current = true;

      return;
    }


    /* -------------------------------------------------------
       2. Restore current outfit
    ------------------------------------------------------- */

    const savedCurrent =
      loadCurrentOutfit();

    if (savedCurrent) {
      setState(savedCurrent);

      initialized.current = true;

      return;
    }


    /* -------------------------------------------------------
       3. No saved outfit -> generate one
    ------------------------------------------------------- */

    const generated =
      randomOutfitState();

    setState(generated);

    saveCurrentOutfit(generated);

    initialized.current = true;
  }, [searchParams]);


  /* =======================================================
     Convert color IDs -> PaletteColor objects
  ======================================================= */

  const colors: Record<
    SlotKey,
    PaletteColor
  > = useMemo(() => {
    const output =
      {} as Record<SlotKey, PaletteColor>;

    SLOT_ORDER.forEach((slot) => {
      const color = findColor(
        state.colorIds[slot]
      );

      /*
       * This should never fail because we validate
       * colorIds before loading them.
       */
      if (color) {
        output[slot] = color;
      }
    });

    return output;
  }, [state.colorIds]);


  /* =======================================================
     Randomize
  ======================================================= */

  const reroll = useCallback(() => {
    setState((previous) => {
      const formalityRange =
        getFormalityRange(
          previous.style,
          previous.blendStyle,
          previous.blendMix,
          previous.occasion
        );


      /*
       * Preserve locked colors.
       */
      const lockedColors =
        {} as Partial<
          Record<SlotKey, PaletteColor>
        >;

      SLOT_ORDER.forEach((slot) => {
        if (previous.locks[slot]) {
          const color = findColor(
            previous.colorIds[slot]
          );

          if (color) {
            lockedColors[slot] = color;
          }
        }
      });


      /*
       * Generate a new palette.
       */
      const generated =
        generateOutfit({
          rule: previous.rule,

          undertone:
            previous.undertone,

          season:
            previous.season,

          formalityRange,

          lockedColors,
        });


      const colorIds =
        {} as Record<SlotKey, string>;

      SLOT_ORDER.forEach((slot) => {
        colorIds[slot] =
          generated[slot].id;
      });


      const nextState: OutfitState = {
        ...previous,
        colorIds,
      };


      /*
       * Save immediately.
       */
      saveCurrentOutfit(nextState);

      return nextState;
    });


    setLastRerollAt(Date.now());
  }, []);


  /* =======================================================
     Toggle Lock
  ======================================================= */

  const toggleLock = useCallback(
    (slot: SlotKey) => {
      setState((previous) => ({
        ...previous,

        locks: {
          ...previous.locks,

          [slot]:
            !previous.locks[slot],
        },
      }));
    },
    []
  );


  /* =======================================================
     Fit
  ======================================================= */

  const setFit = useCallback(
    (slot: SlotKey, fit: Fit) => {
      setState((previous) => ({
        ...previous,

        fits: {
          ...previous.fits,

          [slot]: fit,
        },
      }));
    },
    []
  );


  /* =======================================================
     Harmony Rule
  ======================================================= */

  const setRule = useCallback(
    (rule: HarmonyRule) => {
      setState((previous) => ({
        ...previous,
        rule,
      }));
    },
    []
  );


  /* =======================================================
     Style
  ======================================================= */

  const setStyle = useCallback(
    (style: StyleId) => {
      setState((previous) => ({
        ...previous,
        style,
      }));
    },
    []
  );


  /* =======================================================
     Blend Style
  ======================================================= */

  const setBlendStyle = useCallback(
    (blendStyle: StyleId | null) => {
      setState((previous) => ({
        ...previous,
        blendStyle,
      }));
    },
    []
  );


  /* =======================================================
     Blend Mix
  ======================================================= */

  const setBlendMix = useCallback(
    (blendMix: number) => {
      setState((previous) => ({
        ...previous,
        blendMix,
      }));
    },
    []
  );


  /* =======================================================
     Occasion
  ======================================================= */

  const setOccasion = useCallback(
    (occasion: OccasionId) => {
      setState((previous) => ({
        ...previous,
        occasion,
      }));
    },
    []
  );


  /* =======================================================
     Undertone
  ======================================================= */

  const setUndertone = useCallback(
    (undertone: Undertone | null) => {
      setState((previous) => ({
        ...previous,
        undertone,
      }));
    },
    []
  );


  /* =======================================================
     Season
  ======================================================= */

  const setSeason = useCallback(
    (season: Season | null) => {
      setState((previous) => ({
        ...previous,
        season,
      }));
    },
    []
  );


  /* =======================================================
     Load / Restore an outfit
  ======================================================= */

  const loadOutfit = useCallback(
    (outfit: OutfitState) => {
      setState(outfit);

      /*
       * Also make this the current outfit.
       *
       * This is important when restoring from Favorites.
       */
      saveCurrentOutfit(outfit);
    },
    []
  );


  /* =======================================================
     Share URL
  ======================================================= */

  const shareUrl = useCallback(() => {
    if (typeof window === "undefined") {
      return "";
    }

    const params =
      encodeOutfitToParams(state);

    return (
      `${window.location.origin}` +
      `${window.location.pathname}` +
      `?${params.toString()}`
    );
  }, [state]);


  /* =======================================================
     Persist current outfit
  ======================================================= */

  useEffect(() => {
    /*
     * Do not save the temporary deterministic server state.
     */
    if (!initialized.current) {
      return;
    }

    saveCurrentOutfit(state);
  }, [state]);


  /* =======================================================
     Keep URL synchronized
  ======================================================= */

  useEffect(() => {
    /*
     * Do not update the URL during the initial
     * server/client hydration phase.
     */
    if (!initialized.current) {
      return;
    }

    const params =
      encodeOutfitToParams(state);

    router.replace(
      `?${params.toString()}`,
      {
        scroll: false,
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);


  /* =======================================================
     Return API
  ======================================================= */

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