module.exports = {
  overrides: [
    {
      files: ['**/__tests__/**/*.{ts,tsx}', '**/*.{spec,test}.{ts,tsx}'],
      env: {
        jest: true,
      },
      rules: {
        // allow jest globals in tests
      },
    },
  ],
};
