/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#005461",    // Deep Teal
        secondary: "#018790",  // Muted Teal
        accent: "#00B7B5",     // Bright Teal
        background: "#F4F4F4", // Off-White
      },
    },
  },
  plugins: [],
};
