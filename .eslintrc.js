/* eslint-env node */

const path = require("path");

/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: ["prettier", "expo", "plugin:eqeqeq-fix/recommended"],
  plugins: ["prettier", "import", "@limegrass/import-alias"],
  ignorePatterns: ["/dist/*"],
  settings: {
    "import/resolver": {
      typescript: {
        project: path.resolve(__dirname, "tsconfig.json"),
      },
    },
  },
  rules: {
    "prettier/prettier": "warn",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        caughtErrorsIgnorePattern: "^_",
        destructuredArrayIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
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
    "@limegrass/import-alias/import-alias": "error",
  },
};
