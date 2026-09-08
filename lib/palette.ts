export type Undertone = "warm" | "cool" | "neutral";
export type Season = "spring" | "summer" | "autumn" | "winter";

export interface PaletteColor {
  id: string;
  hex: string;
  hue: number; // 0-360
  sat: number; // 0-100
  light: number; // 0-100
  name: { en: string; th: string };
  isNeutral: boolean;
  undertone: Undertone;
  seasons: Season[];
  formality: number; // 0 (very casual) - 3 (very formal)
}

// Curated, garment-realistic colors spanning the wheel, each hand-named
// so results always read as real clothing colors rather than raw hex noise.
export const PALETTE: PaletteColor[] = [
  // Neutrals
  { id: "ink-navy", hex: "#1C2536", hue: 220, sat: 33, light: 16, name: { en: "Ink Navy", th: "กรมท่าเข้ม" }, isNeutral: true, undertone: "cool", seasons: ["winter", "autumn"], formality: 3 },
  { id: "charcoal", hex: "#333330", hue: 60, sat: 3, light: 20, name: { en: "Charcoal", th: "เทาถ่าน" }, isNeutral: true, undertone: "neutral", seasons: ["winter", "autumn"], formality: 3 },
  { id: "stone-grey", hex: "#8A8478", hue: 40, sat: 7, light: 51, name: { en: "Stone Grey", th: "เทาหิน" }, isNeutral: true, undertone: "neutral", seasons: ["summer", "autumn"], formality: 2 },
  { id: "fog", hex: "#C7C4BB", hue: 48, sat: 6, light: 76, name: { en: "Fog", th: "หมอกจาง" }, isNeutral: true, undertone: "cool", seasons: ["summer", "winter"], formality: 1 },
  { id: "cloud-white", hex: "#F1EEE6", hue: 43, sat: 21, light: 93, name: { en: "Cloud White", th: "ขาวเมฆ" }, isNeutral: true, undertone: "neutral", seasons: ["summer", "spring"], formality: 1 },
  { id: "bone", hex: "#E6DFCF", hue: 42, sat: 30, light: 86, name: { en: "Bone", th: "งาช้าง" }, isNeutral: true, undertone: "warm", seasons: ["autumn", "spring"], formality: 2 },
  { id: "espresso", hex: "#3B2A22", hue: 20, sat: 30, light: 17, name: { en: "Espresso", th: "น้ำตาลเข้ม" }, isNeutral: true, undertone: "warm", seasons: ["autumn", "winter"], formality: 2 },
  { id: "taupe", hex: "#8C7B6B", hue: 30, sat: 15, light: 45, name: { en: "Taupe", th: "เทาน้ำตาล" }, isNeutral: true, undertone: "warm", seasons: ["autumn", "summer"], formality: 2 },
  { id: "black", hex: "#161513", hue: 30, sat: 6, light: 8, name: { en: "Onyx Black", th: "ดำโอนิกซ์" }, isNeutral: true, undertone: "neutral", seasons: ["winter"], formality: 3 },
  { id: "sand", hex: "#D8C6A5", hue: 38, sat: 40, light: 78, name: { en: "Sand", th: "ทราย" }, isNeutral: true, undertone: "warm", seasons: ["spring", "summer"], formality: 1 },

  // Reds / Pinks
  { id: "brick-red", hex: "#A5432F", hue: 11, sat: 54, light: 41, name: { en: "Brick Red", th: "แดงอิฐ" }, isNeutral: false, undertone: "warm", seasons: ["autumn"], formality: 2 },
  { id: "cherry", hex: "#8E1F3B", hue: 340, sat: 63, light: 34, name: { en: "Cherry", th: "แดงเชอร์รี่" }, isNeutral: false, undertone: "cool", seasons: ["winter"], formality: 2 },
  { id: "blush", hex: "#E8B8B0", hue: 8, sat: 55, light: 82, name: { en: "Blush", th: "ชมพูอ่อน" }, isNeutral: false, undertone: "warm", seasons: ["spring", "summer"], formality: 1 },
  { id: "coral", hex: "#E2694B", hue: 11, sat: 68, light: 59, name: { en: "Coral", th: "ส้มปะการัง" }, isNeutral: false, undertone: "warm", seasons: ["spring"], formality: 0 },
  { id: "rose-mauve", hex: "#9C6B70", hue: 355, sat: 20, light: 49, name: { en: "Rose Mauve", th: "ม่วงกุหลาบ" }, isNeutral: false, undertone: "cool", seasons: ["summer"], formality: 2 },
  { id: "raspberry", hex: "#B33A5B", hue: 341, sat: 51, light: 46, name: { en: "Raspberry", th: "แดงราสป์เบอร์รี" }, isNeutral: false, undertone: "cool", seasons: ["winter"], formality: 1 },

  // Oranges
  { id: "terracotta", hex: "#C1633B", hue: 18, sat: 53, light: 49, name: { en: "Terracotta", th: "ดินเผา" }, isNeutral: false, undertone: "warm", seasons: ["autumn"], formality: 1 },
  { id: "burnt-orange", hex: "#B4531F", hue: 23, sat: 70, light: 41, name: { en: "Burnt Orange", th: "ส้มไหม้" }, isNeutral: false, undertone: "warm", seasons: ["autumn"], formality: 1 },
  { id: "apricot", hex: "#E9A468", hue: 29, sat: 73, light: 68, name: { en: "Apricot", th: "แอปริคอต" }, isNeutral: false, undertone: "warm", seasons: ["spring"], formality: 0 },
  { id: "rust", hex: "#8F4321", hue: 19, sat: 62, light: 33, name: { en: "Rust", th: "สนิม" }, isNeutral: false, undertone: "warm", seasons: ["autumn"], formality: 2 },

  // Yellows
  { id: "butter-yellow", hex: "#EBCB6B", hue: 46, sat: 72, light: 68, name: { en: "Butter Yellow", th: "เหลืองเนย" }, isNeutral: false, undertone: "warm", seasons: ["spring"], formality: 0 },
  { id: "mustard", hex: "#C99A2E", hue: 42, sat: 63, light: 47, name: { en: "Mustard", th: "เหลืองมัสตาร์ด" }, isNeutral: false, undertone: "warm", seasons: ["autumn"], formality: 1 },
  { id: "honey", hex: "#D9A93E", hue: 40, sat: 62, light: 56, name: { en: "Honey", th: "สีน้ำผึ้ง" }, isNeutral: false, undertone: "warm", seasons: ["autumn", "spring"], formality: 1 },
  { id: "lemon-ice", hex: "#F0E29A", hue: 51, sat: 66, light: 79, name: { en: "Lemon Ice", th: "เหลืองมะนาวอ่อน" }, isNeutral: false, undertone: "cool", seasons: ["summer"], formality: 0 },

  // Greens
  { id: "olive", hex: "#6B6A2F", hue: 60, sat: 39, light: 30, name: { en: "Olive", th: "เขียวมะกอก" }, isNeutral: false, undertone: "warm", seasons: ["autumn"], formality: 2 },
  { id: "sage-green", hex: "#8A9A7E", hue: 96, sat: 14, light: 56, name: { en: "Sage", th: "เขียวเสจ" }, isNeutral: false, undertone: "cool", seasons: ["summer"], formality: 1 },
  { id: "forest", hex: "#28422F", hue: 130, sat: 25, light: 20, name: { en: "Forest Green", th: "เขียวป่า" }, isNeutral: false, undertone: "cool", seasons: ["winter", "autumn"], formality: 3 },
  { id: "moss-green", hex: "#4C6B4A", hue: 116, sat: 18, light: 34, name: { en: "Moss", th: "เขียวมอส" }, isNeutral: false, undertone: "warm", seasons: ["autumn"], formality: 2 },
  { id: "mint", hex: "#A9CBB7", hue: 149, sat: 26, light: 76, name: { en: "Mint", th: "มินต์" }, isNeutral: false, undertone: "cool", seasons: ["spring"], formality: 0 },
  { id: "emerald", hex: "#1F6B4D", hue: 155, sat: 55, light: 27, name: { en: "Emerald", th: "มรกต" }, isNeutral: false, undertone: "cool", seasons: ["winter"], formality: 3 },

  // Blues
  { id: "denim", hex: "#4A6B8A", hue: 209, sat: 32, light: 42, name: { en: "Denim Blue", th: "น้ำเงินยีนส์" }, isNeutral: false, undertone: "cool", seasons: ["summer"], formality: 1 },
  { id: "cobalt", hex: "#2A4E8C", hue: 219, sat: 53, light: 35, name: { en: "Cobalt", th: "โคบอลต์" }, isNeutral: false, undertone: "cool", seasons: ["winter"], formality: 2 },
  { id: "sky", hex: "#8FB6D9", hue: 205, sat: 47, light: 71, name: { en: "Sky Blue", th: "ฟ้าคราม" }, isNeutral: false, undertone: "cool", seasons: ["spring", "summer"], formality: 0 },
  { id: "teal", hex: "#2C6E71", hue: 183, sat: 45, light: 30, name: { en: "Teal", th: "เขียวน้ำทะเล" }, isNeutral: false, undertone: "cool", seasons: ["winter"], formality: 2 },
  { id: "powder-blue", hex: "#C3D6E3", hue: 203, sat: 33, light: 84, name: { en: "Powder Blue", th: "ฟ้าพาสเทล" }, isNeutral: false, undertone: "cool", seasons: ["summer"], formality: 1 },
  { id: "midnight", hex: "#15243D", hue: 216, sat: 45, light: 16, name: { en: "Midnight Blue", th: "น้ำเงินยามค่ำ" }, isNeutral: false, undertone: "cool", seasons: ["winter"], formality: 3 },

  // Purples
  { id: "plum", hex: "#5B3A56", hue: 305, sat: 22, light: 28, name: { en: "Plum", th: "ม่วงพลัม" }, isNeutral: false, undertone: "cool", seasons: ["winter"], formality: 2 },
  { id: "lavender", hex: "#B7A7CC", hue: 267, sat: 25, light: 76, name: { en: "Lavender", th: "ลาเวนเดอร์" }, isNeutral: false, undertone: "cool", seasons: ["summer"], formality: 1 },
  { id: "eggplant", hex: "#3E2340", hue: 288, sat: 30, light: 19, name: { en: "Eggplant", th: "ม่วงมะเขือ" }, isNeutral: false, undertone: "cool", seasons: ["winter"], formality: 3 },
  { id: "orchid", hex: "#9A6B9E", hue: 296, sat: 22, light: 53, name: { en: "Orchid", th: "ม่วงกล้วยไม้" }, isNeutral: false, undertone: "cool", seasons: ["spring"], formality: 1 },

  // Browns
  { id: "camel", hex: "#B98F5C", hue: 32, sat: 42, light: 53, name: { en: "Camel", th: "สีอูฐ" }, isNeutral: false, undertone: "warm", seasons: ["autumn"], formality: 2 },
  { id: "chocolate", hex: "#4E3524", hue: 22, sat: 37, light: 22, name: { en: "Chocolate", th: "ช็อกโกแลต" }, isNeutral: false, undertone: "warm", seasons: ["autumn"], formality: 2 },
  { id: "chestnut", hex: "#6E3B2A", hue: 15, sat: 44, light: 30, name: { en: "Chestnut", th: "เกาลัด" }, isNeutral: false, undertone: "warm", seasons: ["autumn"], formality: 2 },
];

export function findColor(id: string): PaletteColor {
  const found = PALETTE.find((c) => c.id === id);
  if (!found) return PALETTE[0];
  return found;
}

export function hueDistance(a: number, b: number): number {
  const d = Math.abs(a - b) % 360;
  return d > 180 ? 360 - d : d;
}
