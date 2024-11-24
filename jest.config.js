module.exports = {
    testEnvironment: 'node',
    collectCoverage: true,
    collectCoverageFrom: ['src/**/*.js'],
    coverageReporters: ['lcov', 'text-summary'],
    coverageDirectory: 'coverage',
  };