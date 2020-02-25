module.exports = {
  extends: ['algolia/react', 'algolia/typescript'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    'import/extensions': 'off',
    'import/no-unresolved': 'off',
  },
  overrides: [
    {
      files: [
        'packages/client/gatsby-*.js',
        'packages/client/src/electron.js',
        'packages/server/**/*',
        'packages/plugins/**/*',
        'packages/common/**/*',
      ],
      rules: {
        'import/no-commonjs': 'off',
      },
    },
    {
      files: [
        'packages/server/**/*',
        'packages/plugins/**/*',
        'packages/utils/**/*',
      ],
      rules: {
        'no-console': 'off',
      },
    },
    {
      files: ['packages/server/**/*'],
      rules: {
        'no-param-reassign': 'off',
      },
    },
  ],
};
