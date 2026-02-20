module.exports = {
  env: {
    browser: true,
    es2021: true
  },
  extends: [
    'plugin:react/recommended',
    'standard-with-typescript',
    'plugin:i18next/recommended',
    'plugin:storybook/recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: ['./tsconfig.json']
  },
  plugins: [
    'react',
    'i18next',
    'react-hooks',
    'krasterisk-plugin',
    'unused-imports'
  ],
  rules: {
    indent: 'off',
    'react/jsx-indent': 'off',
    'react/jsx-indent-props': 'off',
    '@typescript-eslint/indent': 'off',
    '@typescript-eslint/comma-dangle': 'off',
    'comma-dangle': 'off',
    'no-trailing-spaces': 'off',
    '@typescript-eslint/prefer-ts-expect-error': 'off',
    'multiline-ternary': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    '@typescript-eslint/ban-ts-comment': 'off',
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    '@typescript-eslint/prefer-nullish-coalescing': 'off',
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    '@typescript-eslint/strict-boolean-expressions': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-floating-promises': 'off',
    '@typescript-eslint/naming-convention': 'off',
    '@typescript-eslint/consistent-type-imports': 'off',
    '@typescript-eslint/consistent-type-assertions': 'off',
    '@typescript-eslint/no-dynamic-delete': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/no-misused-promises': 'off',
    '@typescript-eslint/no-invalid-void-type': 'off',
    '@typescript-eslint/no-empty-interface': 'off',
    '@typescript-eslint/restrict-plus-operands': 'off',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'off',
    'react/display-name': 'off',
    'react/no-unescaped-entities': 'off',
    '@typescript-eslint/space-before-function-paren': 'off',
    '@typescript-eslint/prefer-optional-chain': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn', // useEffect dependency
    'i18next/no-literal-string': ['warn', {
      markupOnly: true,
      ignoreAttribute: ['data-testid', 'to', 'target', 'rel', 'type', 'variant', 'role', 'aria-label', 'placeholder', 'name', 'direction', 'size', 'align', 'justify', 'gap', 'wrap', 'component', 'edge', 'position']
    }],
    'krasterisk-plugin/path-checker': ['error', { alias: '@' }],
    'krasterisk-plugin/public-api-imports': [
      'error',
      {
        alias: '@',
        testFilesPatterns: ['**/*.test.*', '**/*.story.*', '**/StoreDecorator.tsx']
      }
    ],
    'krasterisk-plugin/layer-imports': [
      'error',
      {
        alias: '@',
        ignoreImportPatterns: ['**/StoreProvider', '**/testing', '**/getTokenData']
      }
    ],
    'unused-imports/no-unused-imports': 'error'
  },
  globals: {
    __IS_DEV__: true,
    __API__: true,
    __PROJECT__: true,
    __GOOGLE_CLIENT_ID__: true
  },
  overrides: [{
    files: ['**/src/**/*.{test,stories}.{ts,tsx}'],
    rules: {
      'i18next/no-literal-string': 'off'
    }
  }]
}
