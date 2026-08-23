'use client';

import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

interface StatCardProps {
  value: number;
  suffix?: string;
  prefix?: string;
  title: string;
  description?: string;
  icon?: React.ReactNode;
  className?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  value,
  suffix = '',
  prefix = '',
  title,
  description,
  icon,
  className
}) => {
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;

    let start = 0;
    const end = value;
    if (start === end) return;

    // Total duration of the animation: 1.5 seconds
    const totalDuration = 1500;
    const incrementTime = Math.max(Math.floor(totalDuration / end), 15);
    
    const timer = setInterval(() => {
      start += Math.ceil(end / (totalDuration / incrementTime));
      if (start >= end) {
        clearInterval(timer);
        setCount(end);
      } else {
        setCount(start);
      }
    }, incrementTime);

    return () => clearInterval(timer);
  }, [isInView, value]);

  return (
    <div
      ref={ref}
      className={cn(
        "p-8 bg-card border border-border rounded-lg shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs md:text-sm font-semibold text-neutral-400 uppercase tracking-wider">{title}</span>
        {icon && <span className="text-primary p-2 bg-primary-light rounded-xl dark:bg-neutral-800 shrink-0">{icon}</span>}
      </div>
      
      <div className="mt-4 flex flex-col">
        <span className="text-3xl md:text-5xl font-extrabold tracking-tight font-heading">
          {prefix}
          {count}
          {suffix}
        </span>
        {description && (
          <p className="mt-2 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-normal">
            {description}
          </p>
        )}
      </div>
    </div>
  );
};

export default StatCard;
