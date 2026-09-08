export type OccasionId = "casual" | "work" | "formal" | "date" | "beach" | "nightOut" | "weekend";

export interface Occasion {
  id: OccasionId;
  name: { en: string; th: string };
  formalityRange: [number, number];
  note: { en: string; th: string };
}

export const OCCASIONS: Occasion[] = [
  {
    id: "casual",
    name: { en: "Casual", th: "ลำลอง" },
    formalityRange: [0, 1],
    note: { en: "Easy neutrals and approachable combinations.", th: "โทนสีเป็นกันเองและจับคู่ง่าย" },
  },
  {
    id: "work",
    name: { en: "Work", th: "ทำงาน" },
    formalityRange: [2, 3],
    note: { en: "Restrained, muted, and polished.", th: "โทนสีสงบ นุ่มนวล และดูเรียบร้อย" },
  },
  {
    id: "formal",
    name: { en: "Formal", th: "ทางการ" },
    formalityRange: [3, 3],
    note: { en: "Deep neutrals with classic contrast.", th: "โทนสีเข้มคลาสสิกและมีคอนทราสต์ชัดเจน" },
  },
  {
    id: "date",
    name: { en: "Date", th: "เดต" },
    formalityRange: [1, 2],
    note: { en: "Richer contrast and expressive accents.", th: "คอนทราสต์ชัดขึ้นและมีสีเด่นเป็นจุดสนใจ" },
  },
  {
    id: "beach",
    name: { en: "Beach", th: "ทะเล" },
    formalityRange: [0, 0],
    note: { en: "Lighter, brighter, and relaxed.", th: "โทนสีสว่าง สดใส และผ่อนคลาย" },
  },
  {
    id: "nightOut",
    name: { en: "Night out", th: "ปาร์ตี้กลางคืน" },
    formalityRange: [1, 2],
    note: { en: "Richer contrast and bolder accents.", th: "คอนทราสต์เข้มขึ้นและสีเด่นชัดเจน" },
  },
  {
    id: "weekend",
    name: { en: "Weekend", th: "วันหยุด" },
    formalityRange: [0, 1],
    note: { en: "Approachable neutrals for easy days.", th: "โทนสีสบาย ๆ เหมาะกับวันพักผ่อน" },
  },
];

export function findOccasion(id: OccasionId): Occasion {
  return OCCASIONS.find((o) => o.id === id) ?? OCCASIONS[0];
}
