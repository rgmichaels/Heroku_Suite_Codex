# Heroku_Suite_Codex

Production-ready, reusable E2E automation framework using Playwright + Cucumber + TypeScript for `https://the-internet.herokuapp.com/`.

## What you're getting

- Strict TypeScript BDD framework with Cucumber + Playwright.
- Reusable Page Object Model with a shared `BasePage`.
- Custom Cucumber `World` with scenario-safe browser/context/page lifecycle.
- Runtime environment validation (fail-fast for missing `BASE_URL`).
- Fixture-driven, parameterized tests for all homepage links on the target app.
- Failure artifacts:
  - screenshots
  - retry-only traces
  - console logs
  - optional HTML snapshots
  - optional network logs
- GitHub Actions pipeline for headless CI execution with retries and artifact upload.
- HTML report generation from Cucumber JSON output.

## Tech stack

- Node.js `>=18`
- npm (with `package-lock.json`)
- Playwright
- Cucumber
- TypeScript (strict)
- ESLint + Prettier

## Folder structure

```text
Heroku_Suite_Codex/
├── .github/
│   └── workflows/
│       └── e2e.yml
├── features/
│   ├── homepage.feature
│   ├── link_navigation.feature
│   └── selector_strategy_wip.feature
├── scripts/
│   ├── generate-report.ts
│   └── jira-work-items.ts
├── src/
│   ├── config/
│   │   └── config.ts
│   ├── fixtures/
│   │   ├── homepage-links.json
│   │   └── selector-placeholders.json
│   ├── pages/
│   │   ├── base.page.ts
│   │   ├── feature.page.ts
│   │   └── home.page.ts
│   ├── steps/
│   │   ├── homepage.steps.ts
│   │   └── placeholder.steps.ts
│   ├── support/
│   │   ├── hooks.ts
│   │   ├── setup.ts
│   │   └── world.ts
│   ├── types/
│   │   └── multiple-cucumber-html-reporter.d.ts
│   └── utils/
│       ├── fixture.util.ts
│       ├── path.util.ts
│       └── selector.util.ts
├── .env.example
├── .gitignore
├── .prettierignore
├── .prettierrc.json
├── cucumber.js
├── eslint.config.cjs
├── package-lock.json
├── package.json
├── playwright.config.ts
├── README.md
└── tsconfig.json
```

## Setup

```bash
npm ci
npx playwright install chromium
```

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Required:

- `BASE_URL=https://the-internet.herokuapp.com/`

Optional:

- `HEADLESS=true|false`
- `RETRIES=0|1|...`
- `DEFAULT_TIMEOUT_MS=30000`
- `ENABLE_NETWORK_LOGGING=true|false`
- `CAPTURE_HTML_SNAPSHOT=true|false`

## Run commands

Regression:

```bash
BASE_URL=https://the-internet.herokuapp.com/ npm run test:regression
```

Smoke:

```bash
BASE_URL=https://the-internet.herokuapp.com/ npm run test:smoke
```

WIP:

```bash
BASE_URL=https://the-internet.herokuapp.com/ npm run test:wip
```

CI mode locally (parallel + retries + headless):

```bash
BASE_URL=https://the-internet.herokuapp.com/ CI=true HEADLESS=true RETRIES=1 npm run test:ci
```

Headed debug run:

```bash
BASE_URL=https://the-internet.herokuapp.com/ HEADLESS=false npm run test:regression
```

Lint and typecheck:

```bash
npm run lint
npm run typecheck
```

## Tag strategy

- `@smoke`: critical homepage inventory validation.
- `@regression`: full route and feature coverage.
- `@wip`: selector-hardening backlog checks.

## Selector strategy

Priority order:

1. `data-testid` (preferred when available)
2. role-based locators (`getByRole`)
3. resilient CSS fallback

This target site mostly does not provide `data-testid`, so role and CSS fallbacks are used. Utility entry point: `src/utils/selector.util.ts`.

## Placeholders and selector hardening

No non-existent selectors were invented. Where deeper per-page custom selectors are needed, placeholders are tracked in:

- `src/fixtures/selector-placeholders.json`

How to replace placeholders:

1. Inspect the page in headed mode.
2. Choose stable selectors (prefer role/text before CSS).
3. Add page-specific assertions in `FeaturePage.performKnownFeatureCheck`.
4. Remove or update the related placeholder entry.

## Reporting and artifacts

Generated artifacts:

- `artifacts/reports/cucumber-report.json`
- `artifacts/html/index.html`
- `artifacts/screenshots/*.png` on failure
- `artifacts/traces/*.zip` on retry
- `artifacts/console/*.log` on failure
- `artifacts/html-snapshots/*.html` on failure when enabled
- `artifacts/network/*.log` on failure when network logging is enabled

## Debugging and observability

Recommended local debug workflow:

1. Run headed with `HEADLESS=false`.
2. Re-run focused tags (`@smoke` or one scenario).
3. Inspect screenshot/console artifacts.
4. Enable `ENABLE_NETWORK_LOGGING=true` when network behavior matters.
5. Enable `CAPTURE_HTML_SNAPSHOT=true` for DOM-state debugging.

## CI/CD (GitHub Actions)

Workflow: `.github/workflows/e2e.yml`

- Triggers on every push.
- Installs dependencies and Playwright Chromium.
- Runs regression suite in headless mode.
- Uses retries in CI.
- Uploads `artifacts/` bundle for diagnostics.

## Jira automation

Script:

```bash
JIRA_EMAIL=rgmichaels@gmail.com npm run jira:sync
```

What it does:

- Creates Jira work items for major framework components.
- Creates Jira work items for each test case (including cucumber scenario text).
- Transitions each issue to `In Progress`, then to `Complete/Completed/Done` when available.
- Writes created keys to `artifacts/jira-created-issues.json`.

Defaults:

- Base URL: `https://rob-michaels.atlassian.net`
- Project key: `HSC`
- Issue type: `Task`
- Jira token source: `/Users/robertmichaels/Documents/tokens.txt`

Override through env:

- `JIRA_BASE_URL`
- `JIRA_PROJECT_KEY`
- `JIRA_ISSUE_TYPE`
- `TOKENS_FILE`
- `JIRA_TOKEN`

## Troubleshooting

- `BASE_URL is required`:
  - Set `BASE_URL` in env or `.env`.
- Browser launch failure in CI:
  - Ensure `npx playwright install --with-deps chromium` is run.
- Auth pages failing:
  - Framework uses `admin/admin` http credentials for site auth challenges.
- Route mismatch on redirect pages:
  - Validate expected path against final redirected URL in examples table.

## Clean initial commit message

```text
feat: scaffold production Playwright+Cucumber+TypeScript E2E framework with CI, reporting, fixtures, and Jira automation
```
