'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  allowMultiple?: boolean;
}

export const Accordion: React.FC<AccordionProps> = ({
  items,
  className,
  allowMultiple = false
}) => {
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    if (allowMultiple) {
      setOpenIds(openIds.includes(id) ? openIds.filter((x) => x !== id) : [...openIds, id]);
    } else {
      setOpenIds(openIds.includes(id) ? [] : [id]);
    }
  };

  return (
    <div className={cn("space-y-4 w-full", className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        
        return (
          <div
            key={item.id}
            className="border border-border bg-card text-card-foreground rounded-xl overflow-hidden transition-all duration-300 hover:border-primary/20"
          >
            <button
              onClick={() => toggleItem(item.id)}
              className="flex justify-between items-center w-full px-6 py-5 text-left font-semibold text-sm md:text-base focus:outline-none select-none cursor-pointer"
            >
              <span>{item.title}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="text-neutral-400 shrink-0 ml-4"
              >
                <ChevronDown className="h-5 w-5" />
              </motion.span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: 'auto' }}
                  exit={{ height: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="px-6 pb-6 pt-0 text-xs md:text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed border-t border-border/40">
                    {item.content}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default Accordion;
