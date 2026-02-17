"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import {
  ChevronDown,
  CheckCircle2,
  Globe,
  Sparkles,
  Terminal,
  Cpu,
  ArrowRight,
  MapPin,
  Upload,
  Send,
  ExternalLink,
  Briefcase,
} from "lucide-react";
import { fetchJobOpenings, type JobOpening } from "@/lib/api";

export default function CareersContent() {
  const locale = useLocale();
  const t = useTranslations("careers");
  const [openings, setOpenings] = useState<JobOpening[]>([]);
  const [openingsLoading, setOpeningsLoading] = useState(true);
  const [openJobSlug, setOpenJobSlug] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchJobOpenings(locale).then((data) => {
      if (!cancelled) {
        setOpenings(data);
        setOpeningsLoading(false);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [locale]);
  const [isVisible, setIsVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    position: "",
    message: "",
    resume: null as File | null,
  });

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (isSubmitted) {
    return (
      <div className="min-h-[55vh] sm:min-h-[60vh] lg:min-h-[65vh] flex flex-col items-center justify-center text-center space-y-8 sm:space-y-10 lg:space-y-12 pt-24 sm:pt-32 lg:pt-40 pb-16 sm:pb-24 lg:pb-32 bg-white px-4 sm:px-6">
        <div className="relative">
          <div className="absolute inset-0 bg-[#10b981]/20 blur-3xl rounded-full scale-150 animate-pulse" />
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-black flex items-center justify-center text-[#10b981] shadow-2xl">
            <CheckCircle2 size={32} className="sm:w-12 sm:h-12 lg:w-12 lg:h-12" />
          </div>
        </div>
        <div className="space-y-3 sm:space-y-4 max-w-xl">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111] tracking-tighter">
            {t("success_title")}
          </h2>
          <p className="text-gray-500 text-base sm:text-lg font-medium leading-relaxed">
            {t("success_message")}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsSubmitted(false)}
          className="bg-black text-white px-8 sm:px-10 py-3 sm:py-4 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] hover:bg-[#10b981] hover:text-black transition-all w-full sm:w-auto"
        >
          {t("return_btn")}
        </button>
      </div>
    );
  }

  const oneTeamItems = [
    t("one_team_item_1"),
    t("one_team_item_2"),
    t("one_team_item_3"),
    t("one_team_item_4"),
  ];

  const perks = [
    { label: t("perk_remote"), icon: <Globe /> },
    { label: t("perk_stock"), icon: <Sparkles /> },
    { label: t("perk_learning"), icon: <Terminal /> },
    { label: t("perk_gear"), icon: <Cpu /> },
  ];

  return (
    <div className="bg-white overflow-x-hidden selection:bg-[#10b981] selection:text-white">
      <section className="relative min-h-[60vh] sm:min-h-[65vh] lg:min-h-[70vh] flex items-center bg-black overflow-hidden px-4 sm:px-6 lg:px-12 pt-16 sm:pt-20 pb-16 sm:pb-20">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=2000"
              alt="Engineering Future"
              fill
              className="object-cover opacity-20"
              priority
              sizes="100vw"
            />
          </div>
          <div className="absolute bottom-0 left-0 w-full h-64 overflow-hidden pointer-events-none opacity-40">
            <svg viewBox="0 0 1440 320" className="absolute bottom-0 w-[120%] h-full text-[#10b981] fill-none stroke-current stroke-[1.5]">
              <path d="M0,160 C320,300 420,100 640,200 C860,300 960,100 1280,200 L1440,320" />
              <path d="M0,200 C320,100 420,300 640,160 C860,100 960,300 1280,160 L1440,200" className="opacity-50" />
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent" />
        </div>

        <div
          className={`relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 sm:gap-16 lg:gap-20 items-center transition-all duration-1000 ${
            isVisible ? "translate-y-0 opacity-100" : "translate-y-12 opacity-0"
          }`}
        >
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-3 sm:space-y-4">
              <span className="text-white/60 font-black text-[10px] sm:text-xs uppercase tracking-[0.4em]">
                {t("hero_badge")}
              </span>
              <h1 className="text-3xl sm:text-4xl md:text-[4.5rem] font-black text-white tracking-tighter leading-[0.85]">
                {t("hero_title_line1")} <br />
                {t("hero_title_line2")} <br />
                <span className="text-[#10b981]">{t("hero_title_highlight")}</span>
              </h1>
            </div>
            <p className="text-gray-400 text-base sm:text-lg md:text-xl font-medium max-w-xl leading-relaxed">
              {t("hero_subtitle")}
            </p>
          </div>

          <div className="relative group w-full lg:w-auto">
            <div className="absolute -inset-2 sm:-inset-4 bg-[#10b981]/10 rounded-[2rem] sm:rounded-[3rem] blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border-2 sm:border-4 border-white/10 aspect-video">
              <Image
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=1200"
                alt="Our Workspace"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 lg:py-40 bg-white px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 sm:gap-16 lg:gap-24">
          <div className="lg:w-1/2 relative w-full">
            <div className="grid grid-cols-2 gap-3 sm:gap-4 md:gap-8">
              <div className="rounded-[2rem] overflow-hidden aspect-[4/3] shadow-xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=600"
                  alt="Team 1"
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-[2.5rem] overflow-hidden aspect-[3/4] shadow-2xl border-4 border-white translate-y-12">
                <Image
                  src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=600"
                  alt="Team 2"
                  width={600}
                  height={800}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-[2.5rem] overflow-hidden aspect-square shadow-2xl border-4 border-white -translate-y-12">
                <Image
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=600"
                  alt="Team 3"
                  width={600}
                  height={600}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="rounded-[2rem] overflow-hidden aspect-[4/3] shadow-xl border-4 border-white">
                <Image
                  src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=600"
                  alt="Team 4"
                  width={600}
                  height={450}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          <div className="lg:w-1/2 space-y-6 sm:space-y-8 lg:space-y-10">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111] tracking-tighter leading-none">
              {t("one_team_title")} <br />
              <span className="text-[#10b981]">{t("one_team_title_highlight")}</span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg leading-relaxed font-medium">
              {t("one_team_subtitle")}
            </p>
            <div className="space-y-3 sm:space-y-4">
              {oneTeamItems.map((item) => (
                <div key={item} className="flex items-center space-x-3 sm:space-x-4">
                  <div className="text-[#10b981]">
                    <CheckCircle2 size={18} className="sm:w-5 sm:h-5" />
                  </div>
                  <span className="font-bold text-sm sm:text-base text-gray-700">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-12 lg:py-24 bg-gray-50/50 border-t border-gray-100 px-4 sm:px-6 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12 sm:mb-16 lg:mb-20 space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111] tracking-tighter">
              {t("open_roles_title")}
            </h2>
            <p className="text-gray-400 font-black text-[10px] sm:text-xs uppercase tracking-widest">
              {t("open_roles_count", { count: openings.length })}
            </p>
          </div>

          {/* Filter tabs commented out for now-not wired up yet
          <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6 mb-8 sm:mb-10 lg:mb-12">
            <div className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">
              {t("filter_by")}
            </div>
            <div className="flex flex-wrap gap-3 sm:gap-4">
              {[t("filter_all_locations"), t("filter_all_types"), t("filter_all_teams")].map(
                (filter) => (
                  <div key={filter} className="relative group">
                    <button
                      type="button"
                      className="bg-white border border-gray-100 rounded-xl px-4 sm:px-6 py-2.5 sm:py-3.5 text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center space-x-4 sm:space-x-6 min-w-[140px] sm:min-w-[180px] justify-between shadow-sm w-full sm:w-auto"
                    >
                      <span>{filter}</span>
                      <ChevronDown size={12} className="sm:w-[14px] sm:h-[14px] text-gray-400" />
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
          */}

          <div className="space-y-2">
            {openingsLoading ? (
                <p className="text-sm text-gray-500 py-8">{t("open_roles_title")}...</p>
              ) : openings.length === 0 ? (
                <div className="bg-white border border-gray-100 rounded-[2rem] px-6 sm:px-10 lg:px-14 py-16 sm:py-20 lg:py-24 text-center shadow-sm">
                  <div className="max-w-lg mx-auto space-y-6 sm:space-y-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#10b981]/10 text-[#10b981]">
                      <Briefcase className="w-8 h-8 sm:w-10 sm:h-10" strokeWidth={1.5} />
                    </div>
                    <div className="space-y-3">
                      <h3 className="text-2xl sm:text-3xl font-black text-[#111] tracking-tight">
                        {t("no_open_roles_title")}
                      </h3>
                      <p className="text-gray-500 text-sm sm:text-base font-medium leading-relaxed max-w-md mx-auto">
                        {t("no_open_roles_message")}
                      </p>
                    </div>
                    <p className="text-gray-400 text-xs sm:text-sm font-semibold pt-2 border-t border-gray-100 pt-6">
                      {t("no_fit")}
                    </p>
                  </div>
                </div>
              ) : (
                openings.map((job) => {
              const slug = job.slug ?? job.title.toLowerCase().replace(/\s+/g, "-");
              const isOpen = openJobSlug === slug;
              const requirements = job.requirements ?? [];

              return (
                <div
                  key={slug}
                  className={`bg-white border rounded-[2rem] overflow-hidden transition-all duration-500 ${
                    isOpen ? "border-[#10b981] shadow-2xl" : "border-gray-100 hover:border-gray-200"
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenJobSlug(isOpen ? null : slug)}
                    className="w-full px-6 sm:px-8 lg:px-10 py-6 sm:py-8 lg:py-10 flex flex-col md:flex-row items-start md:items-center justify-between text-left group"
                  >
                    <div className="space-y-2 mb-4 sm:mb-6 md:mb-0 w-full md:w-auto">
                      <h3 className="text-xl sm:text-2xl font-black text-[#111] tracking-tight group-hover:text-[#10b981] transition-colors">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400">
                        <span>{job.team}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-200" />
                        <span>{job.type}</span>
                      </div>
                    </div>
                    <div className="flex items-center justify-between md:justify-end w-full md:w-auto gap-4 md:space-x-12">
                      {job.location && (
                        <div className="text-xs sm:text-sm font-bold text-gray-400 flex items-center space-x-2">
                          <MapPin size={14} className="sm:w-4 sm:h-4 text-[#10b981]" />
                          <span>{job.location}</span>
                        </div>
                      )}
                      <div
                        className={`transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
                      >
                        <ChevronDown size={20} className="sm:w-6 sm:h-6 text-gray-300" />
                      </div>
                    </div>
                  </button>

                  <div
                    className={`grid transition-[grid-template-rows,opacity] duration-500 ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="px-6 sm:px-8 lg:px-10 pb-8 sm:pb-10 lg:pb-12 pt-4 border-t border-gray-50 bg-[#fafafa]/50">
                        <div className="grid lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-12">
                          <div className="space-y-4 sm:space-y-6">
                            <h4 className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-[#10b981]">
                              {t("requirements_label")}
                            </h4>
                            <ul className="space-y-3 sm:space-y-4">
                              {requirements.map((req, idx) => (
                                <li key={idx} className="flex items-start space-x-3 sm:space-x-4 group">
                                  <div className="w-1.5 h-1.5 rounded-full bg-[#10b981] mt-2 group-hover:scale-150 transition-transform shrink-0" />
                                  <span className="text-sm sm:text-base text-gray-600 font-medium leading-relaxed">
                                    {req}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="flex flex-col justify-end items-stretch lg:items-end">
                            <Link
                              href={`/${locale}/careers/${slug}`}
                              className="bg-black text-white px-10 sm:px-12 py-4 sm:py-5 rounded-xl sm:rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-[#10b981] hover:text-black transition-all shadow-xl flex items-center justify-center space-x-3 sm:space-x-4 group w-full lg:w-auto"
                            >
                              <span>{t("apply_now")}</span>
                              <ArrowRight
                                size={16}
                                className="sm:w-[18px] sm:h-[18px] group-hover:translate-x-2 transition-transform"
                              />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
              )}
          </div>
        </div>
      </section>

      <section className="py-16 sm:py-24 lg:py-40 px-4 sm:px-6 lg:px-12 bg-white text-center">
        <div className="max-w-4xl mx-auto space-y-12 sm:space-y-16 lg:space-y-24">
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tighter">
              {t("why_join_title")}
            </h2>
            <p className="text-gray-500 text-base sm:text-lg font-medium">
              {t("why_join_subtitle")}
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            {perks.map((perk) => (
              <div
                key={perk.label}
                className="flex flex-col items-center space-y-4 sm:space-y-6 group"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gray-50 flex items-center justify-center text-[#10b981] group-hover:bg-[#10b981] group-hover:text-white transition-all shadow-sm">
                  <div className="scale-75 sm:scale-100">{perk.icon}</div>
                </div>
                <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-gray-800 text-center px-2">
                  {perk.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="apply-form" className="py-12 sm:py-16 md:py-24 lg:py-32 px-4 sm:px-6 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8 sm:gap-10 lg:gap-12 xl:gap-16">
            <div className="lg:w-2/5 space-y-4 sm:space-y-6">
              <div className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-black text-[#10b981] text-[9px] sm:text-[10px] font-black uppercase tracking-widest">
                {t("form_badge")}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#111] tracking-tighter leading-tight">
                {t("form_title")}
              </h2>
              <p className="text-gray-500 text-xs sm:text-sm font-medium leading-relaxed">
                {t("form_subtitle")}
              </p>
              <ul className="space-y-2 sm:space-y-3 pt-2 sm:pt-4">
                <li className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" aria-hidden />
                  {t("review_24h")}
                </li>
                <li className="flex items-center gap-2 sm:gap-3 text-[10px] sm:text-xs font-bold uppercase tracking-wider text-gray-700">
                  <span className="w-2 h-2 rounded-full bg-[#10b981] shrink-0" aria-hidden />
                  {t("direct_access")}
                </li>
              </ul>
            </div>

            <div className="lg:w-3/5">
              <form
                onSubmit={handleSubmit}
                className="bg-white p-5 sm:p-6 lg:p-10 rounded-2xl sm:rounded-3xl shadow-lg border border-gray-100 space-y-5 sm:space-y-6 relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-40 h-40 bg-[#10b981]/5 rounded-full blur-3xl -mr-20 -mt-20" aria-hidden />
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 relative">
                  <div className="space-y-1.5">
                    <label htmlFor="careers-fullname" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                      {t("identity")}
                    </label>
                    <input
                      id="careers-fullname"
                      required
                      type="text"
                      placeholder={t("full_name_placeholder")}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[#111] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all"
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="careers-email" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                      {t("communication")}
                    </label>
                    <input
                      id="careers-email"
                      required
                      type="email"
                      placeholder={t("email_placeholder")}
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[#111] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent transition-all"
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-1.5 relative">
                  <label htmlFor="careers-role" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                    {t("target_role")}
                  </label>
                  <div className="relative">
                    <select
                      id="careers-role"
                      required
                      className="w-full bg-gray-50 border border-gray-100 rounded-xl pl-3 sm:pl-4 pr-8 sm:pr-10 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[#111] focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent appearance-none cursor-pointer transition-all"
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    >
                      <option value="">{t("select_domain")}</option>
                      <option value="frontend">{t("option_frontend")}</option>
                      <option value="backend">{t("option_backend")}</option>
                      <option value="mobile">{t("option_mobile")}</option>
                      <option value="infra">{t("option_infra")}</option>
                      <option value="design">{t("option_design")}</option>
                    </select>
                    <ChevronDown
                      className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400 pointer-events-none"
                      size={14}
                    />
                  </div>
                </div>
                <div className="space-y-1.5 relative">
                  <label htmlFor="careers-brief" className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                    {t("technical_brief")}
                  </label>
                  <textarea
                    id="careers-brief"
                    rows={4}
                    placeholder={t("technical_brief_placeholder")}
                    className="w-full bg-gray-50 border border-gray-100 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-[#111] placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-transparent resize-none transition-all"
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  />
                </div>
                <div className="space-y-2 relative">
                  <label className="text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-gray-400 block">
                    {t("resume_label")}
                  </label>
                  <label className="flex flex-col items-center justify-center min-h-[120px] sm:min-h-[140px] rounded-xl sm:rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50/80 hover:border-[#10b981] hover:bg-[#10b981]/5 focus-within:border-[#10b981] focus-within:ring-2 focus-within:ring-[#10b981]/20 transition-all cursor-pointer group/upload">
                    <input
                      type="file"
                      required
                      className="sr-only"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          resume: e.target.files?.[0] || null,
                        })
                      }
                    />
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg sm:rounded-xl bg-white border border-gray-100 flex items-center justify-center text-gray-400 group-hover/upload:bg-[#10b981] group-hover/upload:text-white group-hover/upload:border-[#10b981] transition-colors duration-200 shadow-sm">
                      <Upload size={18} strokeWidth={2} className="sm:w-5 sm:h-5" />
                    </div>
                    <div className="mt-2 sm:mt-3 text-center px-4">
                      <p className="text-xs sm:text-sm font-bold text-[#111]">
                        {formData.resume ? formData.resume.name : t("resume_placeholder")}
                      </p>
                      <p className="text-[10px] sm:text-xs text-gray-500 mt-0.5">{t("resume_hint")}</p>
                    </div>
                  </label>
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#10b981] text-black py-3 sm:py-4 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-wider flex items-center justify-center gap-2 sm:gap-3 hover:bg-black hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#10b981] focus-visible:ring-offset-2 transition-all shadow-lg shadow-[#10b981]/25 hover:shadow-xl hover:shadow-black/10"
                >
                  <span>{t("submit_btn")}</span>
                  <Send size={16} strokeWidth={2.5} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
