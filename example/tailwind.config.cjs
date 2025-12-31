/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "Manrope", "Inter", "system-ui", "-apple-system", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ["JetBrains Mono", "SFMono-Regular", "Menlo", "monospace"],
      },
      colors: {
        midnight: {
          900: "#0a0f1f",
          800: "#0d1428",
        },
        neon: {
          400: "#22d3ee",
          500: "#3b82f6",
        },
      },
      boxShadow: {
        card: "0 20px 60px rgba(15, 23, 42, 0.32)",
        glow: "0 10px 40px rgba(34, 211, 238, 0.15)",
      },
      backgroundImage: {
        grid: "radial-gradient(circle, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
