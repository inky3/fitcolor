export type StyleId =
  | "streetwear"
  | "minimalist"
  | "oldMoney"
  | "vintage"
  | "grunge"
  | "athleisure"
  | "formal"
  | "boho";

export interface StyleArchetype {
  id: StyleId;
  name: { en: string; th: string };
  formalityRange: [number, number];
  textures: { en: string[]; th: string[] };
  silhouette: { en: string; th: string };
}

export const STYLES: StyleArchetype[] = [
  {
    id: "streetwear",
    name: { en: "Streetwear", th: "สตรีทแวร์" },
    formalityRange: [0, 1],
    textures: { en: ["boxy", "graphic", "layered"], th: ["ทรงกล่อง", "ลายกราฟิก", "หลายชั้น"] },
    silhouette: { en: "loose top + loose bottom", th: "เสื้อหลวม + กางเกงหลวม" },
  },
  {
    id: "minimalist",
    name: { en: "Minimalist", th: "มินิมอล" },
    formalityRange: [1, 2],
    textures: { en: ["clean", "matte", "unstructured"], th: ["เรียบ", "ด้าน", "ไม่มีโครงสร้าง"] },
    silhouette: { en: "fitted top + straight bottom", th: "เสื้อพอดีตัว + กางเกงทรงตรง" },
  },
  {
    id: "oldMoney",
    name: { en: "Old Money / Preppy", th: "โอลด์มันนี่ / พรีปปี้" },
    formalityRange: [2, 3],
    textures: { en: ["knit", "tailored", "crisp"], th: ["ถัก", "ตัดเย็บดี", "เนี้ยบ"] },
    silhouette: { en: "fitted top + tailored bottom", th: "เสื้อพอดีตัว + กางเกงทรงสูท" },
  },
  {
    id: "vintage",
    name: { en: "Vintage", th: "วินเทจ" },
    formalityRange: [1, 2],
    textures: { en: ["worn-in", "corduroy", "faded"], th: ["เนื้อผ้าเก่า", "ลูกฟูก", "สีซีด"] },
    silhouette: { en: "loose top + fitted bottom", th: "เสื้อหลวม + กางเกงพอดีตัว" },
  },
  {
    id: "grunge",
    name: { en: "Grunge", th: "กรันจ์" },
    formalityRange: [0, 1],
    textures: { en: ["distressed", "flannel", "layered"], th: ["ขาดวิ่น", "ผ้าฟลานเนล", "หลายชั้น"] },
    silhouette: { en: "loose top + fitted bottom", th: "เสื้อหลวม + กางเกงพอดีตัว" },
  },
  {
    id: "athleisure",
    name: { en: "Athleisure", th: "แอธเลชัวร์" },
    formalityRange: [0, 1],
    textures: { en: ["technical", "stretch", "sporty"], th: ["ผ้าเทคนิค", "ยืดหยุ่น", "สปอร์ต"] },
    silhouette: { en: "fitted top + loose bottom", th: "เสื้อพอดีตัว + กางเกงหลวม" },
  },
  {
    id: "formal",
    name: { en: "Formal", th: "ทางการ" },
    formalityRange: [3, 3],
    textures: { en: ["tailored", "structured", "polished"], th: ["ตัดเย็บดี", "มีโครงสร้าง", "ขัดเงา"] },
    silhouette: { en: "fitted top + tailored bottom", th: "เสื้อพอดีตัว + กางเกงทรงสูท" },
  },
  {
    id: "boho",
    name: { en: "Boho", th: "โบโฮ" },
    formalityRange: [0, 1],
    textures: { en: ["flowy", "textured", "layered"], th: ["พลิ้ว", "มีลวดลาย", "หลายชั้น"] },
    silhouette: { en: "loose top + loose bottom", th: "เสื้อหลวม + กางเกงหลวม" },
  },
];

export function findStyle(id: StyleId): StyleArchetype {
  return STYLES.find((s) => s.id === id) ?? STYLES[0];
}

export function blendFormalityRange(a: StyleArchetype, b: StyleArchetype, mix: number): [number, number] {
  const lo = a.formalityRange[0] + (b.formalityRange[0] - a.formalityRange[0]) * mix;
  const hi = a.formalityRange[1] + (b.formalityRange[1] - a.formalityRange[1]) * mix;
  return [Math.round(lo), Math.round(hi)];
}
