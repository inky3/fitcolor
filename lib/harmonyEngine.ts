import {
  PALETTE,
  PaletteColor,
  Undertone,
  Season,
  hueDistance,
} from "./palette";

export type HarmonyRule =
  | "monochromatic"
  | "analogous"
  | "complementary"
  | "triadic"
  | "neutralAccent"
  | "60-30-10"
  | "50-50";

export const HARMONY_RULES: HarmonyRule[] = [
  "monochromatic",
  "analogous",
  "complementary",
  "triadic",
  "neutralAccent",
  "60-30-10",
  "50-50",
];

export type SlotKey =
  | "top"
  | "bottom"
  | "outerwear"
  | "shoes"
  | "accessory";

export const SLOT_ORDER: SlotKey[] = [
  "top",
  "bottom",
  "outerwear",
  "shoes",
  "accessory",
];

export interface GenerateOptions {
  rule: HarmonyRule;

  undertone?: Undertone | null;

  season?: Season | null;

  formalityRange?: [number, number];

  lockedColors?: Partial<Record<SlotKey, PaletteColor>>;

  seedHue?: number;
}

/**
 * Pick a random item from an array.
 */
function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Check formality.
 */
function withinFormality(
  color: PaletteColor,
  range?: [number, number]
): boolean {
  if (!range) {
    return true;
  }

  return (
    color.formality >= range[0] &&
    color.formality <= range[1]
  );
}

/**
 * Check season.
 */
function matchesSeason(
  color: PaletteColor,
  season?: Season | null
): boolean {
  if (!season) {
    return true;
  }

  return color.seasons.includes(season);
}

/**
 * Calculate how well a color matches the selected undertone.
 *
 * Higher = better.
 *
 * Exact match:
 *  100
 *
 * Neutral:
 *  65
 *
 * No undertone preference:
 *  50
 *
 * Opposite undertone:
 *  0
 */
function undertoneScore(
  color: PaletteColor,
  undertone?: Undertone | null
): number {
  if (!undertone) {
    return 50;
  }

  if (color.undertone === undertone) {
    return 100;
  }

  if (color.undertone === "neutral") {
    return 65;
  }

  return 0;
}

/**
 * Get candidates that satisfy the basic constraints.
 */
function getBaseCandidates(
  opts: GenerateOptions,
  requireNeutral?: boolean
): PaletteColor[] {
  return PALETTE.filter((color) => {
    if (
      requireNeutral !== undefined &&
      color.isNeutral !== requireNeutral
    ) {
      return false;
    }

    if (!withinFormality(color, opts.formalityRange)) {
      return false;
    }

    if (!matchesSeason(color, opts.season)) {
      return false;
    }

    return true;
  });
}

/**
 * Find colors around a target hue.
 */
function candidatesNearHue(
  hue: number,
  tolerance: number,
  opts: GenerateOptions,
  requireNeutral?: boolean
): PaletteColor[] {
  return getBaseCandidates(
    opts,
    requireNeutral
  ).filter((color) => {
    return hueDistance(color.hue, hue) <= tolerance;
  });
}

/**
 * Pick a color near a target hue while respecting undertone.
 *
 * Instead of simply filtering out all other undertones,
 * we rank candidates:
 *
 *   1. Selected undertone
 *   2. Neutral
 *   3. Other undertone
 *
 * This keeps the harmony relationship while making the
 * Warm/Cool setting meaningful.
 */
function pickNear(
  hue: number,
  opts: GenerateOptions,
  requireNeutral?: boolean
): PaletteColor {
  const tolerances = [15, 30, 50, 90, 180];

  for (const tolerance of tolerances) {
    const pool = candidatesNearHue(
      hue,
      tolerance,
      opts,
      requireNeutral
    );

    if (!pool.length) {
      continue;
    }

    /**
     * If there is no undertone preference,
     * any candidate is acceptable.
     */
    if (!opts.undertone) {
      return rand(pool);
    }

    /**
     * Sort strongest undertone matches first.
     *
     * We still randomize within the same score.
     */
    const maxScore = Math.max(
      ...pool.map((color) =>
        undertoneScore(color, opts.undertone)
      )
    );

    const best = pool.filter(
      (color) =>
        undertoneScore(color, opts.undertone) ===
        maxScore
    );

    return rand(best);
  }

  /**
   * If no color exists near the requested hue,
   * fall back to the best undertone match anywhere
   * within the other constraints.
   */
  const fallback = getBaseCandidates(
    opts,
    requireNeutral
  );

  if (fallback.length) {
    if (!opts.undertone) {
      return rand(fallback);
    }

    const maxScore = Math.max(
      ...fallback.map((color) =>
        undertoneScore(color, opts.undertone)
      )
    );

    const best = fallback.filter(
      (color) =>
        undertoneScore(color, opts.undertone) ===
        maxScore
    );

    if (best.length) {
      return rand(best);
    }
  }

  /**
   * Final emergency fallback.
   */
  return rand(PALETTE);
}

