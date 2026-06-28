export function normalizeDatabaseUrl(raw?: string): string | undefined {
  if (!raw) return undefined;

  const url = new URL(raw);

  if (url.hostname.includes("-pooler") && !url.searchParams.has("pgbouncer")) {
    url.searchParams.set("pgbouncer", "true");
  }

  if (!url.searchParams.has("connect_timeout")) {
    url.searchParams.set("connect_timeout", "15");
  }

  return url.toString();
}

export function deriveDirectUrl(raw?: string): string | undefined {
  if (!raw) return undefined;

  const url = new URL(raw);
  url.hostname = url.hostname.replace("-pooler", "");
  url.searchParams.delete("pgbouncer");
  return url.toString();
}
