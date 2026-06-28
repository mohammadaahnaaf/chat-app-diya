export async function parseJsonResponse(res: Response): Promise<{ error?: string }> {
  const text = await res.text();
  if (!text) return {};
  try {
    return JSON.parse(text);
  } catch {
    return { error: "Unexpected server response" };
  }
}
