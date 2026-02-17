import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Clock, Linkedin, Twitter, Instagram } from "lucide-react";
import { useTranslations } from "next-intl";

const SOCIAL_LINKS = [
  { label: "LinkedIn", href: "https://www.linkedin.com/company/grovynsystems/about", icon: Linkedin },
  { label: "Twitter", href: "https://twitter.com/buildwithgrovyn", icon: Twitter },
  { label: "Instagram", href: "https://www.instagram.com/buildwithgrovyn/", icon: Instagram },
] as const;

export default function Footer({ locale }: { locale: string }) {
  const t = useTranslations("footer");
  const base = `/${locale}`;

  return (
    <footer className="bg-[#111] text-gray-500 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-12 mb-16">
          <div className="space-y-6 md:max-w-sm">
            <Link href={base} className="inline-flex items-center">
              <Image
                src="/grovyn_logo.png"
                alt="Grovyn"
                width={80}
                height={40}
                sizes="80px"
                className="object-contain h-8 w-auto"
                style={{ width: "auto", height: "auto" }}
              />
            </Link>
            <p className="text-xs leading-relaxed max-w-xs">
              {t("tagline")}
            </p>
            <div className="space-y-4 pt-4 border-t border-white/5">
              <div className="flex items-center space-x-3 text-[11px] font-medium group">
                <Mail size={14} className="text-emerald-500 shrink-0" />
                <a
                  href="mailto:contact@grovyn.in"
                  className="hover:text-white transition-colors"
                >
                  contact@grovyn.in
                </a>
              </div>
              <div className="flex items-center space-x-3 text-[11px] font-medium group">
                <Phone size={14} className="text-emerald-500 shrink-0" />
                <a href="tel:+917354972920" className="hover:text-white transition-colors">
                  +91 7354972920
                </a>
              </div>
              <div className="flex items-center space-x-3 text-[11px] font-medium group">
                <MapPin size={14} className="text-emerald-500 shrink-0" />
                <span>{t("location")}</span>
              </div>
              <div className="flex items-center space-x-3 text-[11px] font-medium group">
                <Clock size={14} className="text-emerald-500 shrink-0" />
                <span>{t("hours")}</span>
              </div>
            </div>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-3">{t("connect")}</p>
              <div className="flex gap-2">
                {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-9 h-9 rounded-lg bg-white/5 text-gray-400 hover:bg-emerald-500/20 hover:text-emerald-400 transition-colors"
                    aria-label={label}
                  >
                    <Icon size={18} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap gap-x-30 gap-y-10 md:gap-x-40 md:gap-y-0 md:flex-nowrap">
            <div>
              <h5 className="text-white text-sm font-bold mb-6">{t("services_heading")}</h5>
              <ul className="text-xs space-y-4">
                <li>
                  <Link href={`${base}/services/web`} className="hover:text-emerald-500 transition-colors">
                    {t("web_dev")}
                  </Link>
                </li>
                <li>
                  <Link href={`${base}/services/mobile`} className="hover:text-emerald-500 transition-colors">
                    {t("mobile_eng")}
                  </Link>
                </li>
                {/* <li>
                  <Link href={`${base}/portfolio`} className="hover:text-emerald-500 transition-colors">
                    {t("ui_ux")}
                  </Link>
                </li> */}
                <li>
                  <Link href={`${base}/infrastructure/cloud`} className="hover:text-emerald-500 transition-colors">
                    {t("cloud_arch")}
                  </Link>
                </li>
                <li>
                  <Link href={`${base}/services/custom-software`} className="hover:text-emerald-500 transition-colors">
                    {t("custom_software")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-white text-sm font-bold mb-6">{t("company_heading")}</h5>
              <ul className="text-xs space-y-4">
                <li>
                  <Link href={`${base}/about`} className="hover:text-emerald-500 transition-colors">
                    {t("about")}
                  </Link>
                </li>
                <li>
                  <Link href={`${base}/careers`} className="hover:text-emerald-500 transition-colors">
                    {t("careers")}
                  </Link>
                </li>
                <li>
                  <Link href={`${base}/portfolio`} className="hover:text-emerald-500 transition-colors">
                    {t("portfolio")}
                  </Link>
                </li>
                <li>
                  <Link href={`${base}/blog`} className="hover:text-emerald-500 transition-colors">
                    {t("blog")}
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h5 className="text-white text-sm font-bold mb-6">{t("resources_heading")}</h5>
              <ul className="text-xs space-y-4">
                <li>
                  <Link href={`${base}#contact`} className="hover:text-emerald-500 transition-colors">
                    {t("contact")}
                  </Link>
                </li>
                <li>
                  <Link href={`${base}/privacy`} className="hover:text-emerald-500 transition-colors">
                    {t("privacy")}
                  </Link>
                </li>
                <li>
                  <Link href={`${base}/terms`} className="hover:text-emerald-500 transition-colors">
                    {t("terms")}
                  </Link>
                </li>
                {/* <li>
                  <a
                    href="https://www.linkedin.com/company/grovynsystems/about"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-emerald-500 transition-colors"
                  >
                    {t("linkedin")}
                  </a>
                </li> */}
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-gray-800 flex justify-between items-center text-[10px] uppercase tracking-[0.1em] font-bold">
          <p>©2026 {t("copyright")}</p>
          <div className="flex space-x-8">
            <Link href={`${base}/privacy`} className="hover:text-white">
              {t("privacy")}
            </Link>
            <Link href={`${base}/terms`} className="hover:text-white">
              {t("terms")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}