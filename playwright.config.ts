import { defineConfig, devices } from "@playwright/test";
import { appConfig } from "./src/config/config";

export default defineConfig({
  timeout: 60_000,
  fullyParallel: true,
  retries: appConfig.retries,
  workers: appConfig.ci ? 4 : undefined,
  reporter: [["list"]],
  use: {
    baseURL: appConfig.baseUrl,
    headless: appConfig.headless,
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
    screenshot: "only-on-failure",
    trace: "on-first-retry"
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] }
    }
  ]
});
