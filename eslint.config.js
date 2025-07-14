/* eslint-env node */

const path = require("path");

const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");
const importPlugin = require("eslint-plugin-import");
const eslintPluginPrettierRecommended = require("eslint-plugin-prettier/recommended");
const storybook = require("eslint-plugin-storybook");

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  importPlugin.flatConfigs.recommended,
  ...storybook.configs["flat/recommended"],
  {
    settings: {
      "import/resolver": {
        typescript: {
          /* eslint-disable no-undef */
          project: path.resolve(__dirname, "tsconfig.json"),
        },
      },
    },

    rules: {
      "prettier/prettier": "warn",
      // "@typescript-eslint/no-unused-vars": [
      //   "error",
      //   {
      //     argsIgnorePattern: "^_",
      //     caughtErrorsIgnorePattern: "^_",
      //     destructuredArrayIgnorePattern: "^_",
      //     varsIgnorePattern: "^_",
      //   },
      // ],
      "import/order": [
        "error",
        {
          named: true,
          "newlines-between": "always",
          groups: ["builtin", "external", "internal", "type"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
    ignores: ["dist/*", ".expo/*", "**/node_modules/*", ".storybook/*"],
  },
]);
