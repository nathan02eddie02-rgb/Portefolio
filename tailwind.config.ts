import type { Config } from "tailwindcss";

// Thème « ardoise » : sombre mais pas noir. Noms de tokens conservés (l'admin les utilise).
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#1B2435",
        surface: "#232E44",
        surface2: "#1F293C",
        line: "#33415B",
        text: "#EEF2F8",
        muted: "#A7B4C8",
        signal: "#4DB3FF",
        pbi: "#4DB3FF"
      },
      fontFamily: {
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        body: ["var(--font-body)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"]
      },
      maxWidth: { prose: "68ch" }
    }
  },
  plugins: []
};
export default config;
