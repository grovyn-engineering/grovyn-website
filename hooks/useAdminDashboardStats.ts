"use client";

import { useCallback, useEffect, useState } from "react";
import { fetchWithAuth } from "@/lib/apiHelper";

export type AdminDashboardStats = {
  categories: number;
  portfolioProjects: number;
  industrySlides: number;
  testimonials: number;
  contacts: number;
  careerApplications: number;
};

export function useAdminDashboardStats() {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cRes, pRes, iRes, tRes, coRes, caRes] = await Promise.all([
        fetchWithAuth("/admin/categories"),
        fetchWithAuth("/admin/portfolio-projects"),
        fetchWithAuth("/admin/industry-slides"),
        fetchWithAuth("/admin/testimonials"),
        fetchWithAuth("/admin/contacts"),
        fetchWithAuth("/admin/career-applications"),
      ]);
      const [c, p, i, t, co, ca] = await Promise.all([
        cRes.json(),
        pRes.json(),
        iRes.json(),
        tRes.json(),
        coRes.json(),
        caRes.json(),
      ]);
      setStats({
        categories: Array.isArray(c) ? c.length : 0,
        portfolioProjects: Array.isArray(p) ? p.length : 0,
        industrySlides: Array.isArray(i) ? i.length : 0,
        testimonials: Array.isArray(t) ? t.length : 0,
        contacts: Array.isArray(co) ? co.length : 0,
        careerApplications: Array.isArray(ca) ? ca.length : 0,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load stats");
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { stats, loading, error, refresh };
}
