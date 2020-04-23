module.exports = {
  testMatch: ["**/*.test.js"],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/*.js"],
  testURL: "https://www.somthing.com/test.html",
  coverageDirectory: "coverage",
  testEnvironment: "jest-environment-jsdom-sixteen",
  setupFiles: ["<rootDir>/scripts/setupFile.js"],
  setupFilesAfterEnv: ["<rootDir>/scripts/jestAfterEnv.js"]
};
