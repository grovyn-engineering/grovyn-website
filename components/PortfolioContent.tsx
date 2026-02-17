"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Search,
  Smartphone,
  Globe,
  Boxes,
  Code,
  Terminal,
  Layers,
  Plus,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  LayoutGrid,
  Activity,
  ShieldCheck,
} from "lucide-react";
import ContactForm from "@/components/ContactForm";

// --- Carousel constants (single source for layout) ---
const CAROUSEL_EASE = [0.4, 0, 0.2, 1] as const;
const CAROUSEL_DURATION = 0.6;
const CARD_WIDTH_PX = 320;
const CARD_GAP_PX = 24;
const CARD_HEIGHT_MOBILE = 380;
const CARD_HEIGHT_TABLET = 420;
const CARD_HEIGHT_DESKTOP = 480;

interface Project {
  id: string;
  name: string;
  category: "Web" | "Mobile" | "Integration" | "Construction" | "Media & Marketing" | "Gaming" | "Healthcare" | "AR/VR" | "SaaS";
  industry: string;
  description: string;
  completedDate: string;
  techStack: string[];
  metrics: { label: string; value: string };
  image: string;
  dossierId: string;
  url?: string;
}

const projects: Project[] = [
  {
    id: "1",
    name: "BEPL Corporation",
    category: "Construction",
    industry: "Construction",
    description:
      "Comprehensive digital showcase for BEPL Corporation. Detailed corporate view featuring projects, capabilities, and industry leadership in construction infrastructure.",
    completedDate: "Feb 2025",
    techStack: ["Next.js", "Tailwind", "CMS"],
    metrics: { label: "Projects Showcased", value: "50+" },
    image: "/assets/Construction.png",
    dossierId: "GRVN-01",
    url: "https://babuerectorspvtltd.com/",
  },
  {
    id: "2",
    name: "Roborofl",
    category: "Media & Marketing",
    industry: "Media & Marketing",
    description:
      "Meme-based content generation platform with integrated lead generation. Engaging viral content engine designed for maximum reach and conversion.",
    completedDate: "Jan 2025",
    techStack: ["React", "AI/ML", "Analytics"],
    metrics: { label: "Lead Conversion", value: "35%+" },
    image: "/assets/roborofl-dark.png",
    dossierId: "GRVN-02",
    url: "https://roborofl.grovyn.in/",
  },
  {
    id: "3",
    name: "A3 House of Friends",
    category: "Gaming",
    industry: "Gaming",
    description:
      "Gaming platform with live slot booking, food ordering, and admin panels. Real-time reservations and payments.",
    completedDate: "Dec 2024",
    techStack: ["Next.js", "Node.js", "WebSockets"],
    metrics: { label: "Live Bookings", value: "500+/day" },
    image: "/assets/a3house-dark.png",
    dossierId: "GRVN-03",
    url: "https://www.a3houseoffriends.in/",
  },
  {
    id: "4",
    name: "The 24x7 Care",
    category: "Healthcare",
    industry: "Healthcare",
    description:
      "Full-stack B2C hospital services platform. Appointment booking, teleconsultation, prescriptions, and patient management with HIPAA-compliant architecture.",
    completedDate: "Nov 2024",
    techStack: ["Next.js", "PostgreSQL", "WebRTC"],
    metrics: { label: "Patients Served", value: "1K+" },
    image: "/assets/24x7care.png",
    dossierId: "GRVN-04",
    url: "https://the247care.com/",
  },
  {
    id: "5",
    name: "AR/VR Jewellery",
    category: "AR/VR",
    industry: "E-Commerce",
    description:
      "Immersive jewellery shopping with live AR try-on demo. Virtual try-before-you-buy experience powered by WebXR for seamless product visualization.",
    completedDate: "Oct 2024",
    techStack: ["WebXR", "Three.js", "React"],
    metrics: { label: "Try-on Sessions", value: "25K+" },
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200",
    dossierId: "GRVN-05",
    url: "#",
  },
  {
    id: "6",
    name: "Issue Tracker",
    category: "SaaS",
    industry: "Productivity",
    description:
      "JIRA and Linear-inspired issue tracking. Kanban boards, sprints, roadmaps, automation rules, and integrations for agile teams.",
    completedDate: "Sep 2024",
    techStack: ["React", "Node.js", "PostgreSQL"],
    metrics: { label: "Issues Tracked", value: "100K+" },
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    dossierId: "GRVN-06",
    url: "#",
  },
  {
    id: "7",
    name: "RAG Assistant Chatbot",
    category: "SaaS",
    industry: "AI / Knowledge",
    description:
      "Retrieval-augmented generation chatbot for enterprise knowledge bases. Context-aware answers from your docs with citations and source grounding.",
    completedDate: "Aug 2024",
    techStack: ["LLM", "Vector DB", "Next.js"],
    metrics: { label: "Queries Handled", value: "500K+" },
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&q=80&w=1200",
    dossierId: "GRVN-07",
    url: "#",
  },
];

