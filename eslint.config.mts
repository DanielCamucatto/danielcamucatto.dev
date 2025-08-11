
import js from "@eslint/js";
import react from "eslint-plugin-react";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./frontend/tsconfig.eslint.json",
        ecmaVersion: 2020,
        sourceType: "module",
      },
    },
    plugins: {
      "@typescript-eslint": tseslint,
      react,
    },
    rules: {
      ...tseslint.configs.recommended.rules,
  ...react.configs.recommended.rules,
  'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: "detect",
        runtime: "automatic",
      },
    },
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    plugins: { react },
    rules: {
      ...react.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
    settings: {
      react: {
        version: "detect",
        runtime: "automatic",
      },
    },
  },
];
