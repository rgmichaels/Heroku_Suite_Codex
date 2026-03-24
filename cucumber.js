module.exports = {
  default: {
    paths: ["features/**/*.feature"],
    require: ["src/support/**/*.ts", "src/steps/**/*.ts"],
    requireModule: ["ts-node/register/transpile-only"],
    format: [
      "progress-bar",
      "summary",
      "json:artifacts/reports/cucumber-report.json"
    ],
    parallel: 2,
    retry: 0,
    publishQuiet: true
  }
};
