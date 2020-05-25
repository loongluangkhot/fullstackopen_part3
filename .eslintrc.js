module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
  },
  extends: "airbnb",
  globals: {
    Atomics: "readonly",
    SharedArrayBuffer: "readonly",
  },
  parserOptions: {
    ecmaVersion: 2018,
  },
  rules: {
    quotes: [
      "error",
      "double",
      { avoidEscape: true, allowTemplateLiterals: true },
    ],
    "no-underscore-dangle": ["error", { allow: ["_id", "__v"] }],
  },
};
