module.exports = {
  root: true,
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "plugin:prettier/recommended",
    "@vue/eslint-config-prettier",
  ],
  env: {
    "vue/setup-compiler-macros": true,
  },
  rules: {
    "vue/script-setup-no-uses-vars": "off",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_",
    }],
    'prettier/prettier': [
      'error', {
        "htmlWhitespaceSensitivity": "ignore"
      }
    ],
  },
  overrides: [
    {
      "files": ["src/pages/*.vue", "src/components/**/*.vue"],
      "rules": {
        "vue/multi-word-component-names": "off",
      }
    },
  ],
  globals: {
    "wp": "readable"
  }
};

