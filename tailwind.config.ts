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
        cream: "#FBF8F3",
        sand: "#F3EEE4",
        blush: "#F7E4E4",
        peach: "#FBE7D8",
        mint: "#DFF0E8",
        skytint: "#E1EEF6",
        lilac: "#EBE3F5",
        butter: "#FBF3D0",
        ink: "#3F3A36",
        cocoa: "#8A7F76",
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
