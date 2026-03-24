import { expect } from "@playwright/test";
import type { Page } from "playwright";
import { BasePage } from "./base.page";

export class FeaturePage extends BasePage {
  constructor(page: Page) {
    super(page);
  }

  async assertOnPath(path: string): Promise<void> {
    const escapedPath = path.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    await expect(this.page).toHaveURL(new RegExp(`${escapedPath}/?$`));
  }

  async assertMainContentVisible(): Promise<void> {
    const frameSet = this.page.locator("frameset").first();
    if ((await frameSet.count()) > 0) {
      return;
    }

    const candidateSelectors = ["#content", ".example", "body"];
    for (const selector of candidateSelectors) {
      const candidate = this.page.locator(selector).first();
      if ((await candidate.count()) > 0) {
        await expect(candidate).toBeVisible();
        return;
      }
    }
    throw new Error("No visible content container found.");
  }

  async assertPrimaryHeadingVisible(): Promise<void> {
    const headingSelectors = ["#content h3", "#content h2", ".example h3", "h1", "h2", "h3", "h4"];
    for (const selector of headingSelectors) {
      const heading = this.page.locator(selector).first();
      if ((await heading.count()) > 0) {
        await expect(heading).toBeVisible();
        return;
      }
    }
    throw new Error("No visible heading found on the page.");
  }

  async performKnownFeatureCheck(linkName: string): Promise<void> {
    switch (linkName) {
      case "Add/Remove Elements": {
        const addButton = this.page.getByRole("button", { name: "Add Element" });
        await this.clickSafe(addButton);
        await expect(this.page.getByRole("button", { name: "Delete" })).toBeVisible();
        return;
      }
      case "Checkboxes": {
        const checkbox = this.page.locator("#checkboxes input").first();
        await checkbox.check();
        await expect(checkbox).toBeChecked();
        return;
      }
      case "Dropdown": {
        await this.page.locator("#dropdown").selectOption("1");
        await expect(this.page.locator("#dropdown")).toHaveValue("1");
        return;
      }
      case "Inputs": {
        const input = this.page.locator("input[type='number']");
        await input.fill("42");
        await expect(input).toHaveValue("42");
        return;
      }
      case "Form Authentication": {
        await this.page.locator("#username").fill("tomsmith");
        await this.page.locator("#password").fill("SuperSecretPassword!");
        await this.page.getByRole("button", { name: /Login/i }).click();
        await expect(this.page.getByText("You logged into a secure area!")).toBeVisible();
        return;
      }
      case "JavaScript onload event error": {
        await expect(this.page.getByText("This page has a JavaScript error in the onload event.")).toBeVisible();
        return;
      }
      case "Nested Frames": {
        const frameSet = this.page.locator("frameset");
        expect(await frameSet.count()).toBeGreaterThan(0);
        return;
      }
      default:
        await this.assertPrimaryHeadingVisible();
    }
  }
}
