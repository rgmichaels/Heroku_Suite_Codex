import { expect, type Locator } from "@playwright/test";
import type { Page } from "playwright";
import { BasePage } from "./base.page";

export type HomepageLink = {
  name: string;
  path: string;
};

export class HomePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async open(): Promise<void> {
    await this.goto("/");
    await expect(this.page.getByRole("heading", { name: "Welcome to the-internet" })).toBeVisible();
  }

  linkByName(name: string): Locator {
    return this.page.locator("#content").getByRole("link", { name, exact: true });
  }

  async assertLinkVisible(name: string): Promise<void> {
    await expect(this.linkByName(name)).toBeVisible();
  }

  async openLinkByName(name: string): Promise<void> {
    await this.clickSafe(this.linkByName(name));
    await this.waitForStable();
  }

  async getVisibleLinkNames(): Promise<string[]> {
    const links = this.page.locator("#content ul li a");
    return links.allInnerTexts();
  }
}
