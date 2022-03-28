module.exports = {
  '*.md': ['npx markdownlint-cli2-fix', 'npx prettier --write'],
  '*.{js,ts,json,yml,yaml}': ['npx prettier --write', 'npx eslint --fix'],
};
