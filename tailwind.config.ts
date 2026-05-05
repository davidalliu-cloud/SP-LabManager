import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#373455",
        muted: "#6F7186",
        line: "#DCE3E6",
        lab: {
          navy: "#373455",
          blue: "#777DA7",
          cyan: "#6BAEAD",
          green: "#317A65",
          amber: "#9A6A24",
          red: "#A23146",
          purple: "#7B1E7A",
          burgundy: "#5B193F",
          mist: "#E6F8F6",
          porcelain: "#F3F7F3",
          steel: "#BDC8D0"
        }
      },
      boxShadow: {
        soft: "0 10px 28px rgba(55, 52, 85, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
