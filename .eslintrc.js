module.exports = {
  root: true,

  env: {
    node: true
  },

  extends: [
    'plugin:vue/essential',
    '@vue/standard',
    '@vue/typescript/recommended',
  ],

  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      legacyDecorators: true
    }
  },

  rules: {
    'no-console': 'off',
    'no-debugger': 'off',
    'no-useless-constructor': 'warn',
    'space-before-function-paren': 0,
    'vue/no-unused-components': 'warn',
    'vue/no-unused-vars': 'warn',
    '@typescript-eslint/no-empty-function': 'warn',
    '@typescript-eslint/no-useless-constructor': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-var-requires': 'warn',
    'object-curly-spacing': ["off", "never"],
    'camelcase': 'off',
    'dot-notation': 'warn',
    'handle-callback-err': 'warn',
    'no-unused-expressions': 'warn',
    'padded-blocks': 'off'
  }
}
