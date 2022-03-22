module.exports = {
  extends: ['@busybox'],
  overrides: [
    {
      files: ['*.e2e-spec.ts'],
      rules: {
        'jest/valid-title': [
          'error',
          {
            mustMatch: {
              describe: '^(GET|POST|PATCH|PUT|DELETE) .*$',
            },
          },
        ],
      },
    },
  ],
  rules: {
    'dot-notation': 'off',
    'max-params': 'off',
  },
};
