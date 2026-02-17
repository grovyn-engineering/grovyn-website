"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslations } from "next-intl";

const testimonials = [
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

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    setTimeout(() => setIsAnimating(false), 800);
  }, [isAnimating]);

  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

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

        <div className="lg:w-3/5 flex flex-col items-center w-full">
          <div className="relative w-full min-h-[450px] sm:min-h-[500px] flex items-center justify-center">
            {testimonials.map((testimonial, index) => {
              let position = index - activeIndex;
              if (position < 0) position += testimonials.length;

              const isMain = position === 0;
              const isSecond = position === 1;
              const isThird = position === 2;

              return (
                <div
                  key={testimonial.id}
                  className={`absolute w-full max-w-2xl transition-all duration-700 ease-[cubic-bezier(0.23, 1, 0.32, 1)] ${
                    isMain ? "z-30 opacity-100 scale-100 translate-x-0 rotate-0" : ""
                  } ${isSecond ? "z-20 opacity-40 scale-95 sm:translate-x-12 translate-x-6 rotate-[3deg]" : ""} ${
                    isThird ? "z-10 opacity-10 scale-90 sm:translate-x-24 translate-x-12 rotate-[6deg]" : ""
                  } ${!isMain && !isSecond && !isThird ? "z-0 opacity-0 scale-75" : ""}`}
                  style={{ pointerEvents: isMain ? "auto" : "none" }}
                >
                  <div className="bg-[#FFF5F5] rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-10 lg:p-14 shadow-2xl border border-pink-50/50 flex flex-col md:flex-row gap-6 sm:gap-8 items-center md:items-start relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-pink-100/30 rounded-full blur-3xl -mr-12 sm:-mr-16 -mt-12 sm:-mt-16" />

                    <div className="w-full md:w-1/3 flex flex-col items-center">
                      <div
                        className={`relative rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden shadow-xl border-4 border-white mb-4 sm:mb-6 bg-white p-2 ${
                          testimonial.id === 3
                            ? "w-36 h-28 sm:w-48 sm:h-36"
                            : "w-28 h-28 sm:w-40 sm:h-40"
                        }`}
                      >
                        <div className="relative w-full h-full">
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
                        <span className="font-bold text-gray-800 text-sm sm:text-base">{testimonial.rating}</span>
                        <div className="flex text-yellow-400">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={12}
                              className="sm:w-3.5 sm:h-3.5"
                              fill={
                                i < Math.floor(parseFloat(testimonial.rating)) ? "currentColor" : "none"
                              }
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="w-full md:w-2/3 flex flex-col justify-between">
                      <div className="relative">
                        <span className="absolute -top-4 sm:-top-6 -left-3 sm:-left-4 text-pink-200 text-6xl sm:text-8xl font-serif select-none opacity-50">
                          &quot;
                        </span>
                        <p className="text-gray-700 text-base sm:text-l text-justify leading-relaxed font-medium mb-8 sm:mb-12 relative z-10">
                          {testimonial.text}
                        </p>
                      </div>
                      <div className="text-right">
                        <h4 className="text-xl sm:text-2xl font-black text-[#111]">{testimonial.name}</h4>
                        <p className="text-xs sm:text-sm font-bold text-gray-400 uppercase tracking-widest mt-1">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-15 sm:mt-20 flex flex-col items-center space-y-4 sm:space-y-6">
            <div className="flex space-x-3 sm:space-x-4">
              <button
                type="button"
                onClick={handlePrev}
                className="p-3 sm:p-4 rounded-full border border-gray-200 bg-white hover:bg-black hover:text-white transition-all shadow-sm"
                aria-label="Previous testimonial"
              >
                <ChevronLeft size={20} className="sm:w-6 sm:h-6" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="p-3 sm:p-4 rounded-full border border-gray-200 bg-white hover:bg-black hover:text-white transition-all shadow-sm"
                aria-label="Next testimonial"
              >
                <ChevronRight size={20} className="sm:w-6 sm:h-6" />
              </button>
            </div>
            <div className="flex space-x-2">
              {testimonials.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActiveIndex(i)}
                  className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                    activeIndex === i ? "w-10 bg-emerald-500" : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
