import globals from "globals";
import js from "@eslint/js";
import react from "eslint-plugin-react";

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Global config
  js.configs.recommended,
  {
    files: ["**/*.{js,mjs,jsx,cjs,ts,tsx}"],
    plugins: {
      react,
    },
    settings: {
      react: {
        version: "detect",
      },
    },
    rules: {
      "react/prop-types": "error",
    },
  },
  { languageOptions: { globals: globals.browser } },
  react.configs.flat.recommended,
  {
    ignores: ["dist/**", "build/**"],
  },
];
