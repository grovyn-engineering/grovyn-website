"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { MessageSquareQuote } from "lucide-react";
import { fetchWithAuth } from "@/lib/apiHelper";
import ImageUploader from "@/components/admin/ImageUploader";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminLoadingState } from "@/components/admin/AdminLoadingState";
import { AdminEmptyState } from "@/components/admin/AdminEmptyState";
import {
  adminCancelLink,
  adminDangerLink,
  adminEditLink,
  adminFormCard,
  adminInput,
  adminLabel,
  adminListRow,
  adminPrimaryBtn,
  adminSectionHeading,
  adminTextarea,
} from "@/lib/adminUi";

type Row = {
  _id: string;
  logoUrl: string;
  rating: number;
  quote: string;
  customerName: string;
  subtitle: string;
  order: number;
};

const empty: Omit<Row, "_id"> = {
  logoUrl: "",
  rating: 5,
  quote: "",
  customerName: "",
  subtitle: "",
  order: 0,
};

export default function AdminTestimonialsPage() {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetchWithAuth("/admin/testimonials");
    const data = await res.json();
    if (res.ok) setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingId ? `/admin/testimonials/${editingId}` : "/admin/testimonials";
    const res = await fetchWithAuth(url, { method: editingId ? "PUT" : "POST", body: JSON.stringify(form) });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Save failed");
      return;
    }
    toast.success(editingId ? "Updated" : "Created");
    setForm(empty);
    setEditingId(null);
    load();
  };

  const edit = (r: Row) => {
    setEditingId(r._id);
    setForm({
      logoUrl: r.logoUrl,
      rating: r.rating,
      quote: r.quote,
      customerName: r.customerName,
      subtitle: r.subtitle ?? "",
      order: r.order ?? 0,
    });
  };

  const remove = async (id: string) => {
    if (!confirm("Delete testimonial?")) return;
    const res = await fetchWithAuth(`/admin/testimonials/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    load();
  };

  if (loading) return <AdminLoadingState message="Loading testimonials…" />;

  return (
    <div className="w-full min-w-0 space-y-10 pb-20">
      <AdminBreadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Testimonials" }]} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Testimonials</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">Homepage review carousel — logos, ratings, and quotes.</p>
      </div>

      <form onSubmit={save} className={`${adminFormCard} space-y-4`}>
        <h2 className={adminSectionHeading}>{editingId ? "Edit testimonial" : "New testimonial"}</h2>
        {editingId && (
          <button type="button" className={adminCancelLink} onClick={() => { setEditingId(null); setForm(empty); }}>
            Cancel edit
          </button>
        )}
        <div>
          <label className={adminLabel}>Logo</label>
          <ImageUploader
            defaultImage={form.logoUrl}
            onUploadSuccess={({ imageUrl }) => setForm((f) => ({ ...f, logoUrl: imageUrl }))}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className={adminLabel}>Customer name</label>
            <input
              className={adminInput}
              value={form.customerName}
              onChange={(e) => setForm((f) => ({ ...f, customerName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className={adminLabel}>Subtitle / industry</label>
            <input
              className={adminInput}
              value={form.subtitle}
              onChange={(e) => setForm((f) => ({ ...f, subtitle: e.target.value }))}
            />
          </div>
          <div>
            <label className={adminLabel}>Rating (0–5)</label>
            <input
              type="number"
              step="0.1"
              min={0}
              max={5}
              className={adminInput}
              value={form.rating}
              onChange={(e) => setForm((f) => ({ ...f, rating: Number(e.target.value) }))}
            />
          </div>
          <div>
            <label className={adminLabel}>Order</label>
            <input
              type="number"
              className={adminInput}
              value={form.order}
              onChange={(e) => setForm((f) => ({ ...f, order: Number(e.target.value) }))}
            />
          </div>
        </div>
        <div>
          <label className={adminLabel}>Quote</label>
          <textarea
            className={adminTextarea}
            rows={4}
            value={form.quote}
            onChange={(e) => setForm((f) => ({ ...f, quote: e.target.value }))}
            required
          />
        </div>
        <button type="submit" className={adminPrimaryBtn}>
          {editingId ? "Update" : "Create"}
        </button>
      </form>

      <div>
        <h2 className={`${adminSectionHeading} mb-3`}>Published testimonials</h2>
        {rows.length === 0 ? (
          <AdminEmptyState
            icon={MessageSquareQuote}
            title="No testimonials yet"
            description="Add quotes and logos to populate the homepage carousel."
          />
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={r._id} className={adminListRow}>
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                  {r.logoUrl ? (
                    <Image src={r.logoUrl} alt="" fill className="object-contain p-1" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[9px] text-neutral-400">—</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-900">{r.customerName}</p>
                  <p className="line-clamp-1 text-xs text-neutral-500">{r.quote}</p>
                  <p className="text-xs text-neutral-400">
                    {r.rating}/5 · order {r.order}
                  </p>
                </div>
                <div className="flex shrink-0 gap-4">
                  <button type="button" className={adminEditLink} onClick={() => edit(r)}>
                    Edit
                  </button>
                  <button type="button" className={adminDangerLink} onClick={() => remove(r._id)}>
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
