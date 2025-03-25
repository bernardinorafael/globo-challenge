/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {import("prettier").Config}
 */
const config = {
  endOfLine: "auto",
  semi: false,
  singleQuote: false,
  printWidth: 90,
  arrowParens: "always",
  tabWidth: 2,
  trailingComma: "es5",

  importOrder: [
    "^(react/(.*)$)|^(react$)",
    "",
    "<THIRD_PARTY_MODULES>",
    "",
    "^types$",
    "^@/components/(.*)$",
    "^@/context/(.*)$",
    "^@/hooks/(.*)$",
    "^@/layout/(.*)$",
    "^@/modules/(.*)$",
    "^@/types/(.*)$",
    "^@/util/(.*)$",
    "^@/lib/(.*)$",
    "",
    "^[./]",
  ],
  importOrderSortSpecifiers: true,
  importOrderBuiltinModulesToTop: true,
  importOrderMergeDuplicateImports: true,
  importOrderCombineTypeAndValueImports: true,

  plugins: [
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],

  tailwindFunctions: ["tv", "clsx"],
  tailwindAttributes: ["cn"],
};

module.exports = config;
