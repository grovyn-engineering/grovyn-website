"use client";

import { useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { fetchWithAuth } from "@/lib/apiHelper";
import ImageUploader from "@/components/admin/ImageUploader";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { AdminLoadingState } from "@/components/admin/AdminLoadingState";
import type { SelectedWorkDoc } from "@/lib/cms";
import {
  adminCardSectionTitle,
  adminFormCard,
  adminInput,
  adminLabel,
  adminPrimaryBtn,
  adminTextarea,
} from "@/lib/adminUi";

const blank: SelectedWorkDoc = {
  card1: {},
  card2: {},
  card3: {},
  card4: {},
};

export default function AdminSelectedWorkPage() {
  const [data, setData] = useState<SelectedWorkDoc>(blank);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const res = await fetchWithAuth("/admin/selected-work");
    const j = await res.json();
    if (res.ok) {
      setData({
        card1: { ...blank.card1, ...j.card1 },
        card2: { ...blank.card2, ...j.card2 },
        card3: { ...blank.card3, ...j.card3 },
        card4: { ...blank.card4, ...j.card4 },
      });
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetchWithAuth("/admin/selected-work", { method: "PUT", body: JSON.stringify(data) });
    const j = await res.json();
    if (!res.ok) {
      toast.error(j.message || "Save failed");
      return;
    }
    toast.success("Saved");
    setData({
      card1: { ...blank.card1, ...j.card1 },
      card2: { ...blank.card2, ...j.card2 },
      card3: { ...blank.card3, ...j.card3 },
      card4: { ...blank.card4, ...j.card4 },
    });
  };

  if (loading) return <AdminLoadingState message="Loading selected work…" />;

  const section = `${adminFormCard} space-y-4`;

  return (
    <div className="w-full min-w-0 space-y-10 pb-24">
      <AdminBreadcrumbs
        items={[{ label: "Admin", href: "/admin" }, { label: "Selected work (4 cards)" }]}
      />
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Selected work (4 cards)</h1>
        <p className="mt-1 max-w-2xl text-sm text-neutral-500">
          Layout on the portfolio page is fixed; only the content below changes.
        </p>
      </div>

      <form onSubmit={save} className="space-y-8">
        <section className={section}>
          <h2 className={adminCardSectionTitle}>Card 1 — Large image (top left)</h2>
          <ImageUploader
            defaultImage={data.card1.backgroundImage}
            onUploadSuccess={({ imageUrl }) => setData((d) => ({ ...d, card1: { ...d.card1, backgroundImage: imageUrl } }))}
          />
          {["archiveTag", "title", "footerLeftLabel", "footerLeftValue", "footerRightLabel", "footerRightValue"].map((field) => (
            <div key={field}>
              <label className={adminLabel}>{field}</label>
              <input
                className={adminInput}
                value={(data.card1 as Record<string, string>)[field] ?? ""}
                onChange={(e) => setData((d) => ({ ...d, card1: { ...d.card1, [field]: e.target.value } }))}
              />
            </div>
          ))}
          <label className="flex cursor-pointer items-center gap-2 text-sm text-neutral-700">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-neutral-300 text-emerald-600 focus:ring-emerald-500"
              checked={data.card1.footerLeftAccent !== false}
              onChange={(e) => setData((d) => ({ ...d, card1: { ...d.card1, footerLeftAccent: e.target.checked } }))}
            />
            Footer left value in accent green
          </label>
        </section>

        <section className={section}>
          <h2 className={adminCardSectionTitle}>Card 2 — Compact (top right)</h2>
          {(["tagIcon", "tagText", "title", "description", "bottomId"] as const).map((field) => (
            <div key={field}>
              <label className={adminLabel}>{field}</label>
              {field === "description" ? (
                <textarea
                  className={adminTextarea}
                  rows={3}
                  value={data.card2[field] ?? ""}
                  onChange={(e) => setData((d) => ({ ...d, card2: { ...d.card2, [field]: e.target.value } }))}
                />
              ) : (
                <input
                  className={adminInput}
                  value={data.card2[field] ?? ""}
                  onChange={(e) => setData((d) => ({ ...d, card2: { ...d.card2, [field]: e.target.value } }))}
                />
              )}
            </div>
          ))}
        </section>

        <section className={section}>
          <h2 className={adminCardSectionTitle}>Card 3 — Logo focus (bottom left)</h2>
          <div>
            <label className={adminLabel}>Logo image</label>
            <ImageUploader
              defaultImage={data.card3.logoImage}
              onUploadSuccess={({ imageUrl }) => setData((d) => ({ ...d, card3: { ...d.card3, logoImage: imageUrl } }))}
            />
          </div>
          <div>
            <label className={adminLabel}>Optional background image</label>
            <ImageUploader
              defaultImage={data.card3.backgroundImage}
              onUploadSuccess={({ imageUrl }) => setData((d) => ({ ...d, card3: { ...d.card3, backgroundImage: imageUrl } }))}
            />
          </div>
          {(["tagIcon", "tagText", "title", "bottomId"] as const).map((field) => (
            <div key={field}>
              <label className={adminLabel}>{field}</label>
              <input
                className={adminInput}
                value={data.card3[field] ?? ""}
                onChange={(e) => setData((d) => ({ ...d, card3: { ...d.card3, [field]: e.target.value } }))}
              />
            </div>
          ))}
        </section>

        <section className={section}>
          <h2 className={adminCardSectionTitle}>Card 4 — Large (bottom right)</h2>
          <ImageUploader
            defaultImage={data.card4.backgroundImage}
            onUploadSuccess={({ imageUrl }) => setData((d) => ({ ...d, card4: { ...d.card4, backgroundImage: imageUrl } }))}
          />
          {(["tagIcon", "tagText", "title", "description", "footerLabel", "footerValue"] as const).map((field) => (
            <div key={field}>
              <label className={adminLabel}>{field}</label>
              {field === "description" ? (
                <textarea
                  className={adminTextarea}
                  rows={3}
                  value={data.card4[field] ?? ""}
                  onChange={(e) => setData((d) => ({ ...d, card4: { ...d.card4, [field]: e.target.value } }))}
                />
              ) : (
                <input
                  className={adminInput}
                  value={data.card4[field] ?? ""}
                  onChange={(e) => setData((d) => ({ ...d, card4: { ...d.card4, [field]: e.target.value } }))}
                />
              )}
            </div>
          ))}
          <div>
            <label className={adminLabel}>Tech chips (comma-separated)</label>
            <input
              className={adminInput}
              value={(data.card4.techChips ?? []).join(", ")}
              onChange={(e) =>
                setData((d) => ({
                  ...d,
                  card4: {
                    ...d.card4,
                    techChips: e.target.value
                      .split(",")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  },
                }))
              }
            />
          </div>
        </section>

        <button type="submit" className={`${adminPrimaryBtn} px-8`}>
          Save all cards
        </button>
      </form>
    </div>
  );
}
