const en = {
  brand: "Fitcolor",
  tagline: "The coolors.co of getting dressed",
  nav: { generator: "Generator", favorites: "Favorites", howItWorks: "How it works" },

  slots: {
    top: "Top",
    bottom: "Bottom",
    outerwear: "Outerwear",
    shoes: "Shoes",
    accessory: "Accessory",
  },

  fit: { loose: "Loose", fitted: "Fitted" },

  randomize: "Randomize outfit",
  spaceHint: "Press space to randomize",
  lock: "Lock",
  unlock: "Unlock",
  locked: "Locked",

  harmony: {
    label: "Color harmony",
    monochromatic: "Monochromatic",
    analogous: "Analogous",
    complementary: "Complementary",
    triadic: "Triadic",
    neutralAccent: "Neutral + Accent",
    "60-30-10": "60 / 30 / 10",
    "50-50": "50 / 50",
  },

  showYourWork: {
    monochromatic: "This is a monochromatic palette: one hue in different shades keeps the outfit calm and unified.",
    analogous: "This is an analogous palette: neighboring hues create a calm, cohesive outfit.",
    complementary: "This is a complementary palette: opposite hues create bold, energizing contrast.",
    triadic: "This is a triadic palette: three evenly spaced hues stay balanced while feeling vibrant.",
    neutralAccent: "This is a neutral + accent palette: a quiet neutral base lets one accent color stand out.",
    "60-30-10": "This is a 60 / 30 / 10 split: a dominant base, a secondary layer, and a small accent.",
    "50-50": "This is a 50 / 50 split: two color groups balanced evenly across the outfit.",
  },

  settings: {
    title: "Settings",
    undertone: "Undertone",
    warm: "Warm",
    cool: "Cool",
    neutral: "Neutral",
    season: "Seasonal palette (optional)",
    seasonNone: "None",
    spring: "Spring",
    summer: "Summer",
    autumn: "Autumn",
    winter: "Winter",
    style: "Style",
    blend: "Blend with a second style",
    occasion: "Occasion",
    sound: "Sound on reroll",
    theme: "Dark mode",
    language: "Language",
    photoComingSoon: "Photo-based skin tone detection is coming soon.",
  },

  styles: {
    streetwear: "Streetwear",
    minimalist: "Minimalist",
    oldMoney: "Old Money / Preppy",
    vintage: "Vintage",
    grunge: "Grunge",
    athleisure: "Athleisure",
    formal: "Formal",
    boho: "Boho",
  },

  occasionsLabel: {
    casual: "Casual",
    work: "Work",
    formal: "Formal",
    date: "Date",
    beach: "Beach",
    nightOut: "Night out",
    weekend: "Weekend",
  },

  flatterBadge: {
    strongMatch: "A strong match for {undertone} undertones",
    flatters: "Flatters your tone",
  },

  honesty: {
    generator: "Helps you avoid clashing combinations — it doesn't guarantee a stylist-approved look.",
    coherence: "Built to help colors, proportions, and formality work together. It won't clash, but personal style is still yours.",
  },

  favorite: { save: "Save to favorites", saved: "Saved", remove: "Remove" },
  share: { copy: "Copy share link", copied: "Link copied" },

  favoritesPage: {
    title: "Favorites",
    subtitle: "Outfits you've saved on this device.",
    empty: "No favorites yet. Head to the generator and heart a combination you like.",
    goGenerate: "Go randomize an outfit",
    restore: "Restore",
    delete: "Delete",
    savedOn: "Saved",
  },

  howItWorksPage: {
    title: "How it works",
    subtitle: "The color theory behind every outfit Fitcolor builds.",
    honestyTitle: "Being honest with you",
    honestyBody:
      "Fitcolor helps you avoid clashing colors, uneven proportions, and mismatched formality. It does not guarantee a stylist-approved look — personal style is still yours to bring.",
    ratioTitle: "Ratio rules",
    ratio6030101: "60 / 30 / 10 — Dominant 60%: top + bottom. Secondary 30%: outerwear. Accent 10%: shoes + accessory.",
    ratio5050: "50 / 50 — Two intentionally balanced color groups spread evenly across the outfit.",
    undertoneTitle: "Undertone guidance",
    undertoneBody:
      "Warm, cool, and neutral undertones are guidance only. A badge may note a strong match, but no palette is ever off-limits.",
    harmonyTitle: "Harmony rules",
  },

  formality: { casual: "Casual", smart: "Smart casual", polished: "Polished", formal: "Formal" },

  footer: { madeWith: "A fast, free color tool. No account needed." },
};

export default en;
export type Dictionary = typeof en;
