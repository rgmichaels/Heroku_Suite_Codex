import { Then } from "@cucumber/cucumber";
import { expect } from "@playwright/test";
import { loadJsonFixture } from "../utils/fixture.util";

type SelectorPlaceholder = {
  page: string;
  placeholderSelector: string;
  notes: string;
};

Then("selector placeholders should be documented for future hardening", function () {
  const placeholders = loadJsonFixture<SelectorPlaceholder[]>("src/fixtures/selector-placeholders.json");
  expect(placeholders.length).toBeGreaterThan(0);
  for (const entry of placeholders) {
    expect(entry.placeholderSelector).toMatch(/^REPLACE_WITH_/);
    expect(entry.notes.length).toBeGreaterThan(10);
  }
});
