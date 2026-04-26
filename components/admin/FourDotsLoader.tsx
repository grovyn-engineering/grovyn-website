"use client";

import { motion, useReducedMotion } from "framer-motion";

const RADII_PX = { sm: 10, md: 14, lg: 18 } as const;
const DOT = { sm: "h-1.5 w-1.5", md: "h-2 w-2", lg: "h-2.5 w-2.5" } as const;
const BOX = { sm: "h-8 w-8", md: "h-11 w-11", lg: "h-14 w-14" } as const;

export function FourDotsLoader({
  size = "md",
  className = "",
  "aria-label": ariaLabel = "Loading",
}: {
  size?: keyof typeof BOX;
  className?: string;
  "aria-label"?: string;
}) {
  const reduceMotion = useReducedMotion();
  const r = RADII_PX[size];
  const dot = DOT[size];
  const box = BOX[size];

  return (
    <div className={`relative ${box} ${className}`} role="status" aria-live="polite" aria-label={ariaLabel}>
      <span className="sr-only">{ariaLabel}</span>
      <div className="absolute left-1/2 top-1/2 h-0 w-0 -translate-x-1/2 -translate-y-1/2">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="absolute block"
            style={{
              transform: `rotate(${i * 90}deg) translateY(-${r}px)`,
            }}
          >
            {reduceMotion ? (
              <span
                className={`block ${dot} rounded-full bg-[#10b981]/75 shadow-[0_1px_2px_rgba(16,185,129,0.35)]`}
              />
            ) : (
              <motion.span
                className={`block ${dot} rounded-full bg-[#10b981] shadow-[0_1px_2px_rgba(16,185,129,0.35)]`}
                animate={{
                  scale: [0.72, 1.12, 0.72],
                  opacity: [0.28, 1, 0.28],
                }}
                transition={{
                  duration: 0.95,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.16,
                }}
              />
            )}
          </span>
        ))}
      </div>
    </div>
  );
}
