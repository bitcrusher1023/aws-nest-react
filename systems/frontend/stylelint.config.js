module.exports = {
  customSyntax: require('@stylelint/postcss-css-in-js')(),
  extends: ['stylelint-config-styled-components'],
  plugins: ['stylelint-order'],
  rules: { 'order/properties-alphabetical-order': true },
};
