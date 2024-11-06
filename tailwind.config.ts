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
        asparagus: "#7F9A6B",
        moonstone: "#61A7B7",
        caramel: "#D47D4C",
        "light-blue": "#B0D2D9",
        "sandy-brown": "#F4A259",
        "bittersweet-shimmer": "#BC4B51",
        "mountbatten-pink": "#987284",
        eggplant: "#6C464E",
        "eggplant-light": "#6c464e40",
      },
    },
  },
} satisfies Config;
