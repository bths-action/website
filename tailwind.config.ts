import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      screens: {
        xs: "475px",
        xxs: "320px",
      },

      fontFamily: {
        figtree: ["var(--font-figtree)"],
        "space-mono": ["var(--font-space-mono)"],
        poppins: ["var(--font-poppins)"],
      },
      colors: {
        default: "#19b1a0",
        "default-darker": "#138679",
        "default-lighter": "#19b3a1",
      },
    },
  },
  plugins: [],
};
export default config;
