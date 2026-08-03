import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/features/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: "#040d18",
        primary: {
          DEFAULT: "#0a1f38",
          hover: "#0f2d4a",
        },
        accent: {
          DEFAULT: "#D4AF37",
          muted: "#E8D5A3",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        heading: ["var(--font-jakarta)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
