/**
 * Public CMS reads (no auth). Same origin / API URL as contact form.
 */

function base(): string {
  return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "";
}

function allowed(url: string): boolean {
  const t = url.trim();
  if (!t || /[\s\r\n]/.test(t)) return false;
  return /^https?:\/\/[^\s]+$/i.test(t);
}

export type CmsCategory = {
  _id: string;
  key: string;
  name: string;
  iconKey: string;
  order: number;
};

export type CmsPortfolioProject = {
  id: string;
  name: string;
  category: string;
  categoryKey: string;
  industry: string;
  description: string;
  completedDate: string;
  techStack: string[];
  metrics: { label: string; value: string };
  image: string;
  dossierId: string;
  url?: string;
};

export type SelectedWorkDoc = {
  card1: {
    backgroundImage?: string;
    archiveTag?: string;
    title?: string;
    footerLeftLabel?: string;
    footerLeftValue?: string;
    footerLeftAccent?: boolean;
    footerRightLabel?: string;
    footerRightValue?: string;
  };
  card2: {
    tagIcon?: string;
    tagText?: string;
    title?: string;
    description?: string;
    bottomId?: string;
  };
  card3: {
    tagIcon?: string;
    tagText?: string;
    logoImage?: string;
    backgroundImage?: string;
    title?: string;
    bottomId?: string;
  };
  card4: {
    backgroundImage?: string;
    tagIcon?: string;
    tagText?: string;
    title?: string;
    description?: string;
    footerLabel?: string;
    footerValue?: string;
    techChips?: string[];
  };
};

export type IndustrySlideDoc = {
  _id: string;
  iconId: string;
  title: string;
  watermark: string;
  imageUrl: string;
  imageLabel: string;
  areas: string[];
  statProjects: string;
  statUptime: string;
  order: number;
};

export type TestimonialDoc = {
  id: string;
  name: string;
  role: string;
  text: string;
  rating: string;
  ratingValue: number;
  image: string;
};

export async function fetchCmsCategories(): Promise<CmsCategory[]> {
  const b = base();
  if (!b || !allowed(b)) return [];
  try {
    const res = await fetch(`${b}/cms/categories`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchCmsPortfolioProjects(): Promise<CmsPortfolioProject[]> {
  const b = base();
  if (!b || !allowed(b)) return [];
  try {
    const res = await fetch(`${b}/cms/portfolio-projects`, { next: { revalidate: 60 } });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

/** Client-side fetch (no Next cache) */
export async function fetchCmsPortfolioProjectsClient(): Promise<CmsPortfolioProject[]> {
  const b = base();
  if (!b || !allowed(b)) return [];
  try {
    const res = await fetch(`${b}/cms/portfolio-projects`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchCmsCategoriesClient(): Promise<CmsCategory[]> {
  const b = base();
  if (!b || !allowed(b)) return [];
  try {
    const res = await fetch(`${b}/cms/categories`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchCmsSelectedWorkClient(): Promise<SelectedWorkDoc | null> {
  const b = base();
  if (!b || !allowed(b)) return null;
  try {
    const res = await fetch(`${b}/cms/selected-work`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchCmsIndustrySlidesClient(): Promise<IndustrySlideDoc[]> {
  const b = base();
  if (!b || !allowed(b)) return [];
  try {
    const res = await fetch(`${b}/cms/industry-slides`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

export async function fetchCmsTestimonialsClient(): Promise<TestimonialDoc[]> {
  const b = base();
  if (!b || !allowed(b)) return [];
  try {
    const res = await fetch(`${b}/cms/testimonials`);
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}
