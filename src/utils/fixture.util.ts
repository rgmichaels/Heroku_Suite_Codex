import fs from "node:fs";
import path from "node:path";

export const loadJsonFixture = <T>(relativePath: string): T => {
  const fullPath = path.resolve(process.cwd(), relativePath);
  const raw = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(raw) as T;
};
