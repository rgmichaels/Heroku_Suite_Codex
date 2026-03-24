import { Given, Then, When } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { FeaturePage } from "../pages/feature.page";
import { HomePage, type HomepageLink } from "../pages/home.page";
import type { AppWorld } from "../support/world";
import { loadJsonFixture } from "../utils/fixture.util";

const homepageLinks = loadJsonFixture<HomepageLink[]>("src/fixtures/homepage-links.json");

Given("I am on the homepage", async function (this: AppWorld) {
  const homePage = new HomePage(this.page);
  await homePage.open();
});

Then("all homepage links from fixture should be visible", async function (this: AppWorld) {
  const homePage = new HomePage(this.page);
  for (const link of homepageLinks) {
    await homePage.assertLinkVisible(link.name);
  }
});

Then("homepage links should exactly match the fixture list", async function (this: AppWorld) {
  const homePage = new HomePage(this.page);
  const actual = await homePage.getVisibleLinkNames();
  const normalizedActual = actual.map((value) => value.trim()).sort();
  const normalizedExpected = homepageLinks.map((value) => value.name).sort();
  expect(normalizedActual).toEqual(normalizedExpected);
});

When(
  "I open the {string} link from the homepage",
  async function (this: AppWorld, linkName: string) {
    const homePage = new HomePage(this.page);
    await homePage.openLinkByName(linkName);
  }
);

Then("I should land on the {string} page path", async function (this: AppWorld, path: string) {
  const featurePage = new FeaturePage(this.page);
  await featurePage.assertOnPath(path);
  await featurePage.assertMainContentVisible();
});

Then(
  "the {string} page feature should be exercisable",
  async function (this: AppWorld, linkName: string) {
    const featurePage = new FeaturePage(this.page);
    await featurePage.performKnownFeatureCheck(linkName);
  }
);
