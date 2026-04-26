"use client";

import Link from "next/link";
import {
  FolderKanban,
  Tags,
  LayoutGrid,
  MessageSquare,
  Building2,
  MessageSquareQuote,
  Briefcase,
  BookOpen,
  Users,
  type LucideIcon,
} from "lucide-react";
import { AdminBreadcrumbs } from "@/components/admin/AdminBreadcrumbs";
import { useAdminDashboardStats, type AdminDashboardStats } from "@/hooks/useAdminDashboardStats";

const quickLinks: {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  statKey?: keyof AdminDashboardStats;
}[] = [
  {
    href: "/admin/categories",
    title: "Portfolio categories",
    description: "Filter chips on the portfolio page. Each project picks one category.",
    icon: Tags,
    statKey: "categories",
  },
  {
    href: "/admin/portfolio",
    title: "Portfolio projects",
    description: "Carousel and grid: Cloudinary imagery, copy, metrics, and outbound links.",
    icon: FolderKanban,
    statKey: "portfolioProjects",
  },
  {
    href: "/admin/selected-work",
    title: "Selected work",
    description: "Four editorial cards; layout on the site is fixed.",
    icon: LayoutGrid,
  },
  {
    href: "/admin/industries",
    title: "Home — industries",
    description: "Homepage carousel: hero image, focus list, and stats per slide.",
    icon: Building2,
    statKey: "industrySlides",
  },
  {
    href: "/admin/testimonials",
    title: "Testimonials",
    description: "Logos, ratings, and quotes for the homepage carousel.",
    icon: MessageSquareQuote,
    statKey: "testimonials",
  },
  {
    href: "/admin/queries",
    title: "Contact queries",
    description: "Inquiries from the portfolio form with pipeline status.",
    icon: MessageSquare,
    statKey: "contacts",
  },
  {
    href: "/admin/careers",
    title: "Careers",
    description: "Job openings and applications with resume preview.",
    icon: Briefcase,
    statKey: "careerApplications",
  },
  {
    href: "/admin/users",
    title: "Admin users",
    description: "Invite or remove dashboard operators; new users receive a password by email.",
    icon: Users,
  },
];

const summaryCards: {
  label: string;
  statKey: keyof AdminDashboardStats;
  icon: LucideIcon;
}[] = [
  { label: "Categories", statKey: "categories", icon: Tags },
  { label: "Portfolio projects", statKey: "portfolioProjects", icon: FolderKanban },
  { label: "Industry slides", statKey: "industrySlides", icon: Building2 },
  { label: "Testimonials", statKey: "testimonials", icon: MessageSquareQuote },
];

export default function AdminHome() {
  const { stats, loading, error } = useAdminDashboardStats();

  if (error && !stats) {
    return (
      <div className="w-full rounded-xl border border-red-200 bg-red-50 px-4 py-6 text-sm text-red-700">
        Could not load dashboard stats: {error}
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 space-y-10">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0 flex-1 space-y-4">
          <AdminBreadcrumbs items={[{ label: "Admin", href: "/admin" }, { label: "Dashboard" }]} />
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">Admin dashboard</h1>
            <p className="mt-1 max-w-2xl text-sm text-neutral-500">
              Manage Grovyn’s live content from one place. Counts reflect your database; open a section to edit.
            </p>
          </div>
        </div>
        <div className="shrink-0 rounded-lg border border-neutral-200/70 bg-gradient-to-b from-neutral-50/90 to-neutral-50/40 px-3 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] lg:max-w-[220px] lg:text-right">
          <div className="flex items-center justify-between gap-2 lg:justify-end">
            <p className="min-w-0 text-sm font-semibold leading-snug text-neutral-900">Grovyn CMS</p>
            <span
              className="shrink-0 rounded-md bg-emerald-500/14 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-900 ring-1 ring-emerald-500/25"
              title="Content management"
            >
              Live
            </span>
          </div>
          <p className="mt-2 border-t border-neutral-200/60 pt-2 text-[11px] leading-relaxed text-neutral-500 lg:text-right">
            Portfolio & marketing content
          </p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {summaryCards.map(({ label, statKey, icon: Icon }) => (
          <div
            key={statKey}
            className="flex items-center justify-between rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm"
          >
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
              <p className="mt-1 text-3xl font-semibold tabular-nums text-neutral-900">
                {loading ? "—" : stats?.[statKey] ?? 0}
              </p>
            </div>
            <Icon className="h-11 w-11 text-emerald-500/25" strokeWidth={1.25} />
          </div>
        ))}
      </div>

      <div>
        <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-neutral-500">Manage content</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {quickLinks.map(({ href, title, description, icon: Icon, statKey }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col rounded-xl border border-neutral-200/80 bg-white p-5 shadow-sm transition hover:border-emerald-400/50 hover:shadow-md"
            >
              <Icon className="mb-3 h-8 w-8 text-emerald-600" strokeWidth={1.5} />
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-neutral-900">{title}</h3>
                {statKey && stats && (
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-xs font-medium tabular-nums text-neutral-600">
                    {stats[statKey]}
                  </span>
                )}
              </div>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-neutral-500">{description}</p>
              <span className="mt-4 text-xs font-semibold text-emerald-700 opacity-0 transition group-hover:opacity-100">
                Open →
              </span>
            </Link>
          ))}
        </div>
      </div>

      <p className="flex items-center gap-2 text-xs text-neutral-400">
        <BookOpen className="h-3.5 w-3.5" strokeWidth={2} />
        Tip: use breadcrumbs at the top of each page to jump back to the dashboard.
      </p>
    </div>
  );
}