const MAP_IMG = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=1200";

const PORTFOLIO_SECTION_HEADER_CLASS =
  "flex flex-col md:flex-row md:items-center justify-between mb-12 sm:mb-16 border-b border-gray-100 pb-8 sm:pb-10 lg:pb-12 gap-6 sm:gap-8";

function ProjectCard({
  project,
  variant = "center",
  fillHeight = false,
}: {
  project: Project;
  variant?: "center" | "side";
  fillHeight?: boolean;
}) {
  const [hovered, setHovered] = React.useState(false);
  const isCenter = variant === "center";
  const hasUrl = project.url && project.url !== "#";

  const handleVisitClick = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (hasUrl && project.url) {
        window.open(project.url, "_blank", "noopener,noreferrer");
      }
    },
    [hasUrl, project.url]
  );

  return (
    <div
      className={`group rounded-2xl sm:rounded-3xl overflow-hidden shadow-xl border-2 border-gray-100 bg-white transition-all duration-500 ${
        fillHeight ? "h-full w-full" : isCenter ? "aspect-[16/10] shadow-2xl" : "aspect-[4/3] shadow-lg"
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="relative w-full h-full">
        <Image
          src={project.image}
          alt={project.name}
          width={800}
          height={500}
          className={`w-full h-full object-cover ${fillHeight ? "min-h-full" : ""}`}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
        <div
          className={`absolute bottom-0 left-0 right-0 p-4 sm:p-5 md:p-6 space-y-2 sm:space-y-3 pointer-events-none ${
            isCenter ? "sm:p-6 md:p-8" : "p-3 sm:p-4"
          }`}
        >
          <div className="flex items-center justify-between">
            <div className="px-2.5 sm:px-3 py-1 bg-[#10b981] text-white text-[7px] sm:text-[8px] font-black uppercase tracking-widest rounded-full">
              {project.category}
            </div>
            <span className="text-white/60 text-[7px] sm:text-[8px] font-bold uppercase tracking-widest">
              {project.completedDate}
            </span>
          </div>
          <h3
            className={`font-black text-white tracking-tight leading-tight ${
              isCenter ? "text-xl sm:text-2xl md:text-3xl lg:text-4xl" : "text-sm sm:text-base md:text-lg"
            }`}
          >
            {project.name}
          </h3>
          {hasUrl && (
            <div className="flex items-center justify-between pt-2 sm:pt-3 border-t border-white/15">
              <div className="flex flex-col">
                <span className="text-[7px] sm:text-[8px] font-black text-[#10b981] uppercase tracking-[0.2em]">
                  {project.metrics.label}
                </span>
                <span
                  className={`font-black text-white ${isCenter ? "text-base sm:text-lg md:text-xl" : "text-xs sm:text-sm"}`}
                >
                  {project.metrics.value}
                </span>
              </div>
              <span className="flex items-center gap-1 text-white font-black text-[7px] sm:text-[8px] uppercase tracking-widest">
                View Dossier <Plus size={10} className="sm:w-3 sm:h-3" />
              </span>
            </div>
          )}
        </div>
        {project.url && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-black/40 transition-opacity duration-300"
            style={{
              zIndex: 100,
              opacity: hovered ? 1 : 0,
              pointerEvents: hovered ? "auto" : "none",
            }}
          >
            {hasUrl ? (
              <button
                type="button"
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-[#10b981] text-white font-bold text-sm sm:text-base shadow-lg shadow-[#10b981]/30 hover:bg-[#0d9488] hover:shadow-xl hover:shadow-[#10b981]/40 transition-all duration-200 hover:scale-105 cursor-pointer"
                onClick={handleVisitClick}
              >
                <ArrowUpRight size={18} className="shrink-0" />
                Visit site
              </button>
            ) : (
              <span className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white/20 text-white font-bold text-sm sm:text-base border border-white/30 cursor-default select-none">
                Launching soon
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

/** Signed distance for infinite carousel: -2,-1,0,1,2 so center is 0 */
function getDistance(slideIndex: number, activeIndex: number, total: number): number {
  if (total <= 1) return 0;
  let d = (slideIndex - activeIndex) % total;
  if (d > total / 2) d -= total;
  if (d < -total / 2) d += total;
  return d;
}

/** Scale, opacity, blur from distance (design contract) */
function getCardStyle(distance: number, isMobile: boolean) {
  if (isMobile) {
    return { scale: 1, opacity: 1, filter: "blur(0px)" as const, zIndex: 10, pointerEvents: "auto" as const };
  }
  const abs = Math.abs(distance);
  if (abs === 0) {
    return { scale: 1, opacity: 1, filter: "blur(0px)" as const, zIndex: 10, pointerEvents: "auto" as const };
  }
  if (abs === 1) {
    return { scale: 0.9, opacity: 0.85, filter: "blur(2px)" as const, zIndex: 9, pointerEvents: "none" as const };
  }
  return { scale: 0.8, opacity: 0.5, filter: "blur(8px)" as const, zIndex: 8, pointerEvents: "none" as const };
}

function PortfolioCarousel({
  projects,
  activeIndex,
  onGoTo,
  prevSlideAria = "Previous slide",
  nextSlideAria = "Next slide",
}: {
  projects: Project[];
  activeIndex: number;
  onGoTo: (index: number) => void;
  prevSlideAria?: string;
  nextSlideAria?: string;
}) {
  const N = projects.length;
  const [mounted, setMounted] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const mqMobile = window.matchMedia("(max-width: 639px)");
    const mqTablet = window.matchMedia("(min-width: 640px) and (max-width: 1023px)");
    const update = () => {
      setIsMobile(mqMobile.matches);
      setIsTablet(mqTablet.matches);
    };
    update();
    mqMobile.addEventListener("change", update);
    mqTablet.addEventListener("change", update);
    return () => {
      mqMobile.removeEventListener("change", update);
      mqTablet.removeEventListener("change", update);
    };
  }, [mounted]);

  const halfWindow = !mounted ? 2 : isMobile ? 0 : isTablet ? 1 : 2;
  const indices = useMemo(() => {
    const list: number[] = [];
    for (let i = -halfWindow; i <= halfWindow; i++) {
      list.push((activeIndex + i + N) % N);
    }
    return list;
  }, [activeIndex, N, halfWindow]);

  const trackWidth =
    (indices.length * CARD_WIDTH_PX + (indices.length - 1) * CARD_GAP_PX);

  const handlePrev = useCallback(() => {
    onGoTo((activeIndex - 1 + N) % N);
  }, [activeIndex, N, onGoTo]);
  const handleNext = useCallback(() => {
    onGoTo((activeIndex + 1) % N);
  }, [activeIndex, N, onGoTo]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") handlePrev();
      if (e.key === "ArrowRight") handleNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handlePrev, handleNext]);

  if (N === 0) return null;
  if (N === 1) {
    return (
      <div className="flex justify-center overflow-hidden" style={{ minHeight: CARD_HEIGHT_MOBILE }}>
        <div className="w-full max-w-[320px]">
          <ProjectCard project={projects[0]} variant="center" />
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden py-8"
      role="region"
      aria-roledescription="carousel"
      aria-label="Project portfolio carousel"
      aria-live="polite"
    >
      <div
        className="flex justify-center items-center mx-auto overflow-hidden"
        style={{
          minHeight: isMobile ? CARD_HEIGHT_MOBILE : isTablet ? CARD_HEIGHT_TABLET : CARD_HEIGHT_DESKTOP,
          maxWidth: "100%",
        }}
      >
        <div
          className="flex items-center justify-center gap-6 flex-nowrap"
          style={{
            width: isMobile ? "100%" : trackWidth,
            maxWidth: isMobile ? 360 : undefined,
          }}
        >
          {indices.map((slideIndex, slotIndex) => {
            const distance = halfWindow === 0 ? 0 : slotIndex - halfWindow;
            const project = projects[slideIndex];
            const style = getCardStyle(distance, isMobile);
            const isActive = distance === 0;
            return (
              <motion.div
                key={`${slideIndex}-${project.id}`}
                layout
                initial={false}
                animate={{
                  scale: style.scale,
                  opacity: style.opacity,
                  filter: style.filter,
                }}
                transition={{
                  duration: CAROUSEL_DURATION,
                  ease: CAROUSEL_EASE,
                }}
                className="flex-shrink-0 rounded-2xl overflow-hidden origin-center cursor-pointer"
                style={{
                  width: isMobile ? "100%" : CARD_WIDTH_PX,
                  zIndex: style.zIndex,
                  pointerEvents: style.pointerEvents,
                  willChange: "transform",
                  transformStyle: "preserve-3d",
                  backfaceVisibility: "hidden",
                  boxShadow: isActive ? "0 25px 80px -20px rgba(0,0,0,0.35)" : "0 10px 40px -10px rgba(0,0,0,0.2)",
                }}
                onClick={!isActive ? () => onGoTo(slideIndex) : undefined}
              >
                <div
                  className="w-full rounded-2xl overflow-hidden"
                  style={{
                    height: isMobile ? CARD_HEIGHT_MOBILE : isTablet ? CARD_HEIGHT_TABLET : CARD_HEIGHT_DESKTOP,
                  }}
                >
                  <ProjectCard project={project} variant={isActive ? "center" : "side"} fillHeight />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center justify-center gap-6 mt-8">
        <button
          type="button"
          onClick={handlePrev}
          className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#10b981] hover:text-[#10b981] hover:bg-[#10b981]/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50"
          aria-label={prevSlideAria}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2" role="tablist" aria-label="Slide pagination">
          {projects.map((_, idx) => (
            <button
              key={idx}
              type="button"
              role="tab"
              aria-selected={idx === activeIndex}
              aria-label={`Go to slide ${idx + 1}`}
              onClick={() => onGoTo(idx)}
              className={`rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50 ${
                idx === activeIndex ? "bg-[#10b981] w-6 h-2" : "bg-gray-300 hover:bg-gray-400 w-2 h-2"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={handleNext}
          className="w-12 h-12 rounded-full border-2 border-gray-200 flex items-center justify-center text-gray-600 hover:border-[#10b981] hover:text-[#10b981] hover:bg-[#10b981]/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#10b981]/50"
          aria-label={nextSlideAria}
        >
          <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}

export default function PortfolioContent() {
  const t = useTranslations("portfolio");
  const [activeCategoryKey, setActiveCategoryKey] = useState("All");
  const [activeIndex, setActiveIndex] = useState(0);

  const goTo = useCallback((nextIndex: number) => {
    setActiveIndex((prev) => (nextIndex === prev ? prev : nextIndex));
  }, []);

  const categories = useMemo(
    () => [
      { name: t("category_all"), key: "All", icon: <Layers size={28} /> },
      { name: t("category_construction"), key: "Construction", icon: <Layers size={28} /> },
      { name: t("category_media_marketing"), key: "Media & Marketing", icon: <Activity size={28} /> },
      { name: t("category_gaming"), key: "Gaming", icon: <Smartphone size={28} /> },
      { name: t("category_healthcare"), key: "Healthcare", icon: <ShieldCheck size={28} /> },
      { name: t("category_arvr"), key: "AR/VR", icon: <Boxes size={28} /> },
      { name: t("category_saas"), key: "SaaS", icon: <Globe size={28} /> },
    ],
    [t]
  );

  const filteredProjects = useMemo(() => {
    if (activeCategoryKey === "All") return projects;
    return projects.filter((p) => p.category === activeCategoryKey);
  }, [activeCategoryKey]);

  useEffect(() => {
    setActiveIndex(0);
  }, [activeCategoryKey]);

  return (
    <div className="min-h-screen font-sans selection:bg-[#10b981] selection:text-white bg-white text-black">
      <section className="relative h-[70vh] sm:h-[80vh] lg:h-[85vh] flex flex-col items-center justify-center text-center px-4 sm:px-6 overflow-visible">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-90"
          >
            <source src="/assets/Portfolio.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/20 to-transparent" />
          <div
            className={`absolute bottom-[-1px] left-[-10%] w-[120%] h-[80px] sm:h-[100px] lg:h-[120px] transition-colors duration-500 ${
              "bg-white"
            }`}
            style={{ borderRadius: "100% 100% 0 0", transform: "translateY(50%)" }}
          />
        </div>

        <div className="relative z-10 space-y-6 sm:space-y-8 max-w-4xl animate-in fade-in slide-in-from-bottom-10 duration-1000 px-4">
          <h1 className="text-3xl sm:text-4xl md:text-[4.5rem] lg:text-[5.5rem] font-black text-white tracking-tighter leading-none drop-shadow-2xl italic">
            {t("hero_title")}
          </h1>
          <p className="text-white/90 text-base sm:text-lg md:text-2xl font-medium tracking-tight max-w-2xl mx-auto italic drop-shadow-md px-4">
            {t("hero_subtitle")}
          </p>

          {/* <div className="flex justify-center space-x-4 sm:space-x-6 pt-4">
            {[Search, Code, Terminal].map((Icon, idx) => (
              <div
                key={idx}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-2xl hover:bg-[#10b981] hover:text-black transition-all cursor-pointer group"
              >
                <Icon size={18} className="sm:w-[22px] sm:h-[22px] group-hover:scale-110 transition-transform" />
              </div>
            ))}
          </div> */}
        </div>

        <div className="absolute bottom-[-60px] sm:bottom-[-70px] lg:bottom-[-80px] left-1/2 -translate-x-1/2 w-full max-w-6xl px-4 sm:px-6 z-20">
          <div className="flex items-center justify-center space-x-2 sm:space-x-4 md:space-x-10 pb-4 scrollbar-hide">
            {categories.map((cat) => (
              <div key={cat.key} className="flex flex-col items-center space-y-2 sm:space-y-4 group shrink-0">
                <button
                  type="button"
                  onClick={() => setActiveCategoryKey(cat.key)}
                  className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center transition-all duration-500 shadow-2xl border-2 sm:border-4 ${
                    activeCategoryKey === cat.key
                      ? "bg-[#10b981] text-white border-white scale-110 shadow-[#10b981]/40"
                      : "bg-white border-gray-50 text-gray-400 hover:border-[#10b981]/40"
                  }`}
                >
                  <div className="scale-75 sm:scale-100">{cat.icon}</div>
                </button>
                <span
                  className={`text-[9px] sm:text-[10px] md:text-[11px] font-black uppercase tracking-widest transition-colors text-center ${
                    activeCategoryKey === cat.key ? "text-[#10b981]" : "text-gray-400 group-hover:text-black dark:group-hover:text-white"
                  }`}
                >
                  {cat.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="pt-32 sm:pt-48 lg:pt-64 pb-16 sm:pb-24 lg:pb-32 px-4 sm:px-6 lg:px-12 max-w-7xl mx-auto">
        <div className={PORTFOLIO_SECTION_HEADER_CLASS} suppressHydrationWarning>
          <div className="space-y-2 sm:space-y-3">
            <h2
              className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter italic ${
                "text-[#111]"
              }`}
            >
              {t("section_header_title")} <span className="text-[#10b981] text-xl sm:text-2xl md:text-3xl lg:text-4xl">{t("section_header_highlight")}</span>
            </h2>
            <p className="text-gray-400 font-bold uppercase tracking-[0.4em] text-[9px] sm:text-[10px]">
              {t("section_header_sub")}
            </p>
          </div>
        </div>

        {/* Refactored carousel: single source of truth (activeIndex), distance-based styling, no overflow */}
        <PortfolioCarousel
          projects={filteredProjects}
          activeIndex={activeIndex}
          onGoTo={goTo}
          prevSlideAria={t("prev_slide_aria")}
          nextSlideAria={t("next_slide_aria")}
        />
      </section>

      {/* Selected Work - premium archive of elite systems (light) */}
      <section
        className="relative py-20 sm:py-28 lg:py-36 rounded-t-[2rem] sm:rounded-t-[2.5rem] lg:rounded-t-[3rem] overflow-hidden bg-[#fafafa] selected-work-grain"
        style={{ transition: "background-color 1000ms ease" }}
        suppressHydrationWarning
      >
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <header className="flex flex-col items-center text-center mb-14 sm:mb-20 lg:mb-24 space-y-4">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#10b981]/10 border border-[#10b981]/20">
              <LayoutGrid size={14} className="text-[#10b981]" />
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[#10b981]">
                {t("archive_badge")}
              </span>
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter leading-none text-[#111]">
              {t("selected_work_title")} <span className="text-[#10b981] italic">{t("selected_work_highlight")}</span>
            </h2>
            <p className="text-gray-500 text-sm sm:text-base md:text-lg font-medium max-w-xl mx-auto leading-relaxed">
              Flagship systems. Capability and outcomes.
            </p>
          </header>

          {/* Asymmetric editorial grid: 2 large cinematic + 2 compact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-5 lg:gap-6 items-stretch">
            {/* Large cinematic - BEPL (top-left) */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              className="lg:col-span-8 relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] group/card"
              suppressHydrationWarning
            >
              <div className="absolute inset-0" suppressHydrationWarning>
                <Image
                  src={projects[0].image}
                  alt={projects[0].name}
                  fill
                  className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/card:translate-y-[-2%]"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  priority
                  loading="eager"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/20" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 lg:p-8">
                <div>
                  <p className="font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.35em] uppercase text-white/60">
                    SYSTEM_ARCHIVE_{projects[0].dossierId}
                  </p>
                  <h3 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight italic leading-tight">
                    {projects[0].name}
                  </h3>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="flex flex-wrap gap-6">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Reliability</p>
                      <p className="text-lg sm:text-xl font-black text-[#10b981]">99.99%</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Deployment</p>
                      <p className="text-lg sm:text-xl font-black text-white">Global Edge</p>
                    </div>
                  </div>
                  {/* <button
                    type="button"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#10b981] text-black flex items-center justify-center transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_0_32px_rgba(16,185,129,0.4)] hover:translate-y-[-2px]"
                    aria-label="View dossier"
                  >
                    <ArrowUpRight size={22} className="sm:w-6 sm:h-6" />
                  </button> */}
                </div>
              </div>
            </motion.article>

            {/* Compact - A3 House (top-right) */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.05, ease: [0.4, 0, 0.2, 1] }}
              className="lg:col-span-4 relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden bg-white min-h-[280px] flex flex-col justify-between p-5 sm:p-6 border border-gray-100 shadow-sm group/card transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.08)] hover:translate-y-[-4px]"
              suppressHydrationWarning
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981]">
                  <Smartphone size={20} />
                </div>
                <p className="font-mono text-[10px] font-medium tracking-[0.3em] uppercase text-gray-500">
                  GAMING TIER 1
                </p>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-[#111] tracking-tight leading-tight">
                  {projects[2].name}
                </h3>
                <p className="mt-3 text-sm text-gray-500 leading-relaxed line-clamp-2" suppressHydrationWarning>
                  {projects[2].description}
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="font-mono text-[10px] uppercase tracking-widest text-gray-400">{projects[2].dossierId}</span>
                {/* <button type="button" className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-[#10b981] hover:bg-[#10b981]/10 transition-colors duration-300" aria-label="Open">
                  <Plus size={18} />
                </button> */}
              </div>
            </motion.article>

            {/* Compact - Roborofl (bottom-left) */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.4, 0, 0.2, 1] }}
              className="lg:col-span-4 relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden min-h-[280px] group/card transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_24px_48px_-16px_rgba(0,0,0,0.08)] hover:translate-y-[-4px]"
            >
              <div className="absolute inset-0">
                <Image
                  src={projects[1].image}
                  alt={projects[1].name}
                  fill
                  className="object-cover opacity-20 group-hover/card:opacity-100 transition-opacity duration-[600ms]"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                
              </div>
              <div className="relative flex flex-col justify-between h-full p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-[#10b981]" />
                  <p className="font-mono text-[10px] font-medium tracking-[0.3em] uppercase text-[#10b981]">
                    VIRAL CONTENT ENGINE
                  </p>
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-[#111] tracking-tight leading-tight">
                    {projects[1].name}
                  </h3>
                  <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-gray-400">Archived_01_2025</p>
                </div>
                <div className="pt-4">
                  {/* <button type="button" className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-[#10b981] hover:bg-[#10b981]/10 transition-colors duration-300" aria-label="Open">
                    <Plus size={18} />
                  </button> */}
                </div>
              </div>
            </motion.article>

            {/* Large cinematic - The 24x7 Care (bottom-right) */}
            <motion.article
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
              className="lg:col-span-8 relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden min-h-[320px] sm:min-h-[380px] lg:min-h-[420px] group/card"
            >
              <div className="absolute inset-0">
                <Image
                  src={projects[3].image}
                  alt={projects[3].name}
                  fill
                  className="object-cover transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover/card:translate-y-[-2%]"
                  sizes="(max-width: 1024px) 100vw, 66vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />
              </div>
              <div className="absolute inset-0 flex flex-col justify-between p-5 sm:p-6 lg:p-8">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-[#10b981] shrink-0" />
                  <p className="font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.35em] uppercase text-white/60">
                    HEALTHCARE_B2C_DOSSIER
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight leading-tight">
                    {projects[3].name}
                  </h3>
                  <p className="mt-2 text-sm text-white/60 leading-relaxed line-clamp-2 max-w-xl">
                    {projects[3].description}
                  </p>
                </div>
                <div className="flex flex-wrap items-end justify-between gap-4">
                  <div className="flex flex-wrap gap-4">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white/70">Patients Served</p>
                      <p className="text-lg sm:text-xl font-black text-[#10b981]">10K+</p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {projects[3].techStack.slice(0, 3).map((t) => (
                        <span key={t} className="font-mono text-[9px] uppercase tracking-wider text-white/50">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                  {/* <button
                    type="button"
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl bg-[#10b981] text-black flex items-center justify-center transition-all duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)] hover:shadow-[0_0_32px_rgba(16,185,129,0.35)] hover:translate-y-[-2px]"
                    aria-label="View dossier"
                  >
                    <ArrowUpRight size={22} className="sm:w-6 sm:h-6" />
                  </button> */}
                </div>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      {/* <section className="py-24 sm:py-40 lg:py-56 px-4 sm:px-6 lg:px-12 relative overflow-hidden bg-white dark:bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-24 xl:gap-32">
          <div className="lg:w-1/2 space-y-8 sm:space-y-10 lg:space-y-12">
            <div className="space-y-6 sm:space-y-8">
              <div className="inline-flex items-center space-x-2 sm:space-x-3 text-[#10b981] font-black uppercase tracking-[0.4em] text-[9px] sm:text-[10px]">
                <Globe size={14} className="sm:w-4 sm:h-4" />
                <span>Digital Sovereign Territory</span>
              </div>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-[6rem] xl:text-[7rem] font-black tracking-tighter leading-[0.85] italic text-[#111] dark:text-white">
                Le <span className="text-[#10b981]">Territoire</span> <br /> Digital.
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-base sm:text-lg lg:text-xl font-medium leading-relaxed max-w-xl">
                Grovyn ecosystems power SaaS enterprises across global borders. Our architecture ensures absolute
                data sovereignty.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:gap-10 pt-4">
              {[
                { val: "15ms", label: "SDK RESPONSE AVG" },
                { val: "420+", label: "ACTIVE EDGE NODES" },
              ].map((stat, i) => (
                <div key={i} className="space-y-2 sm:space-y-3">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-[#10b981] shadow-[0_0_10px_#10b981] flex-shrink-0" />
                    <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#111] dark:text-white">
                      {stat.val}
                    </span>
                  </div>
                  <p className="text-gray-400 text-[9px] sm:text-[10px] font-black uppercase tracking-widest leading-relaxed pl-6 sm:pl-7">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>

            <button
              type="button"
              className="px-8 sm:px-10 lg:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-2xl transition-all flex items-center justify-center space-x-3 sm:space-x-4 group bg-black text-white hover:bg-[#10b981] dark:bg-white dark:text-black dark:hover:bg-[#10b981] w-full sm:w-auto"
            >
              <span>Carte interactive</span>
              <ArrowRight size={16} className="sm:w-[18px] sm:h-[18px] text-white dark:text-black group-hover:translate-x-2 transition-transform" />
            </button>
          </div>

          <div className="lg:w-1/2 relative group w-full">
            <div className="relative rounded-[2rem] sm:rounded-[3rem] md:rounded-[4rem] overflow-hidden shadow-2xl border-[4px] sm:border-[6px] md:border-8 border-white dark:border-[#151515] bg-white dark:bg-[#151515] transform transition-transform duration-1000">
              <Image
                src={MAP_IMG}
                alt="Global Deployment Network"
                width={1200}
                height={960}
                className="w-full aspect-[4/5] object-cover opacity-90 group-hover:scale-105 transition-transform duration-[4s]"
              />
              <div className="absolute inset-0 bg-black/30 mix-blend-multiply pointer-events-none" />
              <div className="absolute top-[35%] left-[42%] w-10 h-10 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center animate-pulse shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
              </div>
              <div className="absolute bottom-[20%] right-[30%] w-10 h-10 rounded-full bg-[#10b981]/20 border-2 border-[#10b981] flex items-center justify-center animate-pulse shadow-[0_0_25px_rgba(16,185,129,0.5)]" style={{ animationDelay: "700ms" }}>
                <div className="w-3 h-3 rounded-full bg-[#10b981]" />
              </div>
            </div>
          </div>
        </div>
      </section> */}

      <ContactForm />
    </div>
  );
}