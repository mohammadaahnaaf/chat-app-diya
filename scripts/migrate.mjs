import { execSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const envPath = resolve(process.cwd(), ".env");
  if (!existsSync(envPath)) return;

  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnv();

function normalizeDatabaseUrl(raw) {
  const url = new URL(raw);

  if (url.hostname.includes("-pooler") && !url.searchParams.has("pgbouncer")) {
    url.searchParams.set("pgbouncer", "true");
  }

  if (!url.searchParams.has("connect_timeout")) {
    url.searchParams.set("connect_timeout", "15");
  }

  return url.toString();
}

function deriveDirectUrl(raw) {
  const url = new URL(raw);
  url.hostname = url.hostname.replace("-pooler", "");
  url.searchParams.delete("pgbouncer");
  return url.toString();
}

const raw = process.env.DATABASE_URL;
if (!raw) {
  console.warn("DATABASE_URL not set — skipping prisma migrate deploy");
  process.exit(0);
}

process.env.DATABASE_URL = normalizeDatabaseUrl(raw);
if (!process.env.DIRECT_URL) {
  process.env.DIRECT_URL = deriveDirectUrl(raw);
}

execSync("npx prisma migrate deploy", { stdio: "inherit", env: process.env });
