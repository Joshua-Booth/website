const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./src/**/*.{astro,html,js,jsx,md,svelte,ts,tsx,vue}"],
  theme: {
    extend: {
      colors: {
        primary: colors.blue,
        secondary: colors.pink,
        gray: {
          50: "#ECEDEF",
          100: "#D6D8DC",
          200: "#ADB0B8",
          300: "#838995",
          400: "#5E636E",
          500: "#3C3F46",
          600: "#2F3137",
          700: "#232529",
          800: "#18191B",
          900: "#0C0C0E",
        },
      },
      fontFamily: {
        sans: ["'Albert Sans'", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
  darkMode: "class",
};
