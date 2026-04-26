"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Briefcase } from "lucide-react";
import { fetchWithAuth } from "@/lib/apiHelper";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminLoadingState } from "@/components/admin/AdminLoadingState";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import {
  adminCancelLink,
  adminCardSectionTitle,
  adminDangerLink,
  adminEditLink,
  adminFormCard,
  adminInput,
  adminLabel,
  adminListRow,
  adminPrimaryBtn,
  adminSectionHeading,
  adminSelect,
} from "@/lib/adminUi";

type Opening = {
  _id: string;
  slug: string;
  title: string;
  type: string;
  team: string;
  location?: string;
  order?: number;
};

type Application = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  position: string;
  coverLetter?: string;
  resume: { url: string; public_id: string };
  status: string;
  submittedAt: string;
};

const APP_STATUSES = [
  "pending",
  "viewed",
  "under_evaluation",
  "selected",
  "rejected",
  "on_hold",
  "future_use",
  "reviewed",
  "shortlisted",
  "accepted",
] as const;

const apiBase = () => process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";

async function openResumeViaProxy(applicationId: string) {
  try {
    const res = await fetchWithAuth(`/admin/career-applications/${applicationId}/resume`);
    if (!res.ok) {
      let msg = "Could not load resume";
      try {
        const j = (await res.json()) as { message?: string };
        if (j.message) msg = j.message;
      } catch {
        /* ignore */
      }
      toast.error(msg);
      return;
    }
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const win = window.open(url, "_blank", "noopener,noreferrer");
    if (!win) toast.error("Pop-up blocked — allow pop-ups to preview the file.");
    setTimeout(() => URL.revokeObjectURL(url), 180_000);
  } catch {
    toast.error("Could not open resume");
  }
}

