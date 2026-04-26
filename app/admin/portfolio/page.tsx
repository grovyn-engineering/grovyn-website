"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import Image from "next/image";
import { FolderKanban } from "lucide-react";
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

type Category = { _id: string; key: string; name: string };
type Project = {
  _id: string;
  name: string;
  categoryKey: string;
  categoryLabel: string;
  description: string;
  completedDate: string;
  metricsLabel: string;
  metricsValue: string;
  image: string;
  dossierId: string;
  url: string;
  techStack: string[];
  order: number;
};

const empty: Omit<Project, "_id"> = {
  name: "",
  categoryKey: "",
  categoryLabel: "",
  description: "",
  completedDate: "",
  metricsLabel: "",
  metricsValue: "",
  image: "",
  dossierId: "",
  url: "#",
  techStack: [],
  order: 0,
};

export default function AdminPortfolioPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(empty);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [techInput, setTechInput] = useState("");

  const load = useCallback(async () => {
    const [cRes, pRes] = await Promise.all([
      fetchWithAuth("/admin/categories"),
      fetchWithAuth("/admin/portfolio-projects"),
    ]);
    const c = await cRes.json();
    const p = await pRes.json();
    if (cRes.ok) setCategories(Array.isArray(c) ? c : []);
    if (pRes.ok) setProjects(Array.isArray(p) ? p : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const syncCategoryLabel = (key: string) => {
    const cat = categories.find((x) => x.key === key);
    return cat?.name ?? key;
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      categoryLabel: syncCategoryLabel(form.categoryKey),
      techStack: techInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    };
    const url = editingId ? `/admin/portfolio-projects/${editingId}` : "/admin/portfolio-projects";
    const res = await fetchWithAuth(url, { method: editingId ? "PUT" : "POST", body: JSON.stringify(payload) });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.message || "Save failed");
      return;
    }
    toast.success(editingId ? "Updated" : "Created");
    setForm(empty);
    setTechInput("");
    setEditingId(null);
    load();
  };

  const edit = (p: Project) => {
    setEditingId(p._id);
    setForm({
      name: p.name,
      categoryKey: p.categoryKey,
      categoryLabel: p.categoryLabel,
      description: p.description ?? "",
      completedDate: p.completedDate ?? "",
      metricsLabel: p.metricsLabel ?? "",
      metricsValue: p.metricsValue ?? "",
      image: p.image,
      dossierId: p.dossierId ?? "",
      url: p.url ?? "#",
      techStack: p.techStack ?? [],
      order: p.order ?? 0,
    });
    setTechInput((p.techStack ?? []).join(", "));
  };

  const remove = async (id: string) => {
    if (!confirm("Delete project?")) return;
    const res = await fetchWithAuth(`/admin/portfolio-projects/${id}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("Deleted");
    load();
  };

  if (loading) return <AdminLoadingState message="Loading projects…" />;

  return (
    <div className="w-full min-w-0 space-y-10 pb-20">
      <AdminBreadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Portfolio projects" }]}
      />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Portfolio projects</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">
          Carousel and filtered grid use the same list. Lower “order” values appear earlier in the carousel.
        </p>
      </div>

      <form onSubmit={save} className={`${adminFormCard} space-y-4`}>
        <h2 className={adminSectionHeading}>{editingId ? "Edit project" : "New project"}</h2>
        {editingId && (
          <button
            type="button"
            className={adminCancelLink}
            onClick={() => {
              setEditingId(null);
              setForm(empty);
              setTechInput("");
            }}
          >
            Cancel edit
          </button>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className={adminLabel}>Background image</label>
            <ImageUploader
              defaultImage={form.image}
              onUploadSuccess={({ imageUrl }) => setForm((f) => ({ ...f, image: imageUrl }))}
            />
          </div>
          <div>
            <label className={adminLabel}>Name</label>
            <input
              className={adminInput}
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className={adminLabel}>Category</label>
            <select
              className={adminSelect}
              value={form.categoryKey}
              onChange={(e) => setForm((f) => ({ ...f, categoryKey: e.target.value }))}
              required
            >
              <option value="">Select…</option>
              {categories.map((c) => (
                <option key={c._id} value={c.key}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={adminLabel}>Date (e.g. FEB 2024)</label>
            <input
              className={adminInput}
              value={form.completedDate}
              onChange={(e) => setForm((f) => ({ ...f, completedDate: e.target.value }))}
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
          <div>
            <label className={adminLabel}>Metric label</label>
            <input
              className={adminInput}
              value={form.metricsLabel}
              onChange={(e) => setForm((f) => ({ ...f, metricsLabel: e.target.value }))}
            />
          </div>
          <div>
            <label className={adminLabel}>Metric value</label>
            <input
              className={adminInput}
              value={form.metricsValue}
              onChange={(e) => setForm((f) => ({ ...f, metricsValue: e.target.value }))}
            />
          </div>
          <div>
            <label className={adminLabel}>Dossier / archive id</label>
            <input
              className={adminInput}
              value={form.dossierId}
              onChange={(e) => setForm((f) => ({ ...f, dossierId: e.target.value }))}
            />
          </div>
          <div>
            <label className={adminLabel}>Live URL (# if none)</label>
            <input
              className={adminInput}
              value={form.url}
              onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={adminLabel}>Description</label>
            <textarea
              className={adminTextarea}
              rows={3}
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            />
          </div>
          <div className="sm:col-span-2">
            <label className={adminLabel}>Tech stack (comma-separated)</label>
            <input className={adminInput} value={techInput} onChange={(e) => setTechInput(e.target.value)} />
          </div>
        </div>
        <button type="submit" className={adminPrimaryBtn}>
          {editingId ? "Update project" : "Create project"}
        </button>
      </form>

      <div>
        <h2 className={`${adminSectionHeading} mb-3`}>All projects</h2>
        {projects.length === 0 ? (
          <AdminEmptyState
            icon={FolderKanban}
            title="No projects yet"
            description="Create a project above to populate the portfolio carousel and grid."
          />
        ) : (
          <ul className="space-y-3">
            {projects.map((p) => (
              <li key={p._id} className={adminListRow}>
                <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-neutral-100 ring-1 ring-neutral-200/80">
                  {p.image ? (
                    <Image src={p.image} alt="" fill className="object-cover" unoptimized />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] text-neutral-400">No image</div>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-neutral-900">{p.name}</p>
                  <p className="text-xs text-neutral-500">
                    {p.categoryLabel} · order {p.order}
                  </p>
                </div>
                <div className="flex shrink-0 gap-4 opacity-100 sm:opacity-0 sm:transition-opacity sm:group-hover:opacity-100">
                  <button type="button" className={adminEditLink} onClick={() => edit(p)}>
                    Edit
                  </button>
                  <button type="button" className={adminDangerLink} onClick={() => remove(p._id)}>
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
