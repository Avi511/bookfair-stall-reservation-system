/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        secondary: "var(--color-secondary)",
        accent: "var(--color-accent)",
        background: "var(--color-background)",
        dark: "var(--color-dark)",
        blue: {
          50: "#f4f7fc",
          100: "#e6eef9",
          200: "#c9d8f2",
          300: "#a5bde7",
          400: "#7899d7",
          500: "#4f76c6",
          600: "#395ead",
          700: "#2b4a8c",
          800: "#213c70",
          900: "#1a305a",
          950: "#0f1e3b",
        },
      },
    },
  },
  plugins: [],
};
