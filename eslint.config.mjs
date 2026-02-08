import vuetify from 'eslint-config-vuetify'
import autoImport from './.eslintrc-auto-import.mjs'

// Transform auto-import globals from legacy format to flat config format
const autoImportGlobals = {
  languageOptions: {
    globals: autoImport.globals,
  },
}

export default vuetify(
  {
    vue: true,
    ts: true,
  },
  autoImportGlobals,
  {
    rules: {
      'no-useless-constructor': 'off',
      'no-use-before-define': 'off',
      '@typescript-eslint/no-namespace': 'off',
      '@typescript-eslint/no-redeclare': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/no-invalid-this': 'off',
      'unicorn/no-array-callback-reference': 'off',
      'unicorn/no-array-sort': 'off',
      'unicorn/prefer-array-some': 'off',
      'unicorn/prefer-code-point': 'off',
      'unicorn/prefer-string-slice': 'off',
      'unicorn/prefer-number-properties': 'off',
    },
  },
  {
    files: ['**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
      'vue/html-self-closing': 'off',
      'vue/html-closing-bracket-newline': 'off',
      'vue/attributes-order': 'off',
      'vue/custom-event-name-casing': 'off',
      'vue/require-explicit-emits': 'warn',
      'vue/no-template-shadow': 'warn',
    },
  },
  {
    ignores: ['node_modules/', 'dist/', '.husky/', 'tools/'],
  }
)
