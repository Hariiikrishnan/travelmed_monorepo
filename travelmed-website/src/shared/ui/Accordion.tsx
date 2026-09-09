'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
  defaultOpenId?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  className,
  allowMultiple = false,
  defaultOpenId
}) => {
  const [openIds, setOpenIds] = useState<string[]>(defaultOpenId ? [defaultOpenId] : []);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds(openIds.includes(id) ? openIds.filter((x) => x !== id) : [...openIds, id]);
    } else {
      setOpenIds(openIds.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={cn("space-y-3.5 w-full select-none", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        
        return (
          <motion.div
            key={item.id}
            layout
            transition={{ duration: 0.2 }}
            className={cn(
              "border rounded-2xl overflow-hidden transition-all duration-300 backdrop-blur-xl",
              isOpen 
                ? "bg-white dark:bg-neutral-900 border-primary/40 dark:border-primary/40 shadow-md ring-2 ring-primary/10" 
                : "bg-white/80 dark:bg-neutral-900/80 border-slate-200/80 dark:border-neutral-800/80 hover:border-slate-300 dark:hover:border-neutral-700 shadow-2xs"
            )}
          >
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="flex justify-between items-center w-full px-5 py-4 sm:px-6 sm:py-4.5 text-left font-extrabold text-sm sm:text-base focus:outline-none select-none cursor-pointer group"
            >
              <span className="flex items-center gap-3 pr-4">
                {item.icon ? (
                  <span className={cn(
                    "p-2 rounded-xl text-primary transition-colors shrink-0",
                    isOpen ? "bg-primary/10" : "bg-slate-100 dark:bg-neutral-800"
                  )}>
                    {item.icon}
                  </span>
                ) : (
                  <span className={cn(
                    "w-2 h-2 rounded-full shrink-0 transition-colors duration-300",
                    isOpen ? "bg-secondary" : "bg-slate-300 dark:bg-neutral-700"
                  )} />
                )}
                <span className={cn(
                  "font-heading leading-snug transition-colors duration-200",
                  isOpen ? "text-slate-900 dark:text-white font-black" : "text-slate-800 dark:text-neutral-200 group-hover:text-primary"
                )}>
                  {item.title}
                </span>
              </span>

              <div className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center shrink-0 transition-all duration-300",
                isOpen 
                  ? "bg-secondary text-white shadow-sm shadow-secondary/30 rotate-180" 
                  : "bg-slate-100 dark:bg-neutral-800 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-neutral-200"
              )}>
                <ChevronDown className="h-4 w-4" />
              </div>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-5 pb-5 pt-1 sm:px-6 sm:pb-6 text-xs sm:text-sm text-slate-600 dark:text-neutral-300 leading-relaxed font-sans border-t border-slate-100 dark:border-neutral-800/80">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};

export default Accordion;
