import { PALETTE, PaletteColor, Undertone, Season, hueDistance } from "./palette";

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

export type SlotKey = "top" | "bottom" | "outerwear" | "shoes" | "accessory";
export const SLOT_ORDER: SlotKey[] = ["top", "bottom", "outerwear", "shoes", "accessory"];

export interface GenerateOptions {
  rule: HarmonyRule;
  undertone?: Undertone | null;
  season?: Season | null;
  formalityRange?: [number, number]; // 0-3 inclusive band
  lockedColors?: Partial<Record<SlotKey, PaletteColor>>;
  seedHue?: number; // optional fixed seed hue, otherwise random
  wardrobe?: Partial<Record<SlotKey, PaletteColor[]>>; // user's own garment colors, per slot
  useWardrobe?: boolean; // when true, slots with wardrobe colors draw only from those
}

function rand<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function withinFormality(c: PaletteColor, range?: [number, number]) {
  if (!range) return true;
  return c.formality >= range[0] && c.formality <= range[1];
}

function matchesUndertone(c: PaletteColor, u?: Undertone | null) {
  if (!u) return true;
  return c.undertone === u || c.undertone === "neutral";
}

function matchesSeason(c: PaletteColor, s?: Season | null) {
  if (!s) return true;
  return c.seasons.includes(s);
}

function candidatesNearHue(
  hue: number,
  tolerance: number,
  opts: GenerateOptions,
  requireNeutral?: boolean
): PaletteColor[] {
  return PALETTE.filter((c) => {
    if (requireNeutral !== undefined && c.isNeutral !== requireNeutral) return false;
    if (!withinFormality(c, opts.formalityRange)) return false;
    if (!matchesUndertone(c, opts.undertone)) return false;
    if (!matchesSeason(c, opts.season)) return false;
    return hueDistance(c.hue, hue) <= tolerance;
  });
}

function pickNear(hue: number, opts: GenerateOptions, requireNeutral?: boolean): PaletteColor {
  // Widen tolerance progressively until we find a candidate — guarantees a result.
  for (const tolerance of [15, 30, 50, 90, 180]) {
    const pool = candidatesNearHue(hue, tolerance, opts, requireNeutral);
    if (pool.length) return rand(pool);
  }
  return rand(PALETTE);
}

// Nearest hue match within a fixed pool (the user's own wardrobe colors for
// this slot). We don't filter by formality/undertone/season here — these are
// real garments the person told us they own, not candidates to screen out.
function pickFromPool(hue: number, pool: PaletteColor[]): PaletteColor {
  let best = pool[0];
  let bestDist = Infinity;
  for (const c of pool) {
    const d = hueDistance(c.hue, hue);
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best;
}

function pickNeutral(opts: GenerateOptions): PaletteColor {
  const pool = PALETTE.filter(
    (c) =>
      c.isNeutral &&
      withinFormality(c, opts.formalityRange) &&
      matchesUndertone(c, opts.undertone) &&
      matchesSeason(c, opts.season)
  );
  return pool.length ? rand(pool) : rand(PALETTE.filter((c) => c.isNeutral));
}

interface Assignment {
  hues: number[]; // hue targets per role, matched 1:1 with SLOT_ORDER
  neutralMask?: boolean[]; // if role should be forced neutral
}

function buildHues(rule: HarmonyRule, seedHue: number): number[] {
  switch (rule) {
    case "monochromatic":
      return [seedHue, seedHue, seedHue, seedHue, seedHue];
    case "analogous":
      return [seedHue, seedHue + 25, seedHue - 25, seedHue + 12, seedHue - 12];
    case "complementary": {
      const comp = seedHue + 180;
      return [seedHue, seedHue, comp, comp, seedHue];
    }
    case "triadic": {
      const b = seedHue + 120;
      const c = seedHue + 240;
      return [seedHue, b, c, seedHue, b];
    }
    case "neutralAccent":
      return [seedHue, seedHue, seedHue, seedHue, seedHue]; // neutral mask applied separately
    case "60-30-10":
      return [seedHue, seedHue, seedHue + 25, seedHue + 180, seedHue + 180];
    case "50-50": {
      const comp = seedHue + 150;
      return [seedHue, seedHue, comp, comp, seedHue];
    }
    default:
      return [seedHue, seedHue, seedHue, seedHue, seedHue];
  }
}

export function generateOutfit(opts: GenerateOptions): Record<SlotKey, PaletteColor> {
  const seedHue = opts.seedHue ?? Math.floor(Math.random() * 360);
  const hues = buildHues(opts.rule, seedHue);

  const result = {} as Record<SlotKey, PaletteColor>;

  SLOT_ORDER.forEach((slot, i) => {
    if (opts.lockedColors?.[slot]) {
      result[slot] = opts.lockedColors[slot]!;
      return;
    }

    const wardrobePool = opts.useWardrobe ? opts.wardrobe?.[slot] : undefined;
    if (wardrobePool && wardrobePool.length) {
      result[slot] = pickFromPool(hues[i], wardrobePool);
      return;
    }

    if (opts.rule === "neutralAccent") {
      // All neutral except the accessory, which carries the accent hue.
      result[slot] = slot === "accessory" ? pickNear(seedHue, opts) : pickNeutral(opts);
      return;
    }

    if (opts.rule === "monochromatic") {
      // Vary lightness family within same hue by picking distinct entries near the hue.
      result[slot] = pickNear(hues[i], opts);
      return;
    }

    result[slot] = pickNear(hues[i], opts);
  });

  return result;
}

export const HARMONY_HUE_LABEL: Record<HarmonyRule, string> = {
  monochromatic: "monochromatic",
  analogous: "analogous",
  complementary: "complementary",
  triadic: "triadic",
  neutralAccent: "neutralAccent",
  "60-30-10": "60-30-10",
  "50-50": "50-50",
};
