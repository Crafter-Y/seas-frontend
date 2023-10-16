/* eslint-env node */
module.exports = exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-native/all",
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "react", "react-native"],
  root: true,
  ignorePatterns: [
    "dist/**/*",
    "webpack.config.js",
    "tailwind.ts",
    "tailwind.config.js",
    "metro.config.js",
    "babel.config.js",
    "serve.js",
  ],
  rules: {
    semi: ["error", "always"],
    quotes: ["error", "double"],
    "sort-imports": [
      "error",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
        ignoreMemberSort: false,
        memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
        allowSeparatedGroups: false,
      },
    ],
    "@typescript-eslint/no-explicit-any": "warn",
    "react/react-in-jsx-scope": "off",
    "react-native/no-raw-text": "off",
    "react-native/no-inline-styles": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
  },
};
