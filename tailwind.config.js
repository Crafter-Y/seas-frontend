const colors = {
  "seas-gray": "#d1d5db",
  "seas-dark-gray": "#e0e2e5",
  "seas-green": "#16a34a",
  "seas-red": "#f67e7e",
  "seas-yellow": "#fbbd23",
  "seas-blue": "#3882d6",
  "seas-light-gray": "#f6f7f9",
  "seas-settings-bg": "#f2f2f2",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx", "./.storybook/**/*.tsx", "./components/**/*.tsx"],
  presets: [require("nativewind/preset")],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        roboto: ["Roboto"],
      },
      backgroundColor: colors,
      textColor: colors,
      borderColor: colors,
    },
  },
  plugins: [],
};
