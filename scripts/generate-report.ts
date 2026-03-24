import fs from "node:fs";
import path from "node:path";
import report from "multiple-cucumber-html-reporter";

const jsonReportPath = path.resolve("artifacts/reports/cucumber-report.json");
const htmlOutputPath = path.resolve("artifacts/html");

if (!fs.existsSync(jsonReportPath)) {
  console.warn(`Cucumber JSON report not found: ${jsonReportPath}`);
  process.exit(0);
}

report.generate({
  jsonDir: path.resolve("artifacts/reports"),
  reportPath: htmlOutputPath,
  metadata: {
    browser: {
      name: "chromium",
      version: "latest"
    },
    device: "Local test machine",
    platform: {
      name: process.platform,
      version: process.version
    }
  },
  customData: {
    title: "Execution Info",
    data: [
      { label: "Project", value: "Heroku_Suite_Codex" },
      { label: "Base URL", value: process.env.BASE_URL ?? "Not Set" }
    ]
  }
});

console.log(`Generated HTML report at ${htmlOutputPath}`);
