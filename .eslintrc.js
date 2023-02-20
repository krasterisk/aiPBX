module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: ['plugin:react/recommended', 'standard-with-typescript', 'plugin:i18next/recommended', 'plugin:storybook/recommended'],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json']
  },
  plugins: [
    'react',
    'i18next',
    'react-hooks'
  ],
  rules: {
    'react/jsx-indent': [2, 4],
    '@typescript-eslint/indent': [2, 4],
    'react/jsx-indent-props': [2, 4],
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    'no-unused-vars': 'warn',
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    'react/display-name': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error', // useEffect dependency
    'i18next/no-literal-string': ['error', {
      markupOnly: true,
      ignoreAttribute: ['data-testid']
    }]
  },
  globals: {
    __IS_DEV__: true
  },
  overrides: [{
    files: ['**/src/**/*.test.{ts.tsx}'],
    rules: {
      'i18next/no-literal-string': 'off'
    }
  }, {
    files: ['.eslintrc.js'],
    rules: {
      '@typescript-eslint/indent': 'off'
    }
  }]
}
