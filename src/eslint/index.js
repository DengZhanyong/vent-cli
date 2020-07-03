module.exports = {
  extends: [
    './es6',
    './react',
  ].map(require.resolve),
};