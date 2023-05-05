module.exports = {
    env: {
        es2021: true,
        node: true,
    },
    extends: 'standard',
    overrides: [],
    parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
    },
    rules: {
        indent: ['error', 4, { SwitchCase: 1 }],
        semi: ['error', 'always'],
        'comma-dangle': ['error', 'always-multiline'],
        'space-before-function-paren': 'off',
        // camelcase: ['error', { ignore_properties: '^fk_' }],
    },
};
