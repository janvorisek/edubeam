module.exports = {
  root: true,
  parser: "vue-eslint-parser",
  parserOptions: {
    parser: "@typescript-eslint/parser",
  },
  extends: ["plugin:vue/strongly-recommended", "eslint:recommended", "@vue/typescript/recommended", "prettier"],
  plugins: ["@typescript-eslint", "prettier"],
  rules: {
    "prettier/prettier": "error",
    "vue/valid-v-slot": "off",
    "vue/multi-word-component-names": "off",
    // not needed for vue 3
    "vue/no-multiple-template-root": "off",
    "vue/no-v-model-argument": "off",
  },
};
