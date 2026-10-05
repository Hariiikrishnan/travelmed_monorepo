'use client';

import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

interface FloatingKitProps {
  /** Size / position classes for the wrapper (e.g. `w-[300px] absolute -top-16 right-8`) */
  className?: string;
  /** Tilt in degrees */
  rotate?: number;
  /** Gentle up/down float animation */
  float?: boolean;
}

/** The Travel Med pouch as a decorative product cut-out (static by default). */
export function FloatingKit({ className, rotate = 0, float = false }: FloatingKitProps) {
  const reduceMotion = useReducedMotion();
  const animate = float && !reduceMotion;

  return (
    <div aria-hidden className={cn('pointer-events-none select-none', className)}>
      <div className="relative" style={{ transform: `rotate(${rotate}deg)` }}>
        <div className="absolute inset-x-[12%] bottom-[-6%] h-[30%] rounded-full bg-secondary/30 blur-3xl" />
        <motion.div
          animate={animate ? { y: [0, -8, 0] } : undefined}
          transition={animate ? { duration: 6, repeat: Infinity, ease: 'easeInOut' } : undefined}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/travelmedbag-web.webp"
            alt=""
            width={800}
            height={483}
            loading="lazy"
            className="relative block h-auto w-full drop-shadow-[0_24px_30px_rgba(3,20,45,0.45)]"
          />
        </motion.div>
      </div>
    </div>
  );
}

export default FloatingKit;
