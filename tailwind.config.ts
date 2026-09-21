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
        cream: "#131118",
        sand: "#2A2632",
        card: "#1E1B24",
        blush: "#2A1A1E",
        peach: "#2A2015",
        mint: "#152420",
        skytint: "#182530",
        lilac: "#211A2C",
        butter: "#2A2415",
        ink: "#F5F1EB",
        cocoa: "#A79FB0",
      },
      fontFamily: {
        sans: [
          "Nunito",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
      boxShadow: {
        soft: "0 2px 14px 0 rgba(120, 100, 90, 0.08)",
        card: "0 4px 20px 0 rgba(120, 100, 90, 0.10)",
      },
      keyframes: {
        pop: {
          "0%": { transform: "scale(1)" },
          "40%": { transform: "scale(1.12)" },
          "100%": { transform: "scale(1)" },
        },
        fadein: {
          "0%": { opacity: "0", transform: "translateY(4px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        pop: "pop 0.28s ease-out",
        fadein: "fadein 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
