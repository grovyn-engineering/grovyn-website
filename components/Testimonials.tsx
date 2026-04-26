"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { fetchCmsTestimonialsClient } from "@/lib/cms";

type TRow = {
  id: string | number;
  name: string;
  role: string;
  text: string;
  rating: string;
  image: string;
};

const STATIC_TESTIMONIALS: TRow[] = [
  {
    id: 1,
    name: "Babu Erectors Private Limited",
    role: "Construction and Infrastructure Services",
    text: "In construction, clarity and control matter more than fancy tools. Grovyn took time to understand how our teams operate on-site and across projects. The systems they helped us structure improved coordination and reporting without adding complexity. It felt practical, reliable, and built with long-term use in mind.",
    rating: "4.5/5",
    image: "/assets/bepl-logo.png",
  },
  {
    id: 2,
    name: "The24x7 Care",
    role: "Home Healthcare Services",
    text: "Our work involves real people and real responsibilities, so reliability was critical for us. Grovyn approached our platform with sensitivity to operations, compliance, and scale. Instead of overengineering, they focused on building a system that our team could actually run day to day. That clarity made a meaningful difference.",
    rating: "4.5/5",
    image: "/assets/24x7care.png",
  },
  {
    id: 3,
    name: "A3 House of Friends",
    role: "Café and Food Services",
    text: "As a café, speed and simplicity are essential, especially during peak hours. Grovyn helped us implement a QR-based ordering system with queue handling and inventory visibility that fit naturally into how we work. The solution reduced friction for customers and staff without changing the soul of the place. It felt thoughtfully designed, not forced.",
    rating: "5/5",
    image: "/assets/a3house.png",
  },
];

function starCountFromRating(rating: string): number {
  const n = parseFloat(rating.split("/")[0]?.trim() ?? "");
  return Number.isFinite(n) ? Math.floor(n) : 0;
}

