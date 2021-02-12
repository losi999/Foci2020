module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    plugins: [
        '@typescript-eslint',
    ],
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-namespace': 'off',
        '@typescript-eslint/ban-types': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/ban-ts-comment': 'off',
        '@typescript-eslint/semi': 'error',
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/type-annotation-spacing': 'error',
        'curly': 'error',
        'eqeqeq': 'error',
        'no-else-return': 'error',
        'no-param-reassign': 'error',
        'no-return-await': 'error',
        '@typescript-eslint/comma-dangle': ['error', 'always-multiline'],
        'eol-last': 'error',
        'no-multiple-empty-lines': 'error',
        'no-plusplus': 'error',
        'object-property-newline': 'error',
        'object-curly-newline': ['error', {
            'ObjectExpression': {
                'minProperties': 1
            }
        }],
        'object-curly-spacing': ['error', 'always'],
        '@typescript-eslint/indent': ['error', 2],
        '@typescript-eslint/quotes': ["error", "single"],
        'prefer-template': 'error',
        '@typescript-eslint/no-extra-semi': 'error',
        'newline-per-chained-call': 'error',
        'space-before-blocks': 'error',
        'arrow-spacing': 'error',
        'key-spacing': 'error',
        'space-in-parens': 'error',
        'comma-spacing': 'error',
        'no-multi-spaces': 'error',
        'no-multiple-empty-lines': ['error', { max: 1 }],
        'array-bracket-newline': 'error',
        'array-element-newline': 'error',
        'quote-props': ['error', 'as-needed'],
    }
};