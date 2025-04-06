import js from '@eslint/js';
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting';
import prettier from "eslint-plugin-prettier/recommended";
import pluginVue from 'eslint-plugin-vue';
import { createRequire } from 'node:module';

const autoImportRules = createRequire(import.meta.url)('./.eslintrc-auto-import.json');

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/essential'],
  skipFormatting,
  {
    languageOptions: {
      globals: {
        ...autoImportRules.globals,
        document: 'readonly',
        window: 'readonly'
      }
    },
    rules: {
      ...autoImportRules.rules
    }
  },
  {
    files: ["app/**/*.ts", "app/**/*.vue", "app/*.mjs", "app/**/*.js"],
    ...prettier,
  },
  {
    files: ["app/**/*.vue"],
    rules: {
      "prettier/prettier": ["error", { htmlWhitespaceSensitivity: "ignore" }],
    },
  },
  {
    files: ["app/pages/**/*.vue", "app/components/**/*.vue", "app/404.vue"],
    rules: {
      "vue/multi-word-component-names": "off",
    }
  },
  {
    files: ["app/components/*.vue"],
    rules: {
      "vue/multi-word-component-names": "error",
    }
  },
]
