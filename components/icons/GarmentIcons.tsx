import React from "react";

type IconProps = { className?: string; style?: React.CSSProperties };

// All icons share a 48x48 viewBox, 1.5px stroke, rounded joins — one visual family.
const base = "stroke-current fill-none";
const strokeProps = { strokeWidth: 1.6, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };

export function TopIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style}>
      <path
        className={base}
        {...strokeProps}
        d="M17 8 L11 12 L6 19 L11 23 L14 20 L14 40 Q14 42 16 42 L32 42 Q34 42 34 40 L34 20 L37 23 L42 19 L37 12 L31 8 Q28 11 24 11 Q20 11 17 8 Z"
      />
    </svg>
  );
}

export function BottomIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style}>
      <path
        className={base}
        {...strokeProps}
        d="M14 8 H34 L35 24 L38 41 Q38 42 37 42 H30 Q29 42 29 41 L26 24 L24 24 L22 41 Q22 42 21 42 H14 Q13 42 13 41 L16 24 Z"
      />
    </svg>
  );
}

export function OuterwearIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style}>
      <path
        className={base}
        {...strokeProps}
        d="M16 7 L10 11 L5 18 L10 22 L13 19 L13 41 Q13 42 14 42 H21 V24 H24 M32 7 L38 11 L43 18 L38 22 L35 19 L35 41 Q35 42 34 42 H27 V24 H24 M16 7 Q20 10 24 10 Q28 10 32 7 M21 24 V15 M27 24 V15"
      />
    </svg>
  );
}

export function ShoesIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style}>
      <path
        className={base}
        {...strokeProps}
        d="M6 33 Q6 28 11 27 L20 25 Q22 24 23 22 L26 17 Q27 15 29 16 L31 17 Q30 20 32 22 L40 27 Q43 28 43 32 V34 Q43 36 41 36 H8 Q6 36 6 34 Z M14 27 L15 21 M20 25 L20 20"
      />
    </svg>
  );
}

export function AccessoryIcon({ className, style }: IconProps) {
  return (
    <svg viewBox="0 0 48 48" className={className} style={style}>
      <circle className={base} {...strokeProps} cx="24" cy="17" r="9" />
      <path className={base} {...strokeProps} d="M24 26 L18 41 L24 38 L30 41 Z" />
    </svg>
  );
}

export const SLOT_ICONS = {
  top: TopIcon,
  bottom: BottomIcon,
  outerwear: OuterwearIcon,
  shoes: ShoesIcon,
  accessory: AccessoryIcon,
} as const;
