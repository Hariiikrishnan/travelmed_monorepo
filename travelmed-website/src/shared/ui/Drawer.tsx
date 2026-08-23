'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  className?: string;
  position?: 'right' | 'left';
  size?: 'sm' | 'md' | 'lg';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
  position = 'right',
  size = 'md'
}) => {
  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Escape key support
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const sizes = {
    sm: "max-w-[360px]",
    md: "max-w-[480px]",
    lg: "max-w-[640px]"
  };

  const slideVariants = {
    left: {
      hidden: { x: '-100%' },
      visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 220 } },
      exit: { x: '-100%', transition: { duration: 0.3, ease: 'easeInOut' } }
    },
    right: {
      hidden: { x: '100%' },
      visible: { x: 0, transition: { type: 'spring', damping: 25, stiffness: 220 } },
      exit: { x: '100%', transition: { duration: 0.3, ease: 'easeInOut' } }
    }
  } as const;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-modal overflow-hidden">
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs cursor-pointer"
          />

          {/* Drawer container wrapper */}
          <div className={cn("fixed inset-y-0 flex max-w-full", position === 'right' ? 'right-0' : 'left-0')}>
            <motion.div
              variants={slideVariants[position]}
              initial="hidden"
              animate="visible"
              exit="exit"
              className={cn(
                "w-screen bg-card text-card-foreground border-l border-border shadow-2xl flex flex-col h-full",
                sizes[size],
                className
              )}
            >
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-5 border-b border-border">
                {title && <h3 className="text-lg font-bold tracking-tight">{title}</h3>}
                <button
                  onClick={onClose}
                  className="rounded-full p-1.5 text-neutral-400 hover:text-foreground hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors select-none cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {/* Scrollable Body */}
              <div className="flex-1 overflow-y-auto p-6">
                {children}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default Drawer;
