'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';
import { Card } from './Card';
import { Badge } from './Badge';

interface TimelineItem {
  id: string;
  badge?: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: React.ReactNode;
  image?: string;
  benefits?: string[];
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export const Timeline: React.FC<TimelineProps> = ({
  items,
  className
}) => {
  return (
    <div className={cn("relative border-l border-border/80 pl-8 ml-4 space-y-12 md:space-y-20 py-4", className)}>
      {items.map((item, idx) => {
        return (
          <div key={item.id} className="relative">
            {/* Timeline Dot / Icon */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
              className="absolute -left-[53px] top-1 flex items-center justify-center w-11 h-11 rounded-full bg-white dark:bg-neutral-900 border border-primary text-primary shadow-sm"
            >
              {item.icon ? item.icon : <span className="font-bold text-sm">{idx + 1}</span>}
            </motion.div>

            {/* Content block */}
            <motion.div
              initial={{ x: 30, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
            >
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-2 flex-wrap">
                  {item.badge && <Badge variant="secondary">{item.badge}</Badge>}
                  <span className="text-xs font-semibold text-primary uppercase tracking-wider">Chapter {idx + 1}</span>
                </div>
                <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight font-heading">{item.title}</h3>
                {item.subtitle && <h4 className="text-base md:text-lg font-medium text-neutral-500">{item.subtitle}</h4>}
                <p className="text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed max-w-xl">
                  {item.description}
                </p>

                {item.benefits && item.benefits.length > 0 && (
                  <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs md:text-sm text-neutral-600 dark:text-neutral-300">
                    {item.benefits.map((b, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {item.image && (
                <div className="lg:col-span-5 w-full">
                  <Card hoverEffect={false} className="border-none shadow-none rounded-xl overflow-hidden aspect-video relative group bg-neutral-100">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </Card>
                </div>
              )}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;
