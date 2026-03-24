import { World, type IWorldOptions, setWorldConstructor } from "@cucumber/cucumber";
import type { Browser, BrowserContext, ConsoleMessage, Page } from "playwright";

type ConsoleEntry = {
  type: string;
  text: string;
};

export class AppWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  scenarioName = "";
  consoleLogs: ConsoleEntry[] = [];
  networkLogs: string[] = [];

  constructor(options: IWorldOptions) {
    super(options);
  }

  pushConsoleLog(message: ConsoleMessage): void {
    this.consoleLogs.push({
      type: message.type(),
      text: message.text()
    });
  }

  pushNetworkLog(entry: string): void {
    this.networkLogs.push(entry);
  }
}

setWorldConstructor(AppWorld);
