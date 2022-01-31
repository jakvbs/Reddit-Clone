module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: ['airbnb-base', 'plugin:prettier/recommended'],
    parserOptions: {
        ecmaVersion: 13,
        sourceType: 'module',
    },
    globals: {
        Atomics: 'readonly',
        SharedArrayBuffer: 'readonly',
    },
    ignorePatterns: ['node_modules'],
    rules: {
        'prettier/prettier': 'error',
        'class-methods-use-this': 'off',
        'no-param-reassign': 'off',
        camelcase: 'off',
        'no-unused-vars': ['warn', { argsIgnorePattern: 'next' }],
        'no-console': 'off',
        'no-underscore-dangle': 'off',
        'consistent-return': 'off',
        'import/prefer-default-export': 'off',
        'no-plusplus': 'off',
    },
};
