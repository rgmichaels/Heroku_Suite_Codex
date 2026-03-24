import { expect, type Locator, type Page } from "@playwright/test";
import { appConfig } from "../config/config";

export abstract class BasePage {
  protected constructor(protected readonly page: Page) {}

  async goto(path: string): Promise<void> {
    await this.page.goto(`${appConfig.baseUrl}${path}`);
    await this.waitForStable();
  }

  async waitForStable(): Promise<void> {
    await this.page.waitForLoadState("domcontentloaded");
    await this.page.waitForTimeout(150);
  }

  async clickSafe(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible({ timeout: appConfig.defaultTimeoutMs });
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }
}
