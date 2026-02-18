/**
 * API client for grovyn-backend.
 * Set NEXT_PUBLIC_API_URL in .env.local (e.g. http://localhost:3000 when backend runs on 3000).
 */

const getBaseUrl = (): string => {
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_URL ?? "";
  }
  return process.env.NEXT_PUBLIC_API_URL ?? "";
};

/** Allow only http(s) URLs; reject javascript:, data:, or malformed values to prevent SSRF/open redirect. */
function isAllowedBaseUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed) return false;
  if (/[\s\r\n]/.test(trimmed)) return false;
  return /^https?:\/\/[^\s]+$/i.test(trimmed);
}

export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
};

export type ContactResponse =
  | { success: true; message: string; data?: { contactId?: string; submittedAt?: string } }
  | { success: false; message: string };

export type NewsletterResponse =
  | { success: true; message: string; data?: { subscribedAt?: string } }
  | { success: false; message: string };

export async function subscribeNewsletter(email: string): Promise<NewsletterResponse> {
  const base = getBaseUrl();
  if (!base || !isAllowedBaseUrl(base)) {
    return { success: false, message: "API URL not configured. Set NEXT_PUBLIC_API_URL." };
  }
  const res = await fetch(`${base.replace(/\/$/, "")}/newsletter`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email.trim().toLowerCase() }),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { success: false, message: (data as { message?: string }).message || "Failed to subscribe." };
  }
  return data as NewsletterResponse;
}

export async function submitContact(payload: ContactPayload): Promise<ContactResponse> {
  const base = getBaseUrl();
  if (!base || !isAllowedBaseUrl(base)) {
    return { success: false, message: "API URL not configured. Set NEXT_PUBLIC_API_URL." };
  }
  const res = await fetch(`${base.replace(/\/$/, "")}/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { success: false, message: (data as { message?: string }).message || "Failed to submit." };
  }
  return data as ContactResponse;
}

export type CareerApplicationPayload = {
  name: string;
  email: string;
  phone?: string;
  position: string;
  message?: string;
  resume: File;
};

export type CareerApplicationResponse =
  | { success: true; message: string; data?: { applicationId?: string; submittedAt?: string } }
  | { success: false; message: string };

export async function submitCareerApplication(
  payload: CareerApplicationPayload
): Promise<CareerApplicationResponse> {
  const base = getBaseUrl();
  if (!base || !isAllowedBaseUrl(base)) {
    return { success: false, message: "API URL not configured. Set NEXT_PUBLIC_API_URL." };
  }
  const form = new FormData();
  form.append("name", payload.name);
  form.append("email", payload.email);
  if (payload.phone) form.append("phone", payload.phone);
  form.append("position", payload.position);
  if (payload.message) form.append("message", payload.message);
  form.append("resume", payload.resume);

  const res = await fetch(`${base.replace(/\/$/, "")}/careers/apply`, {
    method: "POST",
    body: form,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    return { success: false, message: (data as { message?: string }).message || "Failed to submit application." };
  }
  return data as CareerApplicationResponse;
}

// ---------- Job openings (for Careers page) ----------

export type JobOpening = {
  _id?: string;
  slug: string;
  title: string;
  type: string;
  team: string;
  location?: string;
  description?: string;
  requirements?: string[];
};

export async function fetchJobOpenings(locale?: string): Promise<JobOpening[]> {
  const base = getBaseUrl();
  if (!base || !isAllowedBaseUrl(base)) {
    return [];
  }
  try {
    const qs = locale?.trim() ? `?locale=${encodeURIComponent(locale.trim())}` : "";
    const res = await fetch(`${base.replace(/\/$/, "")}/careers/openings${qs}`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchJobOpeningBySlug(slug: string, locale?: string): Promise<JobOpening | null> {
  const base = getBaseUrl();
  if (!base || !isAllowedBaseUrl(base) || !slug) return null;
  try {
    const qs = locale?.trim() ? `?locale=${encodeURIComponent(locale.trim())}` : "";
    const res = await fetch(`${base.replace(/\/$/, "")}/careers/openings/${encodeURIComponent(slug)}${qs}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data.slug === "string" ? data : null;
  } catch {
    return null;
  }
}

/** Server-side only: fetch one opening by slug (for generateMetadata / notFound check). Pass locale for localized title/description. */
export async function getJobOpeningBySlugServer(slug: string, locale?: string): Promise<JobOpening | null> {
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  if (!base || !slug) return null;
  try {
    const qs = locale?.trim() ? `?locale=${encodeURIComponent(locale.trim())}` : "";
    const res = await fetch(`${base.replace(/\/$/, "")}/careers/openings/${encodeURIComponent(slug)}${qs}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data && typeof data.slug === "string" ? data : null;
  } catch {
    return null;
  }
}
