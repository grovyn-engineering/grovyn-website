function apiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  return base;
}

/**
 * Authenticated API calls: admin JWT is sent in an httpOnly cookie by the API.
 * Always use credentialed requests so the cookie is included (cross-origin requires FRONTEND_URL CORS).
 */
export async function fetchWithAuth(path: string, options: RequestInit = {}): Promise<Response> {
  const base = apiBase();
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const incoming = options.headers;
  const merged = new Headers(incoming ?? undefined);
  const hasBody = options.body != null && options.body !== "";
  const isFormData = typeof FormData !== "undefined" && options.body instanceof FormData;
  if (hasBody && !isFormData && !merged.has("Content-Type")) {
    merged.set("Content-Type", "application/json");
  }
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: merged,
  });
}
