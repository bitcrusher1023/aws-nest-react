module.exports = {
  extends: ['@busybox'],
  overrides: [
    {
      env: {
        'cypress/globals': true,
      },
      extends: ['plugin:cypress/recommended'],
      files: ['src/**/*.spec.tsx'],
      rules: {
        'cypress/no-pause': 'error',
      },
    },
  ],
  root: true,
  rules: {
    'import/no-default-export': ['off'],
    'import/prefer-default-export': ['error'],
  },
};
