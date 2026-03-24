import fs from "node:fs";
import path from "node:path";
import { loadJsonFixture } from "../src/utils/fixture.util";

type HomepageLink = {
  name: string;
  path: string;
};

type JiraIssue = {
  summary: string;
  description: string;
  cucumber: string;
  labels: string[];
};

type JiraCreateIssueResponse = {
  key: string;
};

type JiraTransition = {
  id: string;
  name: string;
};

const jiraBaseUrl = process.env.JIRA_BASE_URL ?? "https://rob-michaels.atlassian.net";
const jiraProjectKey = process.env.JIRA_PROJECT_KEY ?? "HSC";
const jiraIssueType = process.env.JIRA_ISSUE_TYPE ?? "Task";
const tokensFilePath = process.env.TOKENS_FILE ?? "/Users/robertmichaels/Documents/tokens.txt";
const jiraEmail = process.env.JIRA_EMAIL;

const getJiraToken = (): string => {
  if (process.env.JIRA_TOKEN) {
    return process.env.JIRA_TOKEN;
  }
  const contents = fs.readFileSync(tokensFilePath, "utf-8");
  const token = contents
    .split("\n")
    .map((line) => line.trim())
    .find((line) => line.startsWith("ATATT"));
  if (!token) {
    throw new Error(`Jira token not found in ${tokensFilePath}`);
  }
  return token;
};

if (!jiraEmail) {
  throw new Error("JIRA_EMAIL is required. Example: JIRA_EMAIL=rgmichaels@gmail.com");
}

const jiraToken = getJiraToken();
const authHeader = `Basic ${Buffer.from(`${jiraEmail}:${jiraToken}`).toString("base64")}`;

