"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export default function Metrics() {
  const locale = useLocale();
  const t = useTranslations("metrics");

  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#f5f5f5]">
      <div className="max-w-7xl mx-auto text-center mb-10 sm:mb-14">
        <h2 className="text-2xl sm:text-3xl lg:text-5xl font-black text-[#111] mb-3 sm:mb-4 tracking-tight">
          {t("title")}
        </h2>
        <p className="text-gray-500 max-w-2xl mx-auto text-xs sm:text-sm leading-relaxed font-medium">
          {t("subtitle")}
        </p>
      </div>

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 md:grid-rows-[auto_auto] md:auto-rows-fr">
          <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[1.75rem] border border-gray-100 shadow-sm flex flex-col md:col-start-1 md:row-start-1">
            <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#111] mb-1 sm:mb-2">{t("deliveries_value")}</h3>
            <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
              {t("deliveries_label")}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">
              {t("deliveries_desc")}
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[1.75rem] border border-gray-100 shadow-sm flex flex-col md:col-start-2 md:row-start-1 md:row-span-2">
            <h4 className="text-base sm:text-lg font-black text-[#111] mb-3 sm:mb-4 leading-tight">
              {t("global_delivery_title")}
            </h4>
            <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed mb-4 sm:mb-6">
              {t("global_delivery_desc")}
            </p>
            <div className="mt-auto space-y-3">
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden relative w-full border border-gray-100">
                <Image
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&q=80&w=500"
                  alt="Global delivery"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 25vw"
                />
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative border border-gray-100">
                  <Image
                    src="https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&q=80&w=150"
                    alt="Team"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative border border-gray-100">
                  <Image
                    src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=150"
                    alt="Collaboration"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden relative border border-gray-100">
                  <Image
                    src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?auto=format&fit=crop&q=80&w=150"
                    alt="Office"
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[1.75rem] border border-gray-100 shadow-sm flex flex-col md:col-start-3 md:row-start-1">
            <h3 className="text-3xl sm:text-4xl font-black text-[#111] mb-1 sm:mb-2">2–4 weeks</h3>
            <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
              {t("mvp_label")}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">
              {t("mvp_desc")}
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[1.75rem] border border-gray-100 shadow-sm flex flex-col md:col-start-4 md:row-start-1">
            <h3 className="text-3xl sm:text-4xl font-black text-[#111] mb-1 sm:mb-2">45 day</h3>
            <p className="text-gray-500 text-[10px] sm:text-xs font-bold uppercase tracking-wider mb-3 sm:mb-4">
              {t("quality_label")}
            </p>
            <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">
              {t("quality_desc")}
            </p>
          </div>

          <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[1.75rem] border border-gray-100 shadow-sm flex flex-col justify-between md:col-start-1 md:row-start-2">
            <div>
              <h4 className="text-base sm:text-lg font-black text-[#111] mb-3 sm:mb-4 leading-tight">
                {t("pricing_title")}
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed mb-4 sm:mb-6">
                {t("pricing_desc")}
              </p>
            </div>
            <Link
              href={`/${locale}#contact`}
              className="w-full bg-black text-white px-4 sm:px-5 py-3 sm:py-3.5 rounded-xl flex justify-between items-center text-xs sm:text-sm font-bold group hover:bg-[#10b981] transition-colors mt-auto"
            >
              <span>{t("get_quote")}</span>
              <span className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center">
                <ArrowUpRight size={16} className="text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </span>
            </Link>
          </div>

          <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl sm:rounded-[1.75rem] border border-gray-100 shadow-sm flex flex-row items-center gap-6 sm:gap-8 md:col-start-3 md:col-span-2 md:row-start-2">
            <div className="min-w-0 flex-1 space-y-2 sm:space-y-3">
              <h4 className="text-base sm:text-2xl lg:text-3xl font-black text-[#111] leading-tight">
                {t("ownership_title")}
              </h4>
              <p className="text-gray-600 text-xs sm:text-sm font-medium leading-relaxed">
                {t("ownership_desc")}
              </p>
            </div>
            <div className="relative w-30 h-30 sm:w-34 sm:h-34 shrink-0 overflow-hidden">
              <Image
                src="/assets/lock.png"
                alt="Full ownership, no lock-in"
                fill
                className="object-contain"
                sizes="96px"
              />
            </div>
          </div>

        </div>
      </div>

      <div className="overflow-hidden border-y border-gray-200 py-4 sm:py-6 mt-12 sm:mt-16 bg-white/50">
        <div className="flex animate-marquee whitespace-nowrap">
          {["Reliable systems", "Clear ownership", "Thoughtful execution", "Long-term thinking", "Calm delivery", "Practical engineering", "Trusted partnerships"].map((item, i) => (
            <div
              key={i}
              className="flex items-center mx-6 sm:mx-10 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.25em] text-[#111]"
            >
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-[#10b981] rounded-full mr-3 sm:mr-4" />
              {item}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
