import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#373455",
        muted: "#666666",
        line: "#E3E3E3",
        // The HR app's sidebar, so the two read as one product. Its brand
        // colours were already identical to these — #5B193F, #373455, #E3E3E3 —
        // and the rail was the only real difference between them.
        sidebar: {
          DEFAULT: "#1C1620",
          ink: "#D9D2DC",
          accent: "#3A2430",
          active: "#F3CFE0",
          line: "#2C2430"
        },
        brand: {
          risk: "#FFBD59",
          late: "#FF5757",
          green: "#10BB82"
        },
        lab: {
          navy: "#373455",
          blue: "#777DA7",
          cyan: "#6BAEAD",
          green: "#10BB82",
          amber: "#9A6A24",
          red: "#A23146",
          purple: "#7B1E7A",
          burgundy: "#5B193F",
          mist: "#E6F8F6",
          porcelain: "#F3F7F3",
          steel: "#BDC8D0",
          /**
           * Steel laid over white at 28%, pre-resolved.
           *
           * The header band of every register, where it has to be opaque: a
           * sticky header is scrolled under, and an alpha tint would let the
           * rows show through it. Kept beside the colour it comes from so the
           * two stay in step if either is ever changed.
           */
          steelwash: "#EDF0F2",
          cream: "#F6EFE4",
          sand: "#E9D8BE",
          terracotta: "#C7744A",
          olive: "#7C7D4E",
          gold: "#D8A13B"
        }
      },
      boxShadow: {
        soft: "0 16px 34px rgba(55, 52, 85, 0.12)",
        card: "0 24px 48px rgba(91, 25, 63, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
