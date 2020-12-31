module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'airbnb-base',
    'plugin:prettier/recommended',
    'prettier',
  ],
  env: {
    browser: true,
    node: true,
    commonjs: true,
    es6: true,
    es2017: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  rules: {
    'no-shadow': [
      'error',
      {
        allow: ['req', 'res', 'err'],
      },
    ],
    camelcase: 'off',
    eqeqeq: 'off',
    radix: 'off',
    'no-plusplus': 'off',
    'no-console': 'off',
    'consistent-return': 0,
    'implicit-arrow-linebreak': ['off'],
    'prettier/prettier': ['warn'],
  },
};
