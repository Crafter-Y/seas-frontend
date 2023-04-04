/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        lightgrayNeutral: "#F6F7F9",
        blueAccent: "#3882d6",
        lightgrayLight: "#fafafa"
      }
    },
  },
  plugins: [],
  corePlugins: require('tailwind-rn/unsupported-core-plugins'),
}
