import { SlotKey } from "./harmonyEngine";
import { PaletteColor, PALETTE, hueDistance } from "./palette";
import { hexToHsl, classifyUndertone } from "./colorUtils";

export interface WardrobeItem {
  id: string;
  slot: SlotKey;
  hex: string;
  garmentType?: string; // free text, e.g. "Jacket" — shown as-is, not translated
  savedAt: number;
}

const WARDROBE_KEY = "fitcolor.wardrobe";
const USE_WARDROBE_KEY = "fitcolor.useWardrobe";

export function loadWardrobe(): WardrobeItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(WARDROBE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveWardrobe(items: WardrobeItem[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WARDROBE_KEY, JSON.stringify(items));
}

export function addWardrobeItem(
  prev: WardrobeItem[],
  item: Omit<WardrobeItem, "id" | "savedAt">
): WardrobeItem[] {
  const entry: WardrobeItem = {
    ...item,
    id: `custom:${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    savedAt: Date.now(),
  };
  const next = [entry, ...prev];
  saveWardrobe(next);
  return next;
}

export function removeWardrobeItem(prev: WardrobeItem[], id: string): WardrobeItem[] {
  const next = prev.filter((i) => i.id !== id);
  saveWardrobe(next);
  return next;
}

export function loadUseWardrobe(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(USE_WARDROBE_KEY) === "1";
}

export function saveUseWardrobe(v: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(USE_WARDROBE_KEY, v ? "1" : "0");
}

// Custom hexes still get a real color name by borrowing the nearest curated
// PALETTE entry's name — so "Add a color" never shows raw hex as the label.
function nearestPaletteName(hue: number, sat: number, light: number): { en: string; th: string } {
  let best = PALETTE[0];
  let bestDist = Infinity;
  for (const c of PALETTE) {
    const d = hueDistance(c.hue, hue) * 1.4 + Math.abs(c.sat - sat) * 0.5 + Math.abs(c.light - light) * 0.5;
    if (d < bestDist) {
      bestDist = d;
      best = c;
    }
  }
  return best.name;
}

export function wardrobeItemToPaletteColor(item: WardrobeItem): PaletteColor {
  const { h, s, l } = hexToHsl(item.hex);
  return {
    id: item.id,
    hex: item.hex,
    hue: h,
    sat: s,
    light: l,
    name: nearestPaletteName(h, s, l),
    isNeutral: s < 12,
    undertone: classifyUndertone(h),
    seasons: ["spring", "summer", "autumn", "winter"],
    formality: 1,
    garmentType: item.garmentType ? { en: item.garmentType, th: item.garmentType } : undefined,
  };
}
