module.exports = {
  testEnvironment: "node",
  testMatch: ["**/tests/**/*.test.js", "**/__tests__/**/*.js"],
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
  coveragePathIgnorePatterns: ["/node_modules/", "/tests/", "/coverage/"],
  verbose: true,
  testTimeout: 10000,
};