export default function AdminCareersPage() {
  const [openings, setOpenings] = useState<Opening[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [resumeOpeningId, setResumeOpeningId] = useState<string | null>(null);
  const [expandedAppId, setExpandedAppId] = useState<string | null>(null);
  const [slug, setSlug] = useState("");
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Full-time");
  const [team, setTeam] = useState("");
  const [location, setLocation] = useState("");

  const load = useCallback(async () => {
    const base = apiBase();
    const [oRes, aRes] = await Promise.all([
      fetch(`${base}/careers/openings`),
      fetchWithAuth("/admin/career-applications"),
    ]);
    const o = await oRes.json();
    const a = await aRes.json();
    if (oRes.ok) setOpenings(Array.isArray(o) ? o : []);
    if (aRes.ok) setApplications(Array.isArray(a) ? a : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const addOpening = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchWithAuth("/admin/careers/openings", {
      method: "POST",
      body: JSON.stringify({
        slug: slug.trim().toLowerCase().replace(/\s+/g, "-"),
        title: title.trim(),
        type: type.trim(),
        team: team.trim(),
        location: location.trim() || null,
        order: 0,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Failed");
      return;
    }
    toast.success("Opening created");
    setSlug("");
    setTitle("");
    setTeam("");
    setLocation("");
    load();
  };

  const deleteOpening = async (id: string) => {
    if (!confirm("Delete this opening?")) return;
    const res = await fetchWithAuth(`/admin/careers/openings/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    load();
  };

  const setAppStatus = async (id: string, status: string) => {
    const res = await fetchWithAuth(`/admin/career-applications/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    toast.success("Updated");
    load();
  };

  const onOpenResume = async (id: string) => {
    setResumeOpeningId(id);
    try {
      await openResumeViaProxy(id);
    } finally {
      setResumeOpeningId(null);
    }
  };

  if (loading) return <AdminLoadingState message="Loading careers…" />;

  return (
    <div className="w-full min-w-0 space-y-10 pb-24">
      <AdminBreadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Careers & applications" }]}
      />
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Careers & applications</h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-500">
            Public job listings and inbound applications. Resumes are opened via an authenticated proxy so PDFs render
            in the browser.
          </p>
        </div>
      </div>

      <div className="rounded-2xl border border-emerald-200/40 bg-gradient-to-br from-emerald-50/80 via-white to-white p-6 shadow-sm">
        <h2 className={adminSectionHeading}>New job opening</h2>
        <form onSubmit={addOpening} className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className={adminLabel}>Slug (URL)</label>
            <input
              className={adminInput}
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="senior-engineer"
              required
            />
          </div>
          <div>
            <label className={adminLabel}>Title</label>
            <input className={adminInput} value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div>
            <label className={adminLabel}>Type</label>
            <input className={adminInput} value={type} onChange={(e) => setType(e.target.value)} />
          </div>
          <div>
            <label className={adminLabel}>Team</label>
            <input className={adminInput} value={team} onChange={(e) => setTeam(e.target.value)} required />
          </div>
          <div className="sm:col-span-2">
            <label className={adminLabel}>Location</label>
            <input className={adminInput} value={location} onChange={(e) => setLocation(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className={adminPrimaryBtn}>
              Add opening
            </button>
          </div>
        </form>
      </div>

      <div>
        <h2 className={`${adminSectionHeading} mb-3`}>Published openings</h2>
        {openings.length === 0 ? (
          <AdminEmptyState
            icon={Briefcase}
            title="No openings yet"
            description="Create a role above; it appears on the public careers pages."
          />
        ) : (
          <ul className="space-y-3">
            {openings.map((o) => (
              <li key={o._id} className={adminListRow}>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-900">{o.title}</p>
                  <p className="text-xs text-neutral-500">{o.slug}</p>
                </div>
                <button type="button" className={adminDangerLink} onClick={() => deleteOpening(o._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <h2 className={adminSectionHeading}>Applications</h2>
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-900">
            {applications.length} total
          </span>
        </div>
        {applications.length === 0 ? (
          <AdminEmptyState icon={Briefcase} title="No applications yet" description="Submissions will appear here." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left text-sm">
                <thead className="border-b border-neutral-100 bg-[#f6faf8] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                  <tr>
                    <th className="w-10 px-3 py-3" />
                    <th className="px-3 py-3">Name</th>
                    <th className="px-3 py-3">Email</th>
                    <th className="px-3 py-3">Role</th>
                    <th className="px-3 py-3">Resume</th>
                    <th className="px-3 py-3">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <Fragment key={app._id}>
                      <tr className="border-b border-neutral-100 transition hover:bg-emerald-50/40">
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-emerald-100/80 hover:text-emerald-800"
                            onClick={() => setExpandedAppId((id) => (id === app._id ? null : app._id))}
                            aria-expanded={expandedAppId === app._id}
                          >
                            {expandedAppId === app._id ? "▼" : "▶"}
                          </button>
                        </td>
                        <td className="px-3 py-3 font-medium text-neutral-900">{app.name}</td>
                        <td className="px-3 py-3">
                          <a href={`mailto:${app.email}`} className="font-medium text-emerald-700 hover:underline">
                            {app.email}
                          </a>
                        </td>
                        <td className="px-3 py-3 text-neutral-700">{app.position}</td>
                        <td className="px-3 py-3">
                          <button
                            type="button"
                            disabled={!app.resume?.url || resumeOpeningId === app._id}
                            onClick={() => onOpenResume(app._id)}
                            className={`${adminEditLink} disabled:opacity-40`}
                          >
                            {resumeOpeningId === app._id ? "Opening…" : "View resume"}
                          </button>
                        </td>
                        <td className="px-3 py-3">
                          <select
                            className={`${adminSelect} max-w-[12rem] py-2 text-xs`}
                            value={app.status}
                            onChange={(e) => setAppStatus(app._id, e.target.value)}
                          >
                            {APP_STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s.replace(/_/g, " ")}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                      {expandedAppId === app._id && (
                        <tr className="border-b border-neutral-100 bg-[#f9fdfb]">
                          <td colSpan={6} className="px-4 py-4">
                            <div className={`${adminFormCard} !shadow-none`}>
                              <p className="text-xs text-neutral-500">
                                <span className="font-semibold text-neutral-700">Submitted:</span>{" "}
                                {new Date(app.submittedAt).toLocaleString(undefined, {
                                  dateStyle: "medium",
                                  timeStyle: "short",
                                })}
                                {app.phone ? (
                                  <>
                                    {" "}
                                    · <span className="font-semibold text-neutral-700">Phone:</span> {app.phone}
                                  </>
                                ) : null}
                              </p>
                              {app.coverLetter ? (
                                <div className="mt-3">
                                  <p className={adminCardSectionTitle}>Cover letter</p>
                                  <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">{app.coverLetter}</p>
                                </div>
                              ) : null}
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
