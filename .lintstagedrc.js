module.exports = {
  "*.{md}": ["npx markdownlint-cli2-fix", "npx prettier --write"],
  'package.json': ["npx prettier --write"],
}
