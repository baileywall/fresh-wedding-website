import { type Config } from "tailwindcss";

export default {
  content: ["{routes,islands,components}/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["ui-sans-serif"],
        serif: ["ui-serif"],
        mono: ["ui-monospace"],
        merriweather: ["Merriweather"],
        script: ["DancingScript"],
      },
      colors: {
        "tree-green": "#12340E",
      },
    },
  },
} satisfies Config;
