"use client";

import { Fragment, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MessageSquare } from "lucide-react";
import { fetchWithAuth } from "@/lib/apiHelper";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminLoadingState } from "@/components/admin/AdminLoadingState";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import { adminFormCard, adminSelect, adminSectionHeading } from "@/lib/adminUi";

const STATUSES = ["prospect", "viewed", "replied", "no_response", "deal"] as const;

function normalizeLeadStatus(s: string): (typeof STATUSES)[number] {
  if (STATUSES.includes(s as (typeof STATUSES)[number])) return s as (typeof STATUSES)[number];
  if (s === "new" || s === "read") return "viewed";
  if (s === "archived") return "no_response";
  return "prospect";
}

type Row = {
  _id: string;
  name: string;
  email: string;
  company?: string;
  projectType?: string;
  budget?: string;
  timeline?: string;
  message: string;
  status: string;
  submittedAt: string;
};

export default function AdminQueriesPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetchWithAuth("/admin/contacts");
    const data = await res.json();
    if (res.ok) setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const setStatus = async (id: string, status: string) => {
    const res = await fetchWithAuth(`/admin/contacts/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    toast.success("Status updated");
    load();
  };

  if (loading) return <AdminLoadingState message="Loading inquiries…" />;

  return (
    <div className="w-full min-w-0 space-y-8 pb-24">
      <AdminBreadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Contact queries" }]} />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Contact queries</h1>
          <p className="mt-1 max-w-2xl text-sm text-neutral-500">
            Portfolio “Get in touch” submissions. Expand a row for the full message and project details.
          </p>
        </div>
        <span className="shrink-0 self-start rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-900">
          {rows.length} {rows.length === 1 ? "inquiry" : "inquiries"}
        </span>
      </div>

      {rows.length === 0 ? (
        <AdminEmptyState
          icon={MessageSquare}
          title="No queries yet"
          description="When visitors submit the contact form, entries will show up in this table."
        />
      ) : (
        <div className="overflow-hidden rounded-xl border border-neutral-200/80 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="border-b border-neutral-100 bg-[#f6faf8] text-[10px] font-bold uppercase tracking-wider text-neutral-500">
                <tr>
                  <th className="w-10 px-3 py-3" />
                  <th className="px-3 py-3">Name</th>
                  <th className="px-3 py-3">Email</th>
                  <th className="px-3 py-3">Company</th>
                  <th className="px-3 py-3">Status</th>
                  <th className="px-3 py-3">Submitted</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <Fragment key={r._id}>
                    <tr className="border-b border-neutral-100 transition hover:bg-emerald-50/40">
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          className="flex h-8 w-8 items-center justify-center rounded-lg text-neutral-500 hover:bg-emerald-100/80 hover:text-emerald-800"
                          onClick={() => setExpandedId((id) => (id === r._id ? null : r._id))}
                          aria-expanded={expandedId === r._id}
                        >
                          {expandedId === r._id ? "▼" : "▶"}
                        </button>
                      </td>
                      <td className="px-3 py-3 font-medium text-neutral-900">{r.name}</td>
                      <td className="px-3 py-3">
                        <a href={`mailto:${r.email}`} className="font-medium text-emerald-700 hover:underline">
                          {r.email}
                        </a>
                      </td>
                      <td className="px-3 py-3 text-neutral-600">{r.company ?? "—"}</td>
                      <td className="px-3 py-3">
                        <select
                          className={`${adminSelect} max-w-[11rem] py-2 text-xs`}
                          value={normalizeLeadStatus(r.status)}
                          onChange={(e) => setStatus(r._id, e.target.value)}
                        >
                          {STATUSES.map((s) => (
                            <option key={s} value={s}>
                              {s.replace("_", " ")}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-3 py-3 tabular-nums text-neutral-500">
                        {new Date(r.submittedAt).toLocaleString(undefined, {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </td>
                    </tr>
                    {expandedId === r._id && (
                      <tr className="border-b border-neutral-100 bg-[#f9fdfb]">
                        <td colSpan={6} className="px-4 py-4">
                          <div className={`${adminFormCard} !shadow-none`}>
                            <p className={adminSectionHeading}>Message</p>
                            <p className="mt-2 whitespace-pre-wrap text-sm text-neutral-700">{r.message}</p>
                            {(r.projectType || r.budget || r.timeline) && (
                              <ul className="mt-4 grid gap-3 sm:grid-cols-3">
                                {r.projectType ? (
                                  <li className="rounded-lg border border-emerald-100/80 bg-emerald-50/50 px-3 py-2 text-sm">
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                                      Project
                                    </span>
                                    <p className="mt-1 text-neutral-800">{r.projectType}</p>
                                  </li>
                                ) : null}
                                {r.budget ? (
                                  <li className="rounded-lg border border-emerald-100/80 bg-emerald-50/50 px-3 py-2 text-sm">
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                                      Budget
                                    </span>
                                    <p className="mt-1 text-neutral-800">{r.budget}</p>
                                  </li>
                                ) : null}
                                {r.timeline ? (
                                  <li className="rounded-lg border border-emerald-100/80 bg-emerald-50/50 px-3 py-2 text-sm">
                                    <span className="text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                                      Timeline
                                    </span>
                                    <p className="mt-1 text-neutral-800">{r.timeline}</p>
                                  </li>
                                ) : null}
                              </ul>
                            )}
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
  );
}
