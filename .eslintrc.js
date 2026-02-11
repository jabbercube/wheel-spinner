/*
Copyright 2020 Google LLC

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    https://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
    mocha: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/recommended'
  ],
  parserOptions: {
    parser: '@babel/eslint-parser',
    ecmaVersion: 2021,
    sourceType: 'module',
    requireConfigFile: true,
    babelOptions: {
      configFile: './babel.config.js'
    }
  },
  plugins: ['vue'],
  globals: {
    // External libraries loaded via script tags
    'gapi': 'readonly',
    'google': 'readonly',
    'ga': 'readonly',
    'Howl': 'readonly'
  },
  rules: {
    // Relax rules for existing codebase
    'vue/multi-word-component-names': 'off',
    'vue/no-v-html': 'warn',
    'vue/require-default-prop': 'off',
    'vue/require-prop-types': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/attributes-order': 'off',
    'vue/order-in-components': 'off',
    'vue/html-closing-bracket-spacing': 'off',
    'vue/mustache-interpolation-spacing': 'off',
    'vue/singleline-html-element-content-newline': 'off',
    'vue/no-mutating-props': 'warn',
    'vue/require-v-for-key': 'warn',
    'vue/valid-v-for': 'warn',
    'vue/no-unused-components': 'warn',
    'vue/return-in-computed-property': 'warn',
    'vue/no-dupe-keys': 'warn',
    'vue/html-indent': 'off',
    'vue/html-self-closing': 'off',
    'no-console': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'warn',
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-prototype-builtins': 'warn',
    'no-constant-condition': 'warn',
    'no-useless-escape': 'warn',
    'no-async-promise-executor': 'warn',
    'no-extra-semi': 'warn',
    'no-empty': 'warn',
    'no-dupe-keys': 'warn'
  },
  ignorePatterns: [
    'dist/**',
    'build/**',
    'node_modules/**',
    'coverage/**',
    '*.config.js',
    '.nyc_output/**'
  ]
};
