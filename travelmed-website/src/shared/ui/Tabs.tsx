'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

interface TabOption {
  id: string;
  label: string;
  icon?: React.ReactNode;
}

interface TabsProps {
  options: TabOption[];
  activeId: string;
  onChange: (id: string) => void;
  className?: string;
  tabClassName?: string;
}

export const Tabs: React.FC<TabsProps> = ({
  options,
  activeId,
  onChange,
  className,
  tabClassName
}) => {
  return (
    <div className={cn("inline-flex p-1 bg-neutral-100 dark:bg-neutral-800/80 rounded-full border border-border/40 select-none", className)}>
      {options.map((option) => {
        const isActive = option.id === activeId;
        
        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              "relative z-1 flex items-center gap-1.5 px-4 py-2 text-xs md:text-sm font-semibold rounded-full cursor-pointer focus:outline-none transition-colors duration-200",
              isActive 
                ? "text-primary dark:text-white" 
                : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200",
              tabClassName
            )}
          >
            {option.icon && <span className="shrink-0">{option.icon}</span>}
            <span>{option.label}</span>
            {isActive && (
              <motion.div
                layoutId="active-tab-bubble"
                className="absolute inset-0 -z-1 bg-white dark:bg-neutral-900 rounded-full shadow-sm"
                transition={{ type: 'spring', damping: 20, stiffness: 280 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default Tabs;
