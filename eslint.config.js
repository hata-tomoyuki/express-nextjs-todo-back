const eslintPluginPrettier = require("eslint-plugin-prettier");
const eslintPluginTypescript = require("@typescript-eslint/eslint-plugin");
const eslintParserTypescript = require("@typescript-eslint/parser");

const commonConfig = [
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: eslintParserTypescript,
    },
    plugins: {
      prettier: eslintPluginPrettier,
      "@typescript-eslint": eslintPluginTypescript,
    },
    rules: {
      "prettier/prettier": "error",
      "no-console": ["error", { allow: ["error"] }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          args: "all",
          argsIgnorePattern: "^_",
          ignoreRestSiblings: false,
        },
      ],
      "@typescript-eslint/no-unused-expressions": "error",
    },
  },
];

module.exports = commonConfig;
