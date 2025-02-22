import globals from "globals";
import pluginJs from "@eslint/js";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {
    ignores: ["node_modules/"],
    languageOptions: {
      globals: globals.browser,
      ecmaVersion: "latest",
      sourceType: "module",
    },
  },
  pluginJs.configs.recommended,
  {
    rules: {
      "no-console": "warn",
      "no-var": "error",
      "prefer-const": "error",
      "arrow-body-style": ["error", "as-needed"],
      "max-len": ["error", { code: 100 }],
      "linebreak-style": ["error", "unix"],
    },
  },
  prettierConfig,
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      "prettier/prettier": "error",
    },
  },
];
