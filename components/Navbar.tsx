"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Phone, ChevronDown, Monitor, Smartphone, LayoutGrid, Users, Briefcase, Mail, X, Cloud, Network, Headphones, GitBranch, MessageCircle, Truck, BookOpen, Shield, Database, Home, Globe } from "lucide-react";
import { locales, localeNames, type Locale } from "@/i18n/config";

export default function Navbar() {
  const t = useTranslations("navbar");
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [capabilitiesSub, setCapabilitiesSub] = useState<"services" | "infrastructure">("services");
  const [localeOpen, setLocaleOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mobileMenuOpen) {
      const prevBody = document.body.style.overflow;
      const prevHtml = document.documentElement.style.overflow;
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = prevBody;
        document.documentElement.style.overflow = prevHtml;
      };
    }
  }, [mobileMenuOpen]);

  const isHome = pathname === `/${locale}` || pathname === "/";
  const isDarkNav = !isScrolled && isHome;

  const serviceItems = [
    { title: t("menus.web"), desc: t("menus.web_desc"), icon: <Monitor size={18} />, slug: "web" },
    { title: t("menus.mobile"), desc: t("menus.mobile_desc"), icon: <Smartphone size={18} />, slug: "mobile" },
    { title: t("menus.custom_software"), desc: t("menus.custom_software_desc"), icon: <LayoutGrid size={18} />, slug: "custom-software" },
  ];
  const serviceColumns = [
    { title: t("services_web_title"), subtitle: t("services_web_subtitle"), items: [serviceItems[0]] },
    { title: t("services_mobile_title"), subtitle: t("services_mobile_subtitle"), items: [serviceItems[1]] },
    { title: t("services_custom_software_title"), subtitle: t("services_custom_software_subtitle"), items: [serviceItems[2]] },
  ];

  const ti = (key: string) => t(`infrastructure_menu.${key}`);
  const infrastructureColumns = [
    {
      title: ti("cloud_network_title"),
      subtitle: ti("cloud_network_subtitle"),
      items: [
        { slug: "cloud", label: ti("cloud"), desc: ti("cloud_desc"), icon: <Cloud size={18} /> },
        { slug: "network", label: ti("network"), desc: ti("network_desc"), icon: <Network size={18} /> },
      ],
    },
    {
      title: ti("security_support_title"),
      subtitle: ti("security_support_subtitle"),
      items: [
        { slug: "security", label: ti("security"), desc: ti("security_desc"), icon: <Shield size={18} /> },
        { slug: "support", label: ti("support"), desc: ti("support_desc"), icon: <Headphones size={18} /> },
        { slug: "backup", label: ti("backup"), desc: ti("backup_desc"), icon: <Database size={18} /> },
      ],
    },
    {
      title: ti("operations_title"),
      subtitle: ti("operations_subtitle"),
      items: [
        { slug: "devops", label: ti("devops"), desc: ti("devops_desc"), icon: <GitBranch size={18} /> },
        { slug: "communication", label: ti("communication"), desc: ti("communication_desc"), icon: <MessageCircle size={18} /> },
      ],
    },
  ];
  const infrastructureFeatured = { slug: "migration", label: ti("migration"), desc: ti("migration_desc"), icon: <Truck size={20} /> };

  const resourceItems = [
    { title: t("portfolio"), href: `/${locale}/portfolio`, icon: <LayoutGrid size={20} /> },
    { title: t("careers"), href: `/${locale}/careers`, icon: <Briefcase size={20} /> },
    { title: t("resources_menu.blog"), href: `/${locale}/blog`, icon: <BookOpen size={20} /> },
    { title: t("resources_menu.contact"), href: `/${locale}#contact`, icon: <Mail size={20} /> },
  ];

  const switchLocale = (newLocale: Locale) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`) || `/${newLocale}`;
    router.push(newPath);
    setLocaleOpen(false);
  };

  const navClass = `h-20 fixed top-0 w-full z-[100] transition-all duration-300 ${
    isScrolled
      ? "bg-white/95 backdrop-blur-md text-[#111] border-b border-gray-100 shadow-sm"
      : isDarkNav
        ? "bg-black text-white"
        : "bg-white text-[#111]"
  }`;

  const linkClass = (active?: boolean) =>
    `hover:text-[#10b981] transition-colors py-2 ${active ? "text-[#10b981]" : ""}`;

  const dropPanel = isDarkNav
    ? "bg-[#111] text-white border border-white/10 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.5)]"
    : "bg-white text-[#111] border border-gray-100 rounded-[2rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.15)]";
  const dropItemHover = isDarkNav ? "hover:bg-white/10" : "hover:bg-gray-50/50";
  const dropItemHoverAlt = isDarkNav ? "hover:bg-white/10" : "hover:bg-gray-50/80";
  const dropTitle = isDarkNav ? "text-white" : "text-[#111]";
  const dropDesc = "text-gray-400";
  const dropBorder = isDarkNav ? "border-white/10" : "border-gray-100";
  const localeDropdown = isDarkNav
    ? "bg-[#111] text-white border border-white/10 rounded-xl shadow-xl"
    : "bg-white text-[#111] border border-gray-100 rounded-xl shadow-xl";
  const localeItemHover = isDarkNav ? "hover:bg-white/10" : "hover:bg-gray-50";
  const localeButtonClass = isDarkNav
    ? "border-white/20 hover:bg-white/10"
    : "border-gray-200 hover:bg-gray-100 text-[#111]";

  return (
    <nav className={navClass}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-0 h-full flex justify-between items-center gap-4 min-w-0">
        <Link
          href={`/${locale}#hero`}
          className="flex items-center space-x-1 group shrink-0 mr-4 md:mr-6"
        >
          <span className="relative h-10 shrink-0" style={{ width: "auto" }}>
            <Image
              src="/grovyn_logo.png"
              alt="Grovyn"
              width={120}
              height={40}
              sizes="120px"
              className="object-contain"
              style={{ height: "2.5rem", width: "auto" }}
              priority
              suppressHydrationWarning
            />
          </span>
          <span className={`text-lg md:text-xl font-black tracking-tight whitespace-nowrap ${isDarkNav ? "text-white" : "text-[#111]"}`}>
            rovyn
          </span>
        </Link>

        <div className="hidden lg:flex items-center space-x-5 xl:space-x-8 text-sm font-bold h-full min-w-0 shrink">
          <Link
            href={`/${locale}`}
            className={`transition-colors py-2 ${linkClass(isHome)}`}
          >
            {t("home")}
          </Link>
          <div
            className="relative group flex items-center h-full"
            onMouseEnter={() => { setActiveMenu("capabilities"); setCapabilitiesSub((s) => (s === "services" || s === "infrastructure" ? s : "services")); }}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="relative h-full flex items-center">
              <button
                className={`flex items-center space-x-1.5 transition-colors py-2 ${linkClass(activeMenu === "capabilities")}`}
              >
                <span>{t("capabilities")}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 opacity-60 ${activeMenu === "capabilities" ? "rotate-180 opacity-100" : ""}`}
                />
              </button>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/6 pt-2 transition-all duration-300 transform origin-top ${
                  activeMenu === "capabilities"
                    ? "opacity-100 visible translate-y-0 scale-100"
                    : "opacity-0 invisible -translate-y-2 scale-95"
                }`}
              >
                <div className={`${dropPanel} flex w-[min(980px,calc(100vw-2rem))] overflow-hidden rounded-[2rem]`}>
                  <div className={`shrink-0 w-[220px] border-r ${dropBorder} flex flex-col`}>
                    <button
                      type="button"
                      onMouseEnter={() => setCapabilitiesSub("services")}
                      className={`flex items-center gap-3 px-5 pt-5 pb-4 text-left transition-all border-l-2 ${capabilitiesSub === "services" ? "border-[#10b981] bg-[#10b981]/5" : `border-transparent ${dropItemHover}`}`}
                    >
                      <Monitor size={20} className={capabilitiesSub === "services" ? "text-[#10b981]" : "opacity-60"} />
                      <span className={`font-bold text-sm ${dropTitle}`}>{t("services")}</span>
                    </button>
                    <button
                      type="button"
                      onMouseEnter={() => setCapabilitiesSub("infrastructure")}
                      className={`flex items-center gap-3 px-5 py-4 text-left transition-all border-l-2 ${capabilitiesSub === "infrastructure" ? "border-[#10b981] bg-[#10b981]/5" : `border-transparent ${dropItemHover}`}`}
                    >
                      <Cloud size={20} className={capabilitiesSub === "infrastructure" ? "text-[#10b981]" : "opacity-60"} />
                      <span className={`font-bold text-sm ${dropTitle}`}>{t("infrastructure")}</span>
                    </button>
                  </div>
                  <div className="flex-1 min-w-0 p-8 flex flex-col">
                    {capabilitiesSub === "services" && (
                      <div className="space-y-5 flex-1 flex flex-col">
                        <h3 className={`text-xs font-black uppercase tracking-widest ${dropDesc} mb-3`}>
                          {t("capabilities_services_heading")}
                        </h3>
                        <div className="grid grid-cols-3 gap-8">
                          {serviceColumns.map((col, i) => (
                            <div key={i} className="space-y-2 min-w-0">
                              <ul className="space-y-2">
                                {col.items.map((item) => (
                                  <li key={item.slug}>
                                    <Link
                                      href={`/${locale}/services/${item.slug}`}
                                      className={`flex items-start gap-3 p-2.5 -m-2.5 rounded-xl ${dropItemHoverAlt} transition-all group/item`}
                                      onClick={() => setActiveMenu(null)}
                                    >
                                      <span className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shrink-0 group-hover/item:bg-[#10b981] group-hover/item:text-white transition-all">
                                        {item.icon}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <span className={`font-bold text-xs ${dropTitle} block`}>{item.title}</span>
                                        <span className={`text-[11px] font-medium ${dropDesc} block leading-snug`}>{item.desc}</span>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {capabilitiesSub === "infrastructure" && (
                      <div className="space-y-5 flex-1 flex flex-col">
                        <h3 className={`text-xs font-black uppercase tracking-widest ${dropDesc} mb-3`}>
                          {t("capabilities_infra_heading")}
                        </h3>
                        <div className="grid grid-cols-3 gap-8">
                          {infrastructureColumns.map((col, i) => (
                            <div key={i} className="space-y-4 min-w-0">
                              <div className="mb-5">
                                <h4 className={`font-black text-sm ${dropTitle}`}>{col.title}</h4>
                                <p className={`text-[11px] font-medium ${dropDesc} mt-0.5`}>{col.subtitle}</p>
                              </div>
                              <ul className="space-y-2">
                                {col.items.map((item) => (
                                  <li key={item.slug}>
                                    <Link
                                      href={`/${locale}/infrastructure/${item.slug}`}
                                      className={`flex items-start gap-3 p-2.5 -m-2.5 rounded-xl ${dropItemHoverAlt} transition-all group/item`}
                                      onClick={() => setActiveMenu(null)}
                                    >
                                      <span className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shrink-0 group-hover/item:bg-[#10b981] group-hover/item:text-white transition-all">
                                        {item.icon}
                                      </span>
                                      <div className="min-w-0 flex-1">
                                        <span className={`font-bold text-xs ${dropTitle} block`}>{item.label}</span>
                                        <span className={`text-[11px] font-medium ${dropDesc} block leading-snug`}>{item.desc}</span>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <Link
            href={`/${locale}/industries`}
            className={`transition-colors py-2 ${linkClass(pathname.includes("industries"))}`}
          >
            {t("industries")}
          </Link>
          <Link
            href={`/${locale}/automations`}
            className={`transition-colors py-2 ${linkClass(pathname.includes("automations"))}`}
          >
            {t("automations")}
          </Link>

          <Link
            href={`/${locale}/about`}
            className={`transition-colors py-2 ${linkClass(pathname.includes("about"))}`}
          >
            {t("about")}
          </Link>
          <div
            className="relative group flex items-center h-full"
            onMouseEnter={() => setActiveMenu("resources")}
            onMouseLeave={() => setActiveMenu(null)}
          >
            <div className="relative h-full flex items-center">
              <button
                className={`flex items-center space-x-1.5 transition-colors py-2 ${linkClass(activeMenu === "resources")}`}
              >
                <span>{t("resources")}</span>
                <ChevronDown
                  size={14}
                  className={`transition-transform duration-300 opacity-60 ${activeMenu === "resources" ? "rotate-180 opacity-100" : ""}`}
                />
              </button>
              <div
                className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-300 transform origin-top ${
                  activeMenu === "resources"
                    ? "opacity-100 visible translate-y-0 scale-100"
                    : "opacity-0 invisible -translate-y-2 scale-95"
                }`}
              >
                <div className={`${dropPanel} p-4 w-[240px] space-y-0.5`}>
                  {resourceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-3 space-x-3 p-2 rounded-xl ${dropItemHoverAlt} transition-all font-bold text-sm ${dropTitle}`}
                      onClick={() => setActiveMenu(null)}
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shrink-0">
                        {item.icon}
                      </div>
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-4 shrink-0">
          {/* Locale switcher disabled – re-enable when localization is needed
          <div className="relative">
            <button
              type="button"
              onClick={() => setLocaleOpen(!localeOpen)}
              className={`text-xs font-bold uppercase tracking-wider px-3 py-2 rounded-xl border transition-colors flex items-center gap-2 ${localeButtonClass}`}
              aria-expanded={localeOpen}
              aria-haspopup="listbox"
              aria-label="Switch language"
            >
              <Globe size={14} className="shrink-0 opacity-80" />
              <span>{localeNames[locale as Locale]}</span>
              <ChevronDown size={12} className={`shrink-0 transition-transform ${localeOpen ? "rotate-180" : ""}`} />
            </button>
            {localeOpen && (
              <>
                <div
                  className="fixed inset-0 z-[90]"
                  onClick={() => setLocaleOpen(false)}
                  aria-hidden
                />
                <div
                  className={`absolute top-full right-0 mt-2 py-1.5 rounded-xl ${localeDropdown} z-[95] min-w-[160px] shadow-lg`}
                >
                  {locales.map((loc) => (
                    <button
                      key={loc}
                      type="button"
                      onClick={() => switchLocale(loc)}
                      className={`w-full text-left px-4 py-2.5 text-sm font-medium ${localeItemHover} transition-colors ${locale === loc ? "text-[#10b981] font-bold" : ""} ${dropTitle}`}
                    >
                      {localeNames[loc]}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          */}
          <Link
            href={`/${locale}#contact`}
            className="flex items-center space-x-2.5 px-6 py-3 rounded-xl border border-[#10b981]/40 text-[#10b981] font-bold text-sm hover:bg-[#10b981] hover:text-black transition-all group"
          >
            <Phone size={16} className="group-hover:animate-bounce" />
            <span>{t("cta")}</span>
          </Link>
        </div>

        <button
          type="button"
          className="lg:hidden flex flex-col space-y-1.5 cursor-pointer p-2 z-[110]"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div
            className={`w-6 h-0.5 transition-all ${isScrolled || !isHome ? "bg-black" : "bg-white"}`}
          />
          <div
            className={`w-6 h-0.5 transition-all ${isScrolled || !isHome ? "bg-black" : "bg-white"}`}
          />
          <div
            className={`w-4 h-0.5 transition-all self-end ${isScrolled || !isHome ? "bg-black" : "bg-white"}`}
          />
        </button>
      </div>

      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            className={`lg:hidden fixed inset-0 z-[9999] transition-all duration-300 ${
              mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
            }`}
          >
            <div
              className="absolute inset-0 z-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setMobileMenuOpen(false)}
              aria-hidden
            />
            <div
              className={`absolute top-0 right-0 z-10 h-full w-[80%] max-w-[400px] bg-white shadow-2xl p-8 transform transition-transform duration-300 ${
                mobileMenuOpen ? "translate-x-0" : "translate-x-full"
              } [dir=rtl]:left-0 [dir=rtl]:right-auto [dir=rtl]:translate-x-0 ${
                mobileMenuOpen ? "[dir=rtl]:translate-x-0" : "[dir=rtl]:-translate-x-full"
              }`}
            >
              <div className="flex flex-col gap-8 h-full text-[#111]">
                <div className="flex items-center justify-between w-full shrink-0 bg-white">
                  <Link
                    href={`/${locale}`}
                    className="flex items-center space-x-2"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span className="relative h-8 shrink-0" style={{ width: "auto" }}>
                      <Image
                        src="/grovyn_logo.png"
                        alt="Grovyn"
                        width={100}
                        height={34}
                        className="object-contain"
                        style={{ height: "2rem", width: "auto" }}
                        suppressHydrationWarning
                      />
                    </span>
                    <span className="text-lg font-black tracking-tight text-[#111]">rovyn</span>
                  </Link>
                  <button
                    type="button"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center w-10 h-10 rounded-lg text-[#111] hover:bg-gray-50 cursor-pointer transition-colors shrink-0"
                    aria-label="Close menu"
                  >
                    <X size={22} strokeWidth={2.5} />
                  </button>
                </div>
                <div className="flex flex-col gap-6 mt-2 overflow-y-auto">
                  <Link
                    href={`/${locale}`}
                    className="flex items-center gap-6 font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shrink-0">
                      <Home size={20} />
                    </div>
                    {t("home")}
                  </Link>
                  <hr className="border-gray-100" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {t("capabilities")}
                  </p>
                  <p className="text-[10px] font-bold text-gray-500 pl-0">{t("services")}</p>
                  {serviceItems.map((s) => (
                    <Link
                      key={s.slug}
                      href={`/${locale}/services/${s.slug}`}
                      className="flex items-center gap-6 font-bold pl-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shrink-0">
                        {s.icon}
                      </div>
                      {s.title}
                    </Link>
                  ))}
                  <p className="text-[10px] font-bold text-gray-500 pl-0 pt-2">{t("infrastructure")}</p>
                  {infrastructureColumns.flatMap((col) => col.items).concat([{ slug: infrastructureFeatured.slug, label: infrastructureFeatured.label, desc: infrastructureFeatured.desc, icon: infrastructureFeatured.icon }]).map((item) => (
                    <Link
                      key={item.slug}
                      href={`/${locale}/infrastructure/${item.slug}`}
                      className="flex items-center gap-6 font-bold pl-2"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shrink-0">
                        {item.icon}
                      </div>
                      {item.label}
                    </Link>
                  ))}
                  <hr className="border-gray-100" />
                  <Link
                    href={`/${locale}/industries`}
                    className="flex items-center gap-4 font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("industries")}
                  </Link>
                  <hr className="border-gray-100" />
                  <Link
                    href={`/${locale}/automations`}
                    className="flex items-center gap-4 font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("automations")}
                  </Link>
                  <hr className="border-gray-100" />
                  <Link
                    href={`/${locale}/about`}
                    className="flex items-center gap-4 font-bold"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("about")}
                  </Link>
                  <hr className="border-gray-100" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">
                    {t("resources")}
                  </p>
                  {resourceItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center gap-6 font-bold"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <div className="w-12 h-12 rounded-xl bg-[#10b981]/10 flex items-center justify-center text-[#10b981] shrink-0">
                        {item.icon}
                      </div>
                      {item.title}
                    </Link>
                  ))}
                </div>
                <div className="mt-auto flex flex-col gap-4">
                  {/* Locale switcher disabled – re-enable when localization is needed
                  <div className="flex flex-wrap gap-2">
                    {locales.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          switchLocale(loc);
                          setMobileMenuOpen(false);
                        }}
                        className={`px-3 py-2 rounded-lg text-sm font-bold border transition-colors ${
                          locale === loc
                            ? "bg-[#10b981] text-white border-[#10b981]"
                            : "border-gray-200 hover:bg-gray-50"
                        }`}
                      >
                        {localeNames[loc]}
                      </button>
                    ))}
                  </div>
                  */}
                  <Link
                    href={`/${locale}#contact`}
                    className="w-full flex items-center justify-center gap-2 bg-[#10b981] text-black py-4 rounded-xl font-bold text-sm"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Phone size={16} />
                    {t("cta")}
                  </Link>
                </div>
              </div>
            </div>
          </div>,
          document.body
        )}
    </nav>
  );
}
