/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary-color)",
        "primary-dim": "var(--primary-dim)",
        "primary-deep": "var(--primary-deep)",
        ink: {
          DEFAULT: "var(--ink)",
          2: "var(--ink-2)",
          3: "var(--ink-3)",
        },
        line: {
          DEFAULT: "var(--line)",
          strong: "var(--line-strong)",
        },
        muted: "var(--text-muted)",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "Helvetica Neue", "Arial", "sans-serif"],
        sans: ["Lato", "Helvetica Neue", "Arial", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "SFMono-Regular", "monospace"],
      },
    },
  },
  plugins: [],
};
