import js from "@eslint/js";
import typescript from "@typescript-eslint/eslint-plugin";
import typescriptParser from "@typescript-eslint/parser";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import jsxA11y from "eslint-plugin-jsx-a11y";
import importPlugin from "eslint-plugin-import";
import unusedImports from "eslint-plugin-unused-imports";

const tsRecommended = typescript.configs.recommended ?? {};
const tsTypeChecked = typescript.configs["recommended-type-checked"] ?? {};

export default [
  js.configs.recommended,
  {
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        project: "./tsconfig.json",
        projectService: {
          noWarnOnMultipleProjects: true,
        },
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        localStorage: "readonly",
        performance: "readonly",
        fetch: "readonly",
        sessionStorage: "readonly",
        setTimeout: "readonly",
        setInterval: "readonly",
        clearTimeout: "readonly",
        clearInterval: "readonly",
        Promise: "readonly",
        process: "readonly",
        Buffer: "readonly",
        __dirname: "readonly",
        __filename: "readonly",
        global: "readonly",
        module: "readonly",
        require: "readonly",
        exports: "readonly",
      },
    },
    plugins: {
      "@typescript-eslint": typescript,
      react,
      "react-hooks": reactHooks,
      "jsx-a11y": jsxA11y,
      import: importPlugin,
      "unused-imports": unusedImports,
    },
    settings: {
      react: {
        version: "detect",
      },
      "import/resolver": {
        typescript: {
          project: ["tsconfig.json", "tsconfig.node.json"],
          noWarnOnMultipleProjects: true,
        },
      },
    },
    rules: {
      ...(tsRecommended.rules ?? {}),
      ...(tsTypeChecked.rules ?? {}),
      ...(react.configs.recommended?.rules ?? {}),
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/no-unescaped-entities": "warn",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "warn",
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/ban-ts-comment": "warn",
      "@typescript-eslint/no-empty-function": "warn",
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports" },
      ],
      "no-unused-vars": "off",
      "unused-imports/no-unused-imports": "error",
      "unused-imports/no-unused-vars": [
        "warn",
        { argsIgnorePattern: "^_", varsIgnorePattern: "^_" },
      ],
      "import/no-extraneous-dependencies": ["error", { packageDir: ["."] }],
      "import/order": [
        "warn",
        {
          "newlines-between": "always",
          alphabetize: { order: "asc", caseInsensitive: true },
        },
      ],
      "import/no-cycle": ["error", { maxDepth: 1 }],
      "no-console": ["error", { allow: ["error", "warn"] }],
      "no-debugger": "error",
      "no-alert": "error",
      "prefer-const": "error",
      "no-var": "error",
      eqeqeq: ["error", "always", { null: "ignore" }],
      curly: ["error", "all"],
      "jsx-a11y/anchor-is-valid": "warn",
    },
  }, // Test overrides
  {
    files: ["tests/**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: typescriptParser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        project: "./tsconfig.json",
      },
      globals: {
        window: "readonly",
        document: "readonly",
        navigator: "readonly",
        console: "readonly",
        performance: "readonly",
        fetch: "readonly",
      },
    },
    rules: {
      "no-console": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/require-await": "off",
    },
  }, // Unit test overrides inside src
  {
    files: ["src/**/*.{test,spec}.{ts,tsx}"],
    rules: {
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-empty-function": "off",
      "import/order": "off",
    },
  }, // Test utilities under src/test
  {
    files: ["src/test/**/*.{ts,tsx}"],
    rules: {
      "no-console": "off",
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/restrict-template-expressions": "off",
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-return": "off",
      "@typescript-eslint/require-await": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-unnecessary-type-assertion": "off",
      "import/order": "off",
    },
  },
  {
    ignores: [
      "dist/**",
      "build/**",
      "node_modules/**",
      "public/**",
      "coverage/**",
      "playwright-report/**",
      "test-results/**",
      "service-worker.js",
      ".archive-*.tsx",
      ".archive/**",
      ".dev/**",
      "scripts/**",
      "tests/**",
      "tools/**",
      "src/dataconnect-generated/**",
      "**/*.cjs",
      "**/*.stories.ts",
      "**/*.stories.tsx",
      "src/stories/**",
    ],
  },
];
