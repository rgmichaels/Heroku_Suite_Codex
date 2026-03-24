import {
  After,
  AfterAll,
  Before,
  BeforeAll,
  Status,
  type ITestCaseHookParameter
} from "@cucumber/cucumber";
import fs from "node:fs";
import path from "node:path";
import { chromium, type Browser } from "playwright";
import { appConfig } from "../config/config";
import { toSafeFileName } from "../utils/path.util";
import type { AppWorld } from "./world";

let browser: Browser;

const ensureArtifactDirectories = (): void => {
  const directories = [
    "artifacts/screenshots",
    "artifacts/traces",
    "artifacts/console",
    "artifacts/html-snapshots",
    "artifacts/network"
  ];
  for (const directory of directories) {
    fs.mkdirSync(path.resolve(directory), { recursive: true });
  }
};

BeforeAll(async () => {
  ensureArtifactDirectories();
  browser = await chromium.launch({
    headless: appConfig.headless
  });
});

Before(async function (this: AppWorld, scenario: ITestCaseHookParameter) {
  this.scenarioName = scenario.pickle.name;
  this.browser = browser;
  this.context = await browser.newContext({
    baseURL: appConfig.baseUrl,
    httpCredentials: {
      username: "admin",
      password: "admin"
    }
  });
  await this.context.tracing.start({
    screenshots: true,
    snapshots: true,
    sources: true
  });
  this.page = await this.context.newPage();

  this.page.on("console", (msg) => this.pushConsoleLog(msg));

  if (appConfig.enableNetworkLogging) {
    this.page.on("request", (request) => this.pushNetworkLog(`REQUEST ${request.method()} ${request.url()}`));
    this.page.on("response", (response) =>
      this.pushNetworkLog(`RESPONSE ${response.status()} ${response.url()}`)
    );
  }
});

After(async function (this: AppWorld, scenario: ITestCaseHookParameter) {
  const failed = scenario.result?.status === Status.FAILED;
  const retryInfo = scenario as ITestCaseHookParameter & { willBeRetried?: boolean };
  const fileBase = toSafeFileName(
    `${this.scenarioName}-${scenario.result?.duration?.seconds ?? 0}-${Date.now()}`
  );

  if (failed) {
    const screenshotPath = path.resolve(`artifacts/screenshots/${fileBase}.png`);
    await this.page.screenshot({
      path: screenshotPath,
      fullPage: true
    });
    this.attach(`Saved screenshot: ${screenshotPath}`);

    if (this.consoleLogs.length > 0) {
      const consolePath = path.resolve(`artifacts/console/${fileBase}.log`);
      fs.writeFileSync(
        consolePath,
        this.consoleLogs.map((entry) => `[${entry.type}] ${entry.text}`).join("\n"),
        "utf-8"
      );
      this.attach(`Saved console log: ${consolePath}`);
    }

    if (appConfig.captureHtmlSnapshot) {
      const htmlPath = path.resolve(`artifacts/html-snapshots/${fileBase}.html`);
      fs.writeFileSync(htmlPath, await this.page.content(), "utf-8");
      this.attach(`Saved HTML snapshot: ${htmlPath}`);
    }

    if (appConfig.enableNetworkLogging && this.networkLogs.length > 0) {
      const networkPath = path.resolve(`artifacts/network/${fileBase}.log`);
      fs.writeFileSync(networkPath, this.networkLogs.join("\n"), "utf-8");
      this.attach(`Saved network log: ${networkPath}`);
    }
  }

  if (failed && retryInfo.willBeRetried) {
    const tracePath = path.resolve(`artifacts/traces/${fileBase}.zip`);
    await this.context.tracing.stop({ path: tracePath });
    this.attach(`Saved trace for retry: ${tracePath}`);
  } else {
    await this.context.tracing.stop();
  }

  await this.page.close();
  await this.context.close();
});

AfterAll(async () => {
  if (browser) {
    await browser.close();
  }
});
