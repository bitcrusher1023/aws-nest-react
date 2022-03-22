module.exports = {
  '*.{ts,tsx,js,json}': ['npm run eslint -- --fix', 'npx prettier --write'],
  '*.{css,tsx}': ['npx stylelint'],
};
