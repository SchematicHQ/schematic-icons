import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import importPlugin from "eslint-plugin-import";
import pluginReact from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    files: ["src/**/*.{js,mjs,cjs,ts,jsx,tsx}"],
    plugins: { js, pluginReact },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      importPlugin.flatConfigs.recommended,
      importPlugin.flatConfigs.typescript,
      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat["jsx-runtime"],
      reactHooks.configs["recommended-latest"],
    ],
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: globals.browser,
    },
    rules: {
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-unused-vars": [
        "error",
        { ignoreRestSiblings: true },
      ],
      "react/no-unescaped-entities": "off",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/no-duplicates": "error",
      "import/no-named-as-default": "off",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
            orderImportKind: "asc",
          },
          named: {
            enabled: true,
            types: "types-last",
          },
        },
      ],
    },
    settings: {
      "import/extensions": [".ts", ".tsx"],
      "import/resolver": {
        typescript: true,
        node: true,
      },
      react: {
        version: "detect",
      },
    },
  },
]);
