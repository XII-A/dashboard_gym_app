/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        bgColor: {
          primary: "#212529",
          secondary: "#0D1013",
          trinary: "#495057",
        },
        blue: {
          default: "#017EA7",
          dark: "#003459",
          light: "#06B6D4",
          text: "#00A8E8",
        },
      },
      fontFamily: {
        manrope: ["Manrope", "sans-serif"],
      },
    },
  },
  plugins: [],
};
