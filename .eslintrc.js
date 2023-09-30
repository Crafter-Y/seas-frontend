/* eslint-env node */
module.exports = exports = {
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended"],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  root: true,
  ignorePatterns: [
    "dist/**/*",
    "webpack.config.js",
    "tailwind.ts",
    "tailwind.config.js",
    "metro.config.js",
    "babel.config.js",
  ],
  rules: {
    "@typescript-eslint/no-explicit-any": "warn",
    indent: ["error", 2],
    semi: ["error", "always"],
    quotes: ["error", "double"],
  },
};
