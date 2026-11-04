import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: { serif: ["Georgia", "serif"], sans: ["system-ui", "sans-serif"] },
      colors: { ink: "#111827", cream: "#FAF7F2", accent: "#0F766E" }
    }
  },
  plugins: []
} satisfies Config;
