module.exports = {
  extends: ['@busybox'],
  rules: {
    'import/no-default-export': ['off'],
    'import/prefer-default-export': ['error'],
  },
};
