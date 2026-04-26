const SESSION_KEY = "grovyn_admin_token";
const PERSIST_KEY = "grovyn_admin_token_persist";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(SESSION_KEY) ?? localStorage.getItem(PERSIST_KEY);
}

export function setAdminToken(token: string, persist?: boolean): void {
  if (persist) {
    localStorage.setItem(PERSIST_KEY, token);
    sessionStorage.removeItem(SESSION_KEY);
  } else {
    sessionStorage.setItem(SESSION_KEY, token);
    localStorage.removeItem(PERSIST_KEY);
  }
}

export function clearAdminToken(): void {
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PERSIST_KEY);
}
