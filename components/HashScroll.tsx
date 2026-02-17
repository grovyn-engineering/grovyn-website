"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * 1) Scrolls to the element matching window.location.hash when the route changes
 *    (e.g. after client-side navigation to /en#contact).
 * 2) Listens for clicks on hash links; on same page, always scrolls to the
 *    target (fixes "click again doesn't scroll" without replacing every Link).
 */
export default function HashScroll() {
  const pathname = usePathname();

  // Scroll to hash when route (or initial load) has a hash
  useEffect(() => {
    const hash = typeof window !== "undefined" ? window.location.hash : "";
    if (!hash) return;
    const id = decodeURIComponent(hash.slice(1));
    if (!id) return;
    const el = document.getElementById(id);
    if (el) {
      const t = setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return () => clearTimeout(t);
    }
  }, [pathname]);

  // Same-page hash links: always scroll on click (even if URL already has that hash)
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a[href*='#']");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      const url = new URL(anchor.href, window.location.origin);
      const currentPath = pathname || "/";
      if (url.pathname !== currentPath || !url.hash) return;
      const id = decodeURIComponent(url.hash.slice(1));
      if (!id) return;
      const el = document.getElementById(id);
      if (el) {
        e.preventDefault();
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    };
    document.addEventListener("click", handleClick, true);
    return () => document.removeEventListener("click", handleClick, true);
  }, [pathname]);

  return null;
}
