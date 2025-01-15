/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx", "./.storybook/**/*.tsx"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto"],
      },
      backgroundColor: {
        "seas-gray": "#d1d5db",
      },
    },
  },
  plugins: [],
};
