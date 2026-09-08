import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#F2EEE6",
          card: "#FBF9F4",
          dim: "#E7E1D3",
        },
        ink: {
          DEFAULT: "#22201B",
          soft: "#5B564C",
          faint: "#8B8577",
        },
        moss: {
          DEFAULT: "#2B4C43",
          light: "#3E6A5D",
          dark: "#1B322C",
        },
        charcoal: {
          DEFAULT: "#1C1A17",
          card: "#242119",
          line: "#38342B",
        },
        cream: {
          DEFAULT: "#EFEAE0",
          soft: "#B9B2A0",
        },
        sage: {
          DEFAULT: "#6FA893",
        },
        clay: {
          DEFAULT: "#B65C3C",
        },
      },
      fontFamily: {
        display: ["var(--font-display-active)", "serif"],
        body: ["var(--font-body-active)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "1.25rem",
        "2xl": "1.75rem",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.55" },
        },
        popIn: {
          "0%": { transform: "scale(0.96)", opacity: "0.6" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        flicker: "flicker 0.09s ease-in-out",
        popIn: "popIn 0.22s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
