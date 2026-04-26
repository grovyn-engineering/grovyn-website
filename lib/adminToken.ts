/**
 * Legacy: admin auth used localStorage/sessionStorage + Bearer header.
 * Sessions are httpOnly cookies now; these keys are only cleared on logout / failed /me.
 */
const SESSION_KEY = "grovyn_admin_token";
const PERSIST_KEY = "grovyn_admin_token_persist";

export function clearAdminToken(): void {
  if (typeof window === "undefined") return;
  sessionStorage.removeItem(SESSION_KEY);
  localStorage.removeItem(PERSIST_KEY);
}
