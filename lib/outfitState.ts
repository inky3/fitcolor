import { HarmonyRule, SlotKey, SLOT_ORDER } from "./harmonyEngine";
import { StyleId } from "./styles";
import { OccasionId } from "./occasions";
import { Undertone, Season } from "./palette";

export type Fit = "loose" | "fitted";

export interface OutfitState {
  colorIds: Record<SlotKey, string>;
  locks: Record<SlotKey, boolean>;
  fits: Partial<Record<SlotKey, Fit>>;
  rule: HarmonyRule;
  style: StyleId;
  blendStyle: StyleId | null;
  blendMix: number;
  occasion: OccasionId;
  undertone: Undertone | null;
  season: Season | null;
}

const SLOT_PARAM_KEY: Record<SlotKey, string> = {
  top: "t",
  bottom: "b",
  outerwear: "o",
  shoes: "s",
  accessory: "a",
};

export function encodeOutfitToParams(outfit: OutfitState): URLSearchParams {
  const params = new URLSearchParams();
  params.set("r", outfit.rule);
  SLOT_ORDER.forEach((slot) => {
    params.set(SLOT_PARAM_KEY[slot], outfit.colorIds[slot] ?? "");
  });
  const lockedSlots = SLOT_ORDER.filter((s) => outfit.locks[s]);
  if (lockedSlots.length) params.set("lk", lockedSlots.map((s) => SLOT_PARAM_KEY[s]).join(""));
  if (outfit.fits.top) params.set("ft", outfit.fits.top);
  if (outfit.fits.bottom) params.set("fb", outfit.fits.bottom);
  if (outfit.fits.outerwear) params.set("fo", outfit.fits.outerwear);
  params.set("st", outfit.style);
  if (outfit.blendStyle) {
    params.set("bl", outfit.blendStyle);
    params.set("bm", String(outfit.blendMix));
  }
  params.set("oc", outfit.occasion);
  if (outfit.undertone) params.set("u", outfit.undertone);
  if (outfit.season) params.set("se", outfit.season);
  return params;
}

export function decodeOutfitFromParams(params: URLSearchParams): Partial<OutfitState> | null {
  if (!params.has("r")) return null;
  const colorIds = {} as Record<SlotKey, string>;
  SLOT_ORDER.forEach((slot) => {
    const v = params.get(SLOT_PARAM_KEY[slot]);
    if (v) colorIds[slot] = v;
  });

  const lockedParam = params.get("lk") ?? "";
  const locks = {} as Record<SlotKey, boolean>;
  SLOT_ORDER.forEach((slot) => {
    locks[slot] = lockedParam.includes(SLOT_PARAM_KEY[slot]);
  });

  const fits: Partial<Record<SlotKey, Fit>> = {};
  const ft = params.get("ft");
  const fb = params.get("fb");
  const fo = params.get("fo");
  if (ft === "loose" || ft === "fitted") fits.top = ft;
  if (fb === "loose" || fb === "fitted") fits.bottom = fb;
  if (fo === "loose" || fo === "fitted") fits.outerwear = fo;

  return {
    rule: params.get("r") as HarmonyRule,
    colorIds,
    locks,
    fits,
    style: (params.get("st") as StyleId) ?? "minimalist",
    blendStyle: (params.get("bl") as StyleId) ?? null,
    blendMix: params.get("bm") ? Number(params.get("bm")) : 0,
    occasion: (params.get("oc") as OccasionId) ?? "casual",
    undertone: (params.get("u") as Undertone) ?? null,
    season: (params.get("se") as Season) ?? null,
  };
}

// ---- Favorites (localStorage) ----

export interface FavoriteEntry {
  id: string;
  savedAt: number;
  outfit: OutfitState;
}

const FAVORITES_KEY = "fitcolor.favorites";

export function loadFavorites(): FavoriteEntry[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FAVORITES_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

export function saveFavorites(favorites: FavoriteEntry[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
}

export function addFavorite(outfit: OutfitState): FavoriteEntry[] {
  const favorites = loadFavorites();
  const entry: FavoriteEntry = { id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, savedAt: Date.now(), outfit };
  const next = [entry, ...favorites];
  saveFavorites(next);
  return next;
}

export function removeFavorite(id: string): FavoriteEntry[] {
  const next = loadFavorites().filter((f) => f.id !== id);
  saveFavorites(next);
  return next;
}

export function isOutfitFavorited(outfit: OutfitState, favorites: FavoriteEntry[]): string | null {
  const match = favorites.find(
    (f) =>
      f.outfit.rule === outfit.rule &&
      SLOT_ORDER.every((slot) => f.outfit.colorIds[slot] === outfit.colorIds[slot])
  );
  return match ? match.id : null;
}