export default function Testimonials() {
  const [rows, setRows] = useState<TRow[]>(STATIC_TESTIMONIALS);
  const [cmsLoading, setCmsLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const api = await fetchCmsTestimonialsClient();
        if (!cancelled && api.length > 0) {
          setRows(
            api.map((x) => ({
              id: x.id,
              name: x.name,
              role: x.role,
              text: x.text,
              rating: x.rating,
              image: x.image,
            }))
          );
        }
      } finally {
        if (!cancelled) setCmsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleNext = useCallback(() => {
    if (isAnimating || rows.length === 0) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % rows.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, rows.length]);

  const handlePrev = useCallback(() => {
    if (isAnimating || rows.length === 0) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + rows.length) % rows.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating, rows.length]);

  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  useEffect(() => {
    if (activeIndex >= rows.length) setActiveIndex(0);
  }, [rows.length, activeIndex]);

  const t = useTranslations("testimonials");
  return (
    <section className="py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-12 sm:gap-16 items-center">
        <div className="lg:w-2/5 space-y-6 sm:space-y-8 text-center lg:text-left">
          <h2 className="text-3xl sm:text-3xl lg:text-4xl font-black leading-[1.1] text-[#111]">
            {t("title")}
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-md mx-auto lg:mx-0">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex w-full flex-col items-center lg:w-3/5">
          {cmsLoading ? (
            <div className="flex w-full max-w-2xl animate-pulse flex-col gap-6 rounded-[2rem] bg-[#FFF5F5]/80 p-10 sm:rounded-[3rem]">
              <div className="flex gap-6">
                <div className="h-32 w-32 shrink-0 rounded-3xl bg-neutral-200/90 sm:h-40 sm:w-40" />
                <div className="flex-1 space-y-3 pt-2">
                  <div className="h-4 w-full rounded bg-neutral-200/80" />
                  <div className="h-4 w-full rounded bg-neutral-200/80" />
                  <div className="h-4 w-2/3 rounded bg-neutral-200/70" />
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="relative flex min-h-[450px] w-full items-center justify-center sm:min-h-[500px]">
                {rows.map((testimonial, index) => {
                  let position = index - activeIndex;
                  if (position < 0) position += rows.length;

                  const isMain = position === 0;
                  const isSecond = position === 1;
                  const isThird = position === 2;
                  const filledStars = starCountFromRating(testimonial.rating);

                  return (
                    <div
                      key={String(testimonial.id)}
                      className={`absolute w-full max-w-2xl transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] ${
                        isMain ? "z-30 translate-x-0 rotate-0 scale-100 opacity-100" : ""
                      } ${isSecond ? "z-20 translate-x-6 rotate-[3deg] scale-95 opacity-40 sm:translate-x-12" : ""} ${
                        isThird ? "z-10 translate-x-12 rotate-[6deg] scale-90 opacity-10 sm:translate-x-24" : ""
                      } ${!isMain && !isSecond && !isThird ? "z-0 scale-75 opacity-0" : ""}`}
                      style={{ pointerEvents: isMain ? "auto" : "none" }}
                    >
                      <div className="relative flex flex-col items-center gap-6 overflow-hidden rounded-[2rem] border border-pink-50/50 bg-[#FFF5F5] p-6 shadow-2xl sm:rounded-[3rem] sm:p-10 md:flex-row md:items-start lg:p-14">
                        <div className="absolute -right-12 -top-12 h-24 w-24 rounded-full bg-pink-100/30 blur-3xl sm:-mr-16 sm:-mt-16 sm:h-32 sm:w-32" />

                        <div className="flex w-full flex-col items-center md:w-1/3">
                          <div
                            className={`relative mb-4 overflow-hidden rounded-[2rem] border-4 border-white bg-white p-2 shadow-xl sm:mb-6 sm:rounded-[2.5rem] ${
                              index === 2 ? "h-28 w-36 sm:h-36 sm:w-48" : "h-28 w-28 sm:h-40 sm:w-40"
                            }`}
                          >
                            <div className="relative h-full w-full">
                              <Image
                                src={testimonial.image}
                                alt={testimonial.name}
                                fill
                                className="object-contain"
                                sizes="160px"
                              />
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 sm:space-x-3">
                            <span className="text-sm font-bold text-gray-800 sm:text-base">{testimonial.rating}</span>
                            <div className="flex text-yellow-400">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={12}
                                  className="sm:h-3.5 sm:w-3.5"
                                  fill={i < filledStars ? "currentColor" : "none"}
                                />
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex w-full flex-col justify-between md:w-2/3">
                          <div className="relative">
                            <span className="absolute -left-3 -top-4 select-none font-serif text-6xl text-pink-200 opacity-50 sm:-left-4 sm:-top-6 sm:text-8xl">
                              &quot;
                            </span>
                            <p className="relative z-10 mb-8 text-justify text-base font-medium leading-relaxed text-gray-700 sm:mb-12 sm:text-lg">
                              {testimonial.text}
                            </p>
                          </div>
                          <div className="text-right">
                            <h4 className="text-xl font-black text-[#111] sm:text-2xl">{testimonial.name}</h4>
                            <p className="mt-1 text-xs font-bold uppercase tracking-widest text-gray-400 sm:text-sm">
                              {testimonial.role}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-15 flex flex-col items-center space-y-4 sm:mt-20 sm:space-y-6">
                <div className="flex space-x-3 sm:space-x-4">
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="rounded-full border border-gray-200 bg-white p-3 shadow-sm transition-all hover:bg-black hover:text-white sm:p-4"
                    aria-label="Previous testimonial"
                  >
                    <ChevronLeft size={20} className="sm:h-6 sm:w-6" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    className="rounded-full border border-gray-200 bg-white p-3 shadow-sm transition-all hover:bg-black hover:text-white sm:p-4"
                    aria-label="Next testimonial"
                  >
                    <ChevronRight size={20} className="sm:h-6 sm:w-6" />
                  </button>
                </div>
                <div className="flex space-x-2">
                  {rows.map((_, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setActiveIndex(i)}
                      className={`h-2.5 w-2.5 rounded-full transition-all duration-300 ${
                        activeIndex === i ? "w-10 bg-emerald-500" : "bg-gray-200 hover:bg-gray-300"
                      }`}
                      aria-label={`Go to slide ${i + 1}`}
                    />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
