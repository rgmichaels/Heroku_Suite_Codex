import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ quiet: true });

const rawSchema = z.object({
  BASE_URL: z.string().min(1, "BASE_URL is required"),
  HEADLESS: z.string().optional(),
  RETRIES: z.string().optional(),
  DEFAULT_TIMEOUT_MS: z.string().optional(),
  ENABLE_NETWORK_LOGGING: z.string().optional(),
  CAPTURE_HTML_SNAPSHOT: z.string().optional(),
  CI: z.string().optional()
});

const parsed = rawSchema.safeParse(process.env);

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `${issue.path.join(".")}: ${issue.message}`)
    .join(", ");
  throw new Error(`Invalid environment configuration: ${issues}`);
}

const toBoolean = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined) {
    return fallback;
  }
  return value.toLowerCase() === "true";
};

const toNumber = (value: string | undefined, fallback: number): number => {
  if (!value) {
    return fallback;
  }
  const parsedNumber = Number(value);
  if (Number.isNaN(parsedNumber)) {
    throw new Error(`Expected numeric value, received "${value}"`);
  }
  return parsedNumber;
};

const env = parsed.data;
const isCi = env.CI === "true";

export const appConfig = {
  baseUrl: env.BASE_URL.replace(/\/+$/, ""),
  ci: isCi,
  headless: toBoolean(env.HEADLESS, isCi),
  retries: toNumber(env.RETRIES, isCi ? 1 : 0),
  defaultTimeoutMs: toNumber(env.DEFAULT_TIMEOUT_MS, 30_000),
  enableNetworkLogging: toBoolean(env.ENABLE_NETWORK_LOGGING, false),
  captureHtmlSnapshot: toBoolean(env.CAPTURE_HTML_SNAPSHOT, false)
} as const;

export type AppConfig = typeof appConfig;
