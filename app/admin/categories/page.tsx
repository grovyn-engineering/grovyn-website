"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Tags } from "lucide-react";
import { fetchWithAuth } from "@/lib/apiHelper";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminLoadingState } from "@/components/admin/AdminLoadingState";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import {
  adminDangerLink,
  adminFormCard,
  adminInput,
  adminLabel,
  adminListRow,
  adminPrimaryBtn,
  adminSectionHeading,
} from "@/lib/adminUi";

type Category = {
  _id: string;
  key: string;
  name: string;
  iconKey: string;
  order: number;
};

export default function AdminCategoriesPage() {
  const [rows, setRows] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [key, setKey] = useState("");
  const [name, setName] = useState("");
  const [iconKey, setIconKey] = useState("layers");
  const [order, setOrder] = useState(0);

  const load = useCallback(async () => {
    const res = await fetchWithAuth("/admin/categories");
    const data = await res.json();
    if (res.ok) setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchWithAuth("/admin/categories", {
      method: "POST",
      body: JSON.stringify({
        key: key.trim().toLowerCase().replace(/\s+/g, "-"),
        name: name.trim(),
        iconKey,
        order: Number(order),
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Failed");
      return;
    }
    toast.success("Category added");
    setKey("");
    setName("");
    setIconKey("layers");
    setOrder(0);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category? Projects still referencing its key may need updating.")) return;
    const res = await fetchWithAuth(`/admin/categories/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    load();
  };

  if (loading) return <AdminLoadingState message="Loading categories…" />;

  return (
    <div className="w-full min-w-0 space-y-10 pb-20">
      <AdminBreadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Portfolio categories" }]}
      />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Portfolio categories</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">
          Used for portfolio filters and when assigning each project to a chip.
        </p>
      </div>

      <form onSubmit={add} className={`${adminFormCard} space-y-4`}>
        <h2 className={adminSectionHeading}>Add category</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={adminLabel}>Key (slug)</label>
            <input
              className={adminInput}
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="construction"
              required
            />
          </div>
          <div>
            <label className={adminLabel}>Display name</label>
            <input
              className={adminInput}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Construction"
              required
            />
          </div>
          <div>
            <label className={adminLabel}>Icon (Lucide id)</label>
            <input
              className={adminInput}
              value={iconKey}
              onChange={(e) => setIconKey(e.target.value)}
              placeholder="layers"
            />
          </div>
          <div>
            <label className={adminLabel}>Order</label>
            <input
              type="number"
              className={adminInput}
              value={order}
              onChange={(e) => setOrder(Number(e.target.value))}
            />
          </div>
        </div>
        <button type="submit" className={adminPrimaryBtn}>
          Add category
        </button>
      </form>

      <div>
        <h2 className={`${adminSectionHeading} mb-3`}>Current categories</h2>
        {rows.length === 0 ? (
          <AdminEmptyState
            icon={Tags}
            title="No categories yet"
            description="Add at least one category before creating portfolio projects."
          />
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={r._id} className={adminListRow}>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-900">{r.name}</p>
                  <p className="text-xs text-neutral-500">
                    {r.key} · icon:{r.iconKey} · order {r.order}
                  </p>
                </div>
                <button type="button" className={adminDangerLink} onClick={() => remove(r._id)}>
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
