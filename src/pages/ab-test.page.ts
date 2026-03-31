import { expect } from "@playwright/test";
import type { Page } from "playwright";
import { BasePage } from "./base.page";

export class AbTestPage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertLoaded(): Promise<void> {
    await expect(this.page).toHaveURL(/\/abtest\/?$/);
    await expect(this.page.locator("#content .example p")).toBeVisible();
  }

  async assertHeadingVariantVisible(): Promise<void> {
    const heading = this.page.locator("#content .example h3");
    await expect(heading).toBeVisible();
    await expect(heading).toHaveText(/A\/B Test(Control)?/);
  }

  async assertBodyCopyPresent(): Promise<void> {
    await expect(this.page.locator("#content .example p")).toContainText(
      "Also known as split testing"
    );
  }
}
