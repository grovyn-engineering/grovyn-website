"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type AdminBreadcrumbItem = {
  label: string;
  href?: string;
  onNavigate?: () => void;
};

export function AdminBreadcrumbs({ items }: { items: AdminBreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-3 min-w-0">
      <ol className="flex flex-wrap items-center gap-x-1 gap-y-1 text-sm">
        {items.map((item, i) => {
          const isLast = i === items.length - 1;
          return (
            <li key={`${item.label}-${i}`} className="flex min-w-0 items-center gap-1">
              {i > 0 ? (
                <ChevronRight className="h-3.5 w-3.5 shrink-0 text-neutral-400" strokeWidth={2} aria-hidden />
              ) : null}
              {isLast ? (
                <span className="truncate font-medium text-neutral-800" aria-current="page">
                  {item.label}
                </span>
              ) : item.onNavigate ? (
                <button
                  type="button"
                  onClick={item.onNavigate}
                  className="truncate rounded-sm text-neutral-500 transition-colors hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-2"
                >
                  {item.label}
                </button>
              ) : item.href ? (
                <Link
                  href={item.href}
                  className="truncate rounded-sm text-neutral-500 transition-colors hover:text-emerald-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/30 focus-visible:ring-offset-2"
                >
                  {item.label}
                </Link>
              ) : (
                <span className="truncate text-neutral-500">{item.label}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
