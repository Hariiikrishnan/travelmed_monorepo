'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { buttonPress } from '@/shared/animations';
import { cn } from '@/shared/utils/cn';

interface ChipProps extends React.HTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  variant?: 'primary' | 'secondary';
}

export const Chip: React.FC<ChipProps> = ({
  children,
  className,
  active = false,
  variant = 'primary',
  ...props
}) => {
  const activeStyles = {
    primary: "bg-primary text-white border-primary shadow-sm shadow-primary/10",
    secondary: "bg-secondary text-white border-secondary shadow-sm shadow-secondary/10"
  };

  const inactiveStyle = "bg-white dark:bg-neutral-900 border-border text-foreground hover:bg-neutral-50 dark:hover:bg-neutral-800";

  return (
    <motion.button
      whileTap={buttonPress}
      className={cn(
        "inline-flex items-center px-4 py-2 text-xs font-semibold rounded-full border cursor-pointer select-none transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/20",
        active ? activeStyles[variant] : inactiveStyle,
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

export default Chip;
