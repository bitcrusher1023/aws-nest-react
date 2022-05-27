module.exports = {
  '*.{ts,tsx,js,json}': ['npx eslint --fix', 'npx prettier --write'],
  '*.{css,tsx}': ['npx stylelint'],
};
