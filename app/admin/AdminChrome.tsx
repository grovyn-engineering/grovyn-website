"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { fetchWithAuth } from "@/lib/apiHelper";
import { clearAdminToken } from "@/lib/adminToken";
import { Toaster } from "react-hot-toast";
import {
  LayoutDashboard,
  FolderKanban,
  Tags,
  LayoutGrid,
  MessageSquare,
  Building2,
  MessageSquareQuote,
  Briefcase,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { FourDotsLoader } from "@/components/admin/FourDotsLoader";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/categories", label: "Portfolio categories", icon: Tags },
  { href: "/admin/portfolio", label: "Portfolio projects", icon: FolderKanban },
  { href: "/admin/selected-work", label: "Selected work (4 cards)", icon: LayoutGrid },
  { href: "/admin/industries", label: "Home industries", icon: Building2 },
  { href: "/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/admin/queries", label: "Contact queries", icon: MessageSquare },
  { href: "/admin/careers", label: "Careers & applications", icon: Briefcase },
  { href: "/admin/users", label: "Admin users", icon: Users },
];

function navActive(pathname: string, href: string, exact?: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function AdminChrome({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    let cancelled = false;

    const verifyAuth = async () => {
      if (isLoginPage) {
        try {
          const res = await fetchWithAuth("/admin/auth/me", { method: "GET" });
          const data = await res.json();
          if (cancelled) return;
          if (data.success) {
            router.replace("/admin");
            return;
          }
          clearAdminToken();
        } catch {
          if (!cancelled) clearAdminToken();
        }
        if (!cancelled) setLoading(false);
        return;
      }

      try {
        const res = await fetchWithAuth("/admin/auth/me", { method: "GET" });
        const data = await res.json();
        if (cancelled) return;
        if (data.success) {
          setIsAuthenticated(true);
          const email = data.data?.email;
          if (typeof email === "string" && email.length > 0) setAdminEmail(email);
        } else {
          clearAdminToken();
          router.push("/admin/login");
        }
      } catch {
        if (!cancelled) router.push("/admin/login");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    verifyAuth();
    return () => {
      cancelled = true;
    };
  }, [router, isLoginPage]);

  const handleLogout = async () => {
    await fetchWithAuth("/admin/auth/logout", { method: "POST" });
    clearAdminToken();
    router.push("/admin/login");
  };

  if (loading) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-3 bg-white">
        <FourDotsLoader size="lg" aria-label="Verifying session" />
        <p className="text-sm text-neutral-500">Loading admin…</p>
      </div>
    );
  }

  if (isLoginPage) return <>{children}</>;
  if (!isAuthenticated) return null;

  const SidebarNav = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex flex-col gap-1 px-3 py-4" aria-label="Admin sections">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const active = navActive(pathname, href, exact);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            className={`flex items-center gap-2 rounded-xl px-3.5 py-3 text-[15px] leading-snug transition ${
              active
                ? "bg-[#10b981]/12 font-semibold text-emerald-900 ring-1 ring-[#10b981]/25"
                : "text-neutral-600 hover:bg-white/80 hover:text-neutral-900"
            }`}
          >
            <span
              className={`flex w-8 shrink-0 items-center justify-center ${active ? "text-[#10b981]" : "text-neutral-400"}`}
              aria-hidden
            >
              <Icon className="h-[18px] w-[18px]" strokeWidth={active ? 2.25 : 1.75} />
            </span>
            <span className="min-w-0 flex-1">{label}</span>
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="flex h-dvh max-h-dvh flex-col overflow-hidden bg-white text-neutral-900">
      <Toaster
        position="bottom-right"
        toastOptions={{
          className: "text-sm",
          style: {
            background: "#fff",
            color: "#292524",
            border: "1px solid #e7e5e4",
            borderRadius: "10px",
            boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          },
          success: { iconTheme: { primary: "#10b981", secondary: "#fff" } },
        }}
      />

      <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden md:flex-row">
        <aside className="hidden min-h-0 w-[17.5rem] shrink-0 flex-col overflow-hidden border-r border-neutral-200 bg-[#f8faf9] md:flex">
          <div className="border-b border-neutral-200/80 bg-white px-4 py-5">
            <Link href="/admin" className="flex items-center gap-3" title="Dashboard">
              <Image src="/grovyn_logo.png" alt="" width={140} height={40} className="h-10 w-auto object-contain" />
              <span className="text-xs font-bold uppercase tracking-[0.14em] text-neutral-800">Grovyn</span>
            </Link>
          </div>
          <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <SidebarNav />
            </div>
            <div className="shrink-0 space-y-3 border-t border-neutral-200/80 bg-white/60 px-4 py-5">
              {adminEmail ? (
                <p className="truncate px-0.5 text-xs leading-relaxed text-neutral-500" title={adminEmail}>
                  <span className="font-medium text-neutral-600">Signed in as</span>
                  <br />
                  <span className="text-neutral-800">{adminEmail}</span>
                </p>
              ) : null}
              <button
                type="button"
                onClick={handleLogout}
                className="flex w-full min-w-0 items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-3 text-sm font-medium text-neutral-700 shadow-sm transition hover:border-[#10b981]/35 hover:text-[#10b981]"
              >
                <LogOut className="h-4 w-4" strokeWidth={2} />
                Sign out
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-h-0 min-w-0 flex-1 flex-col">
          <header className="z-30 flex shrink-0 items-center justify-between gap-3 border-b border-neutral-200 bg-white px-4 py-3 md:hidden">
            <div className="flex min-w-0 items-center gap-2">
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-neutral-600 hover:bg-neutral-100"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </button>
              <Link href="/admin" className="min-w-0 flex-1 pr-2">
                <Image src="/grovyn_logo.png" alt="Grovyn" width={120} height={36} className="h-8 w-auto object-contain" />
              </Link>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-neutral-200 text-neutral-500 hover:border-[#10b981]/30 hover:text-[#10b981]"
              aria-label="Sign out"
            >
              <LogOut className="h-4 w-4" strokeWidth={2} />
            </button>
          </header>

          <main className="min-h-0 w-full min-w-0 flex-1 overflow-y-auto overflow-x-hidden overscroll-contain py-8 px-4 sm:px-5 md:px-6 lg:px-8 md:py-10 [-webkit-overflow-scrolling:touch]">
            {children}
          </main>
        </div>
      </div>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-neutral-900/40 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-neutral-100 px-4 py-3">
              <div>
                <span className="text-sm font-semibold text-neutral-900">Grovyn admin</span>
                <p className="text-[11px] text-neutral-500">Content</p>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-100 text-neutral-600"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
              <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <SidebarNav onNavigate={() => setMobileOpen(false)} />
              </div>
              <div className="shrink-0 space-y-3 border-t border-neutral-100 bg-neutral-50/50 px-4 py-5">
                {adminEmail ? (
                  <p className="truncate text-xs leading-relaxed text-neutral-500" title={adminEmail}>
                    <span className="font-medium text-neutral-600">Signed in as</span>
                    <br />
                    <span className="text-neutral-800">{adminEmail}</span>
                  </p>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setMobileOpen(false);
                    handleLogout();
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white py-3 text-sm font-medium text-neutral-700 shadow-sm"
                >
                  <LogOut className="h-4 w-4" />
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
