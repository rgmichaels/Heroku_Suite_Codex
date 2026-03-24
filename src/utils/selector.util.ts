import type { Locator, Page } from "playwright";

type SelectorOptions = {
  testId?: string;
  role?: Parameters<Page["getByRole"]>[0];
  name?: string | RegExp;
  css?: string;
};

export const resolveLocator = (page: Page, options: SelectorOptions): Locator => {
  if (options.testId) {
    return page.getByTestId(options.testId);
  }
  if (options.role) {
    return page.getByRole(options.role, options.name ? { name: options.name } : undefined);
  }
  if (options.css) {
    return page.locator(options.css);
  }
  throw new Error("No selector option provided. Use data-testid first, then role or css fallback.");
};
