module.exports = {
    root: true,
    extends: [
        '@react-native-community',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'prettier',
    ],
    plugins: ['@typescript-eslint', 'prettier'],
    rules: {
        'no-shadow': ['off'],
        '@typescript-eslint/ban-types': [
            'error',
            {
                types: {
                    null: {
                        message: 'Use undefined instead',
                        fixWith: 'undefined',
                    },
                },
            },
        ],
    },
};
