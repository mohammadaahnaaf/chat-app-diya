export function apiError(message: string, status = 500) {
  return Response.json({ error: message }, { status });
}

export function handleApiError(err: unknown) {
  console.error("[api]", err);

  if (err instanceof Error) {
    if (err.message.includes("JWT_SECRET") || err.message.includes("DATABASE_URL")) {
      return apiError("Server configuration error", 500);
    }
  }

  return apiError("Internal server error", 500);
}
