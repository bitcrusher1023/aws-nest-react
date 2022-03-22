const {
  utils: { getPackages },
} = require('@commitlint/config-lerna-scopes');

module.exports = {
  rules: {
    'scope-enum': ctx =>
      getPackages(ctx).then(packages => [2, 'always', [...packages, 'deps']]),
  },
};
