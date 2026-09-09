'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Globe } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  code?: string;
  flag?: string;
}

interface CustomSelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  className?: string;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  options,
  value,
  onChange,
  label,
  placeholder = 'Select option...',
  className = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value) || options[0];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`relative space-y-1.5 select-none ${isOpen ? 'z-[100]' : 'z-10'} ${className}`}>
      {label && (
        <label className="text-xs font-extrabold text-slate-700 dark:text-neutral-300 uppercase tracking-wide flex items-center gap-1.5">
          <Globe className="h-3.5 w-3.5 text-primary" /> {label}
        </label>
      )}

      {/* Select Trigger Box */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 bg-slate-50/80 dark:bg-neutral-950 border text-sm font-semibold rounded-2xl flex items-center justify-between transition-all duration-200 cursor-pointer ${
          isOpen
            ? 'border-primary ring-2 ring-primary/20 bg-white dark:bg-neutral-900 shadow-sm'
            : 'border-slate-200 dark:border-neutral-800 hover:border-slate-300 text-slate-900 dark:text-white'
        }`}
      >
        <span className="flex items-center gap-2.5 truncate">
          {selectedOption?.code ? (
            <span className="inline-flex items-center justify-center min-w-[26px] h-5 px-1.5 rounded-md bg-teal-50 dark:bg-teal-950/50 border border-teal-100 dark:border-teal-900/60 text-[10.5px] font-black text-primary font-mono uppercase shrink-0">
              {selectedOption.code}
            </span>
          ) : selectedOption?.flag ? (
            <span className="text-base leading-none shrink-0">{selectedOption.flag}</span>
          ) : null}
          <span className="truncate">{selectedOption?.label || placeholder}</span>
        </span>

        <ChevronDown
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 shrink-0 ${
            isOpen ? 'rotate-180 text-primary' : ''
          }`}
        />
      </button>

      {/* Floating Animated Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: 'easeOut' }}
            className="absolute left-0 right-0 top-full mt-1.5 z-[9999] bg-white dark:bg-neutral-900 border border-slate-200/90 dark:border-neutral-800 rounded-2xl shadow-[0_20px_50px_rgba(15,23,42,0.22)] p-1.5 max-h-60 overflow-y-auto"
          >
            {options.map((option) => {
              const isSelected = option.value === value;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-between transition-all duration-150 cursor-pointer ${
                    isSelected
                      ? 'bg-primary/10 text-primary font-bold'
                      : 'text-slate-700 dark:text-neutral-200 hover:bg-slate-100 dark:hover:bg-neutral-800'
                  }`}
                >
                  <span className="flex items-center gap-2.5 truncate">
                    {option.code ? (
                      <span className={`inline-flex items-center justify-center min-w-[26px] h-5 px-1.5 rounded-md text-[10.5px] font-black font-mono uppercase shrink-0 ${
                        isSelected 
                          ? 'bg-primary text-white' 
                          : 'bg-slate-100 dark:bg-neutral-800 text-slate-600 dark:text-neutral-400'
                      }`}>
                        {option.code}
                      </span>
                    ) : option.flag ? (
                      <span className="text-base leading-none shrink-0">{option.flag}</span>
                    ) : null}
                    <span>{option.label}</span>
                  </span>

                  {isSelected && <Check className="h-4 w-4 text-primary shrink-0" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CustomSelect;
