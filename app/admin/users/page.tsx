"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Users } from "lucide-react";
import { fetchWithAuth } from "@/lib/apiHelper";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminLoadingState } from "@/components/admin/AdminLoadingState";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import {
  adminFormCard,
  adminInput,
  adminLabel,
  adminPrimaryBtn,
  adminSectionHeading,
} from "@/lib/adminUi";

type AdminUserRow = {
  id: string;
  email: string;
  isActive: boolean;
  createdAt: string;
};

export default function AdminUsersPage() {
  const [rows, setRows] = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessionEmail, setSessionEmail] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [generatePassword, setGeneratePassword] = useState(true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    const [usersRes, meRes] = await Promise.all([
      fetchWithAuth("/admin/users", { method: "GET" }),
      fetchWithAuth("/admin/auth/me", { method: "GET" }),
    ]);
    const usersJson = await usersRes.json();
    const meJson = await meRes.json();
    if (usersRes.ok && usersJson.success && Array.isArray(usersJson.data)) {
      setRows(usersJson.data);
    } else {
      toast.error(usersJson.message || "Could not load users");
    }
    if (meRes.ok && meJson.success && typeof meJson.data?.email === "string") {
      setSessionEmail(meJson.data.email.trim().toLowerCase());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const invite = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    if (!generatePassword) {
      if (password.length < 8) {
        toast.error("Password must be at least 8 characters.");
        setSubmitting(false);
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match.");
        setSubmitting(false);
        return;
      }
    }

    const body: { email: string; generatePassword: boolean; password?: string } = {
      email: email.trim(),
      generatePassword,
    };
    if (!generatePassword) body.password = password;

    const res = await fetchWithAuth("/admin/users", {
      method: "POST",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    setSubmitting(false);

    if (!res.ok) {
      toast.error(data.message || "Failed to invite user");
      return;
    }

    toast.success(data.message || "Invite sent");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    load();
  };

  const remove = async (id: string, rowEmail: string) => {
    if (
      !confirm(
        `Remove admin access for ${rowEmail}? They will no longer be able to sign in.`,
      )
    ) {
      return;
    }
    const res = await fetchWithAuth(`/admin/users/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Could not remove user");
      return;
    }
    toast.success("User removed");
    load();
  };

  if (loading) return <AdminLoadingState message="Loading admin users…" />;

  return (
    <div className="w-full min-w-0 space-y-10 pb-20">
      <AdminBreadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Admin users" }]} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Admin users</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">
          Invite teammates with an email and initial password. The password is sent only by email. Everyone signs in
          with password plus a one-time code (same as your login).
        </p>
      </div>

      <form onSubmit={invite} className={`${adminFormCard} space-y-4`}>
        <h2 className={adminSectionHeading}>Invite admin</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={adminLabel} htmlFor="invite-email">
              Email
            </label>
            <input
              id="invite-email"
              className={adminInput}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              required
              autoComplete="off"
            />
          </div>
          <div className="sm:col-span-2 flex flex-col gap-2">
            <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
              <input
                type="checkbox"
                checked={generatePassword}
                onChange={(e) => setGeneratePassword(e.target.checked)}
                className="rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
              />
              Generate a strong password and email it (recommended)
            </label>
            {!generatePassword ? (
              <>
                <div>
                  <label className={adminLabel} htmlFor="invite-pass">
                    Initial password
                  </label>
                  <input
                    id="invite-pass"
                    className={adminInput}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <div>
                  <label className={adminLabel} htmlFor="invite-pass2">
                    Confirm password
                  </label>
                  <input
                    id="invite-pass2"
                    className={adminInput}
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={8}
                    autoComplete="new-password"
                  />
                </div>
                <p className="text-xs text-neutral-500">
                  The same password will be emailed to the user so they can sign in.
                </p>
              </>
            ) : null}
          </div>
        </div>
        <button type="submit" disabled={submitting} className={adminPrimaryBtn}>
          {submitting ? "Sending…" : "Send invite"}
        </button>
      </form>

      <div>
        <h2 className={adminSectionHeading}>Accounts ({rows.length})</h2>
        {rows.length === 0 ? (
          <AdminEmptyState
            icon={Users}
            title="No admin users"
            description="Bootstrap or invite the first account above."
          />
        ) : (
          <ul className="mt-4 divide-y divide-neutral-200 rounded-xl border border-neutral-200 bg-white">
            {rows.map((row) => {
              const isSelf = sessionEmail === row.email.trim().toLowerCase();
              return (
                <li
                  key={row.id}
                  className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-neutral-900">{row.email}</p>
                    <p className="text-xs text-neutral-500">
                      Added {new Date(row.createdAt).toLocaleString()}
                      {isSelf ? " · You" : ""}
                      {!row.isActive ? " · Inactive" : ""}
                    </p>
                  </div>
                  <button
                    type="button"
                    disabled={isSelf || rows.length <= 1}
                    onClick={() => remove(row.id, row.email)}
                    className="shrink-0 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-800 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-40"
                    title={
                      isSelf
                        ? "You cannot remove your own account here"
                        : rows.length <= 1
                          ? "Keep at least one admin"
                          : "Remove this admin"
                    }
                  >
                    Remove
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
