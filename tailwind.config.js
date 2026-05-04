/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}", "./src/features/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        lumen: {
          bg: "#0A0B12",
          card: "#11131C",
          border: "rgba(255,255,255,0.08)",
          secondary: "#8B8D98",
          violet: "#8B5CF6",
          indigo: "#6366F1",
          cyan: "#06B6D4",
          mint: "#34D399",
          amber: "#FBBF24",
          coral: "#FB7185",
        },
      },
    },
  },
  plugins: [],
};
