module.exports = {
  testMatch: ["**/*.test.js"],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/*.js"],
  coverageDirectory: "coverage",
  testEnvironment: "jest-environment-jsdom-sixteen"
}
