/** @format */

try {
  module.exports = [
    {
      files: ['**/*.{js,jsx,ts,tsx,json}'],
      plugins: {
        '@typescript-eslint': require('@typescript-eslint/eslint-plugin'),
        react: require('eslint-plugin-react'),
        'react-hooks': require('eslint-plugin-react-hooks'),
      },
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:react-hooks/recommended',
      ],
      parser: require.resolve('@typescript-eslint/parser'),
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: {
          jsx: true,
        },
        project: ['./tsconfig.json'],
      },
      env: {
        browser: true,
        es2022: true,
        node: true,
      },
      globals: {
        React: 'writable',
        JSX: true,
        globalThis: 'readonly',
      },
      rules: {
        'no-unused-vars': 'warn',
        'no-console': 'warn',
        'react/prop-types': 'off',
        'react/react-in-jsx-scope': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'warn',
        '@typescript-eslint/no-unused-vars': 'warn',
        '@typescript-eslint/no-shadow': 'warn',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn',
        'no-shadow': 'off',
        'prettier/prettier': 'off',
      },
      settings: {
        react: {
          version: 'detect',
        },
      },
    },
    {
      files: ['**/*.ts', '**/*.tsx'],
      rules: {
        '@typescript-eslint/explicit-function-return-type': 'warn',
        '@typescript-eslint/explicit-module-boundary-types': 'warn',
      },
    },
  ];
} catch (error) {
  console.error('ESLint configuration error:', error);
  throw error;
}