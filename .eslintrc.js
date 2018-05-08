module.exports = {
    root: true,
    parser: 'babel-eslint',
    plugins: [ 'babel' ],
    extends: [ 'peerio' ],
    rules: {
        'global-require': 0,
        'generator-star-spacing': 0,
        'react/prefer-stateless-function': 0,
        'react/jsx-filename-extension': 0,
        'react/sort-comp': 0,
        'react/require-default-props': 0,
        'react/no-array-index-key': 1,
        'react/prop-types': 0,
        'no-mixed-operators': 0,
        'new-cap': 0,
        'prefer-rest-params': 0,
        'no-multi-assign': 0,
        'no-unused-vars': 1,
        'react/no-array-index-key': 0,
        'max-len': 0,
        'space-before-function-paren': 0,
        'babel/semi': 1,
        'no-restricted-imports': [2, { paths: [{
            name: 'react-native',
            importNames: ['Text'],
            message: 'Do not use react-native Text, use custom-text instead'
        }] }]
    },
    globals: {
        'requestAnimationFrame': false,
        '__DEV__': false,
        '__PROD__': false
    }
};
