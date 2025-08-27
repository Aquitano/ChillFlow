import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});


export default defineConfig([
    {
        plugins: { js },
        extends: compat.extends('eslint:recommended', 'next/core-web-vitals', 'next/typescript', 'plugin:react/recommended', 'plugin:drizzle/recommended'),
        languageOptions: { globals: { ...globals.browser, ...globals.node } },
        rules: {
            'react/react-in-jsx-scope': 'off',
        },
    },
]);
