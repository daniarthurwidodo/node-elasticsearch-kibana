module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/*.test.js'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  setupFilesAfterEnv: ['./jest.setup.js']
};
