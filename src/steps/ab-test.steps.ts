import { Then, When } from "@cucumber/cucumber";
import { AbTestPage } from "../pages/ab-test.page";
import { HomePage } from "../pages/home.page";
import type { AppWorld } from "../support/world";

When(/^I open the A\/B Testing page from the homepage$/, async function (this: AppWorld) {
  const homePage = new HomePage(this.page);
  await homePage.openLinkByName("A/B Testing");
});

Then(/^the A\/B Testing page should be displayed$/, async function (this: AppWorld) {
  const abTestPage = new AbTestPage(this.page);
  await abTestPage.assertLoaded();
  await abTestPage.assertHeadingVariantVisible();
  await abTestPage.assertBodyCopyPresent();
});
