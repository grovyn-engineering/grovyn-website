import { getAdminToken } from "@/lib/adminToken";

function apiBase(): string {
  const base = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
  return base;
}

export async function fetchWithAuth(path: string, options: RequestInit = {}): Promise<Response> {
  const base = apiBase();
  const url = path.startsWith("http") ? path : `${base}${path}`;
  const bearer = getAdminToken();
  const incoming = options.headers;
  const merged = new Headers(incoming ?? undefined);
  if (bearer) merged.set("Authorization", `Bearer ${bearer}`);
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
