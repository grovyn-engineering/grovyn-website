"use client";

import type { LucideIcon } from "lucide-react";

export function AdminEmptyState({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon?: LucideIcon;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-200 bg-gradient-to-b from-neutral-50/90 via-white to-white px-6 py-14 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] sm:py-16">
      {Icon ? (
        <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/15">
          <Icon className="h-7 w-7" strokeWidth={1.5} />
        </div>
      ) : null}
      <h3 className="text-base font-semibold tracking-tight text-neutral-900">{title}</h3>
      {description ? <p className="mt-2 max-w-md text-sm leading-relaxed text-neutral-500">{description}</p> : null}
      {children ? <div className="mt-8 flex flex-wrap items-center justify-center gap-3">{children}</div> : null}
    </div>
  );
}
