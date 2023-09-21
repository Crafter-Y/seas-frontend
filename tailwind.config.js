/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.tsx"],
  darkMode: "class",
  theme: {
    extend: {}
  },
  plugins: [],
  corePlugins: require('tailwind-rn/unsupported-core-plugins'),
}