const jiraRequest = async <T>(pathValue: string, init?: RequestInit): Promise<T> => {
  const response = await fetch(`${jiraBaseUrl}${pathValue}`, {
    ...init,
    headers: {
      Authorization: authHeader,
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    }
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Jira request failed: ${response.status} ${response.statusText} - ${body}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
};

const adfDescription = (description: string, cucumber: string): Record<string, unknown> => ({
  type: "doc",
  version: 1,
  content: [
    {
      type: "paragraph",
      content: [{ type: "text", text: description }]
    },
    {
      type: "paragraph",
      content: [{ type: "text", text: "Cucumber scenario:" }]
    },
    {
      type: "codeBlock",
      attrs: { language: "gherkin" },
      content: [{ type: "text", text: cucumber }]
    }
  ]
});

const majorComponentIssues: JiraIssue[] = [
  {
    summary: "Framework: Bootstrap Playwright + Cucumber + TypeScript strict stack",
    description: "Create a reusable E2E framework baseline with strict typing and npm tooling.",
    cucumber: "N/A - Framework setup task.",
    labels: ["automation", "framework", "component"]
  },
  {
    summary: "Framework: Implement configuration and runtime environment validation",
    description: "Centralize config values and fail fast when required env vars are missing.",
    cucumber: "N/A - Configuration task.",
    labels: ["automation", "framework", "component"]
  },
  {
    summary: "Framework: Implement custom Cucumber World and lifecycle hooks",
    description: "Manage browser/context/page per scenario and capture failure artifacts.",
    cucumber: "N/A - Support layer task.",
    labels: ["automation", "framework", "component"]
  },
  {
    summary: "Framework: Build reusable page objects and selector utilities",
    description: "Implement BasePage helpers and feature-oriented page object abstractions.",
    cucumber: "N/A - POM architecture task.",
    labels: ["automation", "framework", "component"]
  },
  {
    summary: "Framework: Add fixture-driven step definitions and BDD features",
    description: "Create parameterized Cucumber scenarios with external JSON fixtures.",
    cucumber: "N/A - BDD implementation task.",
    labels: ["automation", "framework", "component"]
  },
  {
    summary: "Framework: Add reporting, artifact management, and observability hooks",
    description: "Generate Cucumber HTML reports and collect screenshots, traces, and console logs.",
    cucumber: "N/A - Reporting task.",
    labels: ["automation", "framework", "component"]
  },
  {
    summary: "Framework: Configure GitHub Actions CI for headless execution",
    description: "Run regression suite on push with retries and artifact upload.",
    cucumber: "N/A - CI task.",
    labels: ["automation", "framework", "component", "ci"]
  },
  {
    summary: "Framework: Document setup, execution, selector strategy, and troubleshooting",
    description: "Provide production-ready README for local and CI usage.",
    cucumber: "N/A - Documentation task.",
    labels: ["automation", "framework", "component", "documentation"]
  }
];

const buildTestIssues = (): JiraIssue[] => {
  const links = loadJsonFixture<HomepageLink[]>("src/fixtures/homepage-links.json");

  const homepageInventory: JiraIssue = {
    summary: "Test: Homepage displays all expected example links",
    description:
      "Validate that all homepage links from the external fixture are visible and match expected inventory.",
    cucumber: [
      "Scenario: Homepage shows all expected links",
      "  Given I am on the homepage",
      "  Then all homepage links from fixture should be visible",
      "  And homepage links should exactly match the fixture list"
    ].join("\n"),
    labels: ["automation", "test-case", "homepage", "smoke", "regression"]
  };

  const perLinkIssues: JiraIssue[] = links.map((link) => ({
    summary: `Test: ${link.name} link navigates and feature can be exercised`,
    description: `Validate navigation and feature-level behavior for "${link.name}" using homepage-driven access.`,
    cucumber: [
      "Scenario: Homepage link opens its target page and feature",
      "  Given I am on the homepage",
      `  When I open the "${link.name}" link from the homepage`,
      `  Then I should land on the "${link.path}" page path`,
      `  And the "${link.name}" page feature should be exercisable`
    ].join("\n"),
    labels: ["automation", "test-case", "regression"]
  }));

  const placeholderWip: JiraIssue = {
    summary: "Test: Selector placeholder inventory is maintained",
    description: "Ensure selector placeholders remain documented for hardening unknown page selectors.",
    cucumber: [
      "Scenario: Placeholder selector inventory exists",
      "  Then selector placeholders should be documented for future hardening"
    ].join("\n"),
    labels: ["automation", "test-case", "wip", "selector-strategy"]
  };

  return [homepageInventory, ...perLinkIssues, placeholderWip];
};

const createIssue = async (issue: JiraIssue): Promise<string> => {
  const payload = {
    fields: {
      project: { key: jiraProjectKey },
      summary: issue.summary,
      issuetype: { name: jiraIssueType },
      labels: issue.labels,
      description: adfDescription(issue.description, issue.cucumber)
    }
  };

  const response = await jiraRequest<JiraCreateIssueResponse>("/rest/api/3/issue", {
    method: "POST",
    body: JSON.stringify(payload)
  });
  return response.key;
};

const listTransitions = async (issueKey: string): Promise<JiraTransition[]> => {
  const response = await jiraRequest<{ transitions: JiraTransition[] }>(
    `/rest/api/3/issue/${issueKey}/transitions`
  );
  return response.transitions;
};

const transitionIssue = async (issueKey: string, targetNames: string[]): Promise<void> => {
  const transitions = await listTransitions(issueKey);
  const target = transitions.find((transition) =>
    targetNames.some((name) => transition.name.toLowerCase() === name.toLowerCase())
  );

  if (!target) {
    console.warn(
      `No transition found for ${issueKey}. Available transitions: ${transitions
        .map((transition) => transition.name)
        .join(", ")}`
    );
    return;
  }

  await jiraRequest<void>(`/rest/api/3/issue/${issueKey}/transitions`, {
    method: "POST",
    body: JSON.stringify({
      transition: { id: target.id }
    })
  });
};

const run = async (): Promise<void> => {
  const issuesToCreate = [...majorComponentIssues, ...buildTestIssues()];
  const created: { key: string; summary: string }[] = [];

  for (const issue of issuesToCreate) {
    const issueKey = await createIssue(issue);
    await transitionIssue(issueKey, ["In Progress"]);
    await transitionIssue(issueKey, ["Complete", "Completed", "Done"]);
    created.push({ key: issueKey, summary: issue.summary });
    console.log(`Created and transitioned ${issueKey}: ${issue.summary}`);
  }

  const outputPath = path.resolve("artifacts/jira-created-issues.json");
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(created, null, 2), "utf-8");
  console.log(`Saved Jira issue log to ${outputPath}`);
};

run().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
