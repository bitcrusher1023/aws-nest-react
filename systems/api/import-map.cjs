module.exports = {
  imports: {
    '/@api-test-helpers/': {
      babel: { key: '^@api-test-helpers/(.*)', value: './test/helpers/\\1' },
      jest: {
        key: '@api-test-helpers/(.*)',
        value: '<rootDir>/src/test/helpers/$1',
      },
      tsconfig: { key: '@api-test-helpers/*', value: ['src/test/helpers/*'] },
    },
    '/@api/': {
      babel: { key: '^@api/(.*)', value: './\\1' },
      jest: { key: '@api/(.*)', value: '<rootDir>/src/$1' },
      tsconfig: { key: '@api/*', value: ['src/*'] },
    },
  },
};
