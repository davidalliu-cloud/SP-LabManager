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
          /*
           * The two secondary surfaces, retuned from cyan and green into the
           * steel family. They are used 27 and 233 times as neutral fills —
           * section bands, totals rows, info panels — and once the page itself
           * went steel their old casts read as a faint colour error rather
           * than as a choice. Same lightness, so nothing moved but the hue.
           */
          mist: "#DCE6EB",
          porcelain: "#F1F5F7",
          /**
           * The structural colour of the app, in four weights.
           *
           * Everything used to sit on #FAFAFA, which is near enough to white
           * that nothing on it had an edge. These give the interface a spine:
           * a ground to sit on, a band for the header of a register, a rule to
           * close it, and a wash between the two for secondary surfaces.
           *
           * All are pre-resolved rather than alpha tints, because the register
           * headers are sticky and are scrolled under — an alpha band would
           * let the rows show through it.
           */
          steel: "#BDC8D0",
          /** Steel at 42% over white: the page itself. */
          ground: "#E6ECEF",
          /** Steel at 28%: panels and totals rows, a step above the ground. */
          steelwash: "#EDF0F2",
          /** A shade down from steel, for the rule that closes a band off. */
          slate: "#A3B1BC",
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
