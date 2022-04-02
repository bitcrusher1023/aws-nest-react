module.exports = options => {
  return {
    ...options,
    output: {
      ...options.output,
      library: {
        type: 'commonjs2',
      },
    },
  };
};
