"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { Building2 } from "lucide-react";
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
  adminSelect,
  adminTextarea,
} from "@/lib/adminUi";

const ICON_IDS = ["healthcare", "fintech", "ecommerce", "edtech", "media", "construction"] as const;

type Slide = {
  _id: string;
  iconId: (typeof ICON_IDS)[number];
  title: string;
  watermark: string;
  imageUrl: string;
  imageLabel: string;
  areas: string[];
  statProjects: string;
  statUptime: string;
  order: number;
};

const empty: Omit<Slide, "_id"> = {
  iconId: "healthcare",
  title: "",
  watermark: "",
  imageUrl: "",
  imageLabel: "",
  areas: [],
  statProjects: "",
  statUptime: "",
  order: 0,
};

export default function AdminIndustriesPage() {
  const [rows, setRows] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [areasText, setAreasText] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    const res = await fetchWithAuth("/admin/industry-slides");
    const data = await res.json();
    if (res.ok) setRows(Array.isArray(data) ? data : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      areas: areasText
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const url = editingId ? `/admin/industry-slides/${editingId}` : "/admin/industry-slides";
    const res = await fetchWithAuth(url, { method: editingId ? "PUT" : "POST", body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Save failed");
      return;
    }
    toast.success(editingId ? "Updated" : "Created");
    setForm(empty);
    setAreasText("");
    setEditingId(null);
    load();
  };

  const edit = (s: Slide) => {
    setEditingId(s._id);
    setForm({
      iconId: s.iconId,
      title: s.title,
      watermark: s.watermark ?? "",
      imageUrl: s.imageUrl,
      imageLabel: s.imageLabel ?? "",
      areas: s.areas ?? [],
      statProjects: s.statProjects ?? "",
      statUptime: s.statUptime ?? "",
      order: s.order ?? 0,
    });
    setAreasText((s.areas ?? []).join("\n"));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete slide?")) return;
    const res = await fetchWithAuth(`/admin/industry-slides/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    load();
  };

  if (loading) return <AdminLoadingState message="Loading industry slides…" />;

  return (
    <div className="w-full min-w-0 space-y-10 pb-20">
      <AdminBreadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Home — industries" }]} />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Home — industries carousel</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">
          Each slide maps to a fixed icon blueprint (healthcare, fintech, …) used in the homepage animation.
        </p>
      </div>

      <form onSubmit={save} className={`${adminFormCard} space-y-4`}>
        <h2 className={adminSectionHeading}>{editingId ? "Edit slide" : "New slide"}</h2>
        {editingId && (
          <button
            type="button"
            className={adminCancelLink}
            onClick={() => {
              setEditingId(null);
              setForm(empty);
              setAreasText("");
            }}
          >
            Cancel edit
          </button>
        )}
        <div>
          <label className={adminLabel}>Icon / blueprint id</label>
          <select
            className={adminSelect}
            value={form.iconId}
            onChange={(e) => setForm((f) => ({ ...f, iconId: e.target.value as (typeof ICON_IDS)[number] }))}
          >
            {ICON_IDS.map((id) => (
              <option key={id} value={id}>
                {id}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={adminLabel}>Hero image</label>
          <ImageUploader
            defaultImage={form.imageUrl}
            onUploadSuccess={({ imageUrl }) => setForm((f) => ({ ...f, imageUrl }))}
          />
        </div>
        {(["title", "watermark", "imageLabel", "statProjects", "statUptime"] as const).map((field) => (
          <div key={field}>
            <label className={adminLabel}>{field}</label>
            <input
              className={adminInput}
              value={form[field]}
              onChange={(e) => setForm((f) => ({ ...f, [field]: e.target.value }))}
            />
          </div>
        ))}
        <div>
          <label className={adminLabel}>Focus list (one line per item)</label>
          <textarea className={adminTextarea} rows={5} value={areasText} onChange={(e) => setAreasText(e.target.value)} />
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
        <button type="submit" className={adminPrimaryBtn}>
          {editingId ? "Update slide" : "Create slide"}
        </button>
      </form>

      <div>
        <h2 className={`${adminSectionHeading} mb-3`}>Slides</h2>
        {rows.length === 0 ? (
          <AdminEmptyState
            icon={Building2}
            title="No slides yet"
            description="Add slides to power the homepage “Solutions by industry” carousel."
          />
        ) : (
          <ul className="space-y-3">
            {rows.map((r) => (
              <li key={r._id} className={adminListRow}>
                <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200/80">
                  {r.imageUrl ? (
                    <Image src={r.imageUrl} alt="" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">No image</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-900">{r.title}</p>
                  <p className="text-xs text-neutral-500">
                    {r.iconId} · order {r.order}
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
