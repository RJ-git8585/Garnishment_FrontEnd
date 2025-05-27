export default {
  env: {
    browser: true,
    es2021: true,
    node: true,
    jest: true // Add Jest environment
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended"
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 12,
    sourceType: "module"
  },
  plugins: ["react"],
  rules: {
    // Add any custom rules here
  }
};