/**
 * Pick a neutral color.
 *
 * When Warm is selected, warm neutrals such as:
 *
 * Bone
 * Espresso
 * Taupe
 * Sand
 *
 * are preferred.
 */
function pickNeutral(
  opts: GenerateOptions
): PaletteColor {
  const pool = PALETTE.filter((color) => {
    if (!color.isNeutral) {
      return false;
    }

    if (!withinFormality(color, opts.formalityRange)) {
      return false;
    }

    if (!matchesSeason(color, opts.season)) {
      return false;
    }

    return true;
  });

  if (!pool.length) {
    return rand(
      PALETTE.filter((color) => color.isNeutral)
    );
  }

  if (!opts.undertone) {
    return rand(pool);
  }

  const maxScore = Math.max(
    ...pool.map((color) =>
      undertoneScore(color, opts.undertone)
    )
  );

  const best = pool.filter(
    (color) =>
      undertoneScore(color, opts.undertone) ===
      maxScore
  );

  return rand(best);
}

/**
 * Build target hues for each garment slot.
 */
function buildHues(
  rule: HarmonyRule,
  seedHue: number
): number[] {
  switch (rule) {
    case "monochromatic":
      return [
        seedHue,
        seedHue,
        seedHue,
        seedHue,
        seedHue,
      ];

    case "analogous":
      return [
        seedHue,
        seedHue + 25,
        seedHue - 25,
        seedHue + 12,
        seedHue - 12,
      ];

    case "complementary": {
      const comp = seedHue + 180;

      return [
        seedHue,
        seedHue,
        comp,
        comp,
        seedHue,
      ];
    }

    case "triadic": {
      const b = seedHue + 120;
      const c = seedHue + 240;

      return [
        seedHue,
        b,
        c,
        seedHue,
        b,
      ];
    }

    case "neutralAccent":
      return [
        seedHue,
        seedHue,
        seedHue,
        seedHue,
        seedHue,
      ];

    case "60-30-10":
      return [
        seedHue,
        seedHue,
        seedHue + 25,
        seedHue + 180,
        seedHue + 180,
      ];

    case "50-50": {
      const comp = seedHue + 150;

      return [
        seedHue,
        seedHue,
        comp,
        comp,
        seedHue,
      ];
    }

    default:
      return [
        seedHue,
        seedHue,
        seedHue,
        seedHue,
        seedHue,
      ];
  }
}

/**
 * Choose a good starting hue.
 *
 * When an undertone is selected, we start from a color
 * belonging to that undertone rather than randomly
 * starting anywhere on the wheel.
 *
 * This makes:
 *
 * Warm -> earthy / warm family
 * Cool -> blue / purple / cool family
 *
 * much more reliable.
 */
function getSeedHue(
  opts: GenerateOptions
): number {
  if (opts.seedHue !== undefined) {
    return opts.seedHue;
  }

  const candidates = PALETTE.filter((color) => {
    if (!withinFormality(color, opts.formalityRange)) {
      return false;
    }

    if (!matchesSeason(color, opts.season)) {
      return false;
    }

    if (!opts.undertone) {
      return true;
    }

    return (
      color.undertone === opts.undertone ||
      color.undertone === "neutral"
    );
  });

  if (candidates.length) {
    return rand(candidates).hue;
  }

  return Math.floor(Math.random() * 360);
}

/**
 * Generate the complete outfit.
 */
export function generateOutfit(
  opts: GenerateOptions
): Record<SlotKey, PaletteColor> {
  const seedHue = getSeedHue(opts);

  const hues = buildHues(
    opts.rule,
    seedHue
  );

  const result =
    {} as Record<SlotKey, PaletteColor>;

  SLOT_ORDER.forEach((slot, i) => {
    /**
     * Locked garment stays unchanged.
     */
    if (opts.lockedColors?.[slot]) {
      result[slot] =
        opts.lockedColors[slot]!;

      return;
    }

    /**
     * Neutral + Accent:
     *
     * Everything is neutral except the accessory.
     */
    if (opts.rule === "neutralAccent") {
      result[slot] =
        slot === "accessory"
          ? pickNear(seedHue, opts)
          : pickNeutral(opts);

      return;
    }

    /**
     * Monochromatic:
     *
     * Same hue family with different colors.
     */
    if (opts.rule === "monochromatic") {
      result[slot] = pickNear(
        hues[i],
        opts
      );

      return;
    }

    /**
     * All other harmony rules.
     */
    result[slot] = pickNear(
      hues[i],
      opts
    );
  });

  return result;
}

export const HARMONY_HUE_LABEL: Record<
  HarmonyRule,
  string
> = {
  monochromatic: "monochromatic",
  analogous: "analogous",
  complementary: "complementary",
  triadic: "triadic",
  neutralAccent: "neutralAccent",
  "60-30-10": "60-30-10",
  "50-50": "50-50",
};