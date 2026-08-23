'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { buttonPress, buttonHover } from '@/shared/animations';
import { cn } from '@/shared/utils/cn';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'outline' | 'glass' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  ...props
}) => {
  const baseStyle = "inline-flex items-center justify-center font-sans font-semibold rounded-button transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/20 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none";
  
  const variants = {
    primary: "bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-hover shadow-primary/10",
    secondary: "bg-secondary text-white hover:bg-secondary-dark shadow-sm hover:shadow-hover shadow-secondary/10",
    accent: "bg-accent-green text-white hover:bg-accent-green-dark shadow-sm hover:shadow-hover shadow-accent-green/10",
    outline: "border border-border bg-transparent text-heading hover:bg-neutral-50 dark:hover:bg-neutral-800",
    glass: "glass text-heading hover:bg-white/80 dark:hover:bg-white/10 border border-white/20",
    ghost: "bg-transparent text-heading hover:bg-neutral-100 dark:hover:bg-neutral-800"
  };

  const sizes = {
    sm: "text-xs px-4 py-2.5 gap-1.5",
    md: "text-sm px-6 py-3.5 gap-2",
    lg: "text-base px-8 py-4.5 gap-2.5"
  };

  return (
    <motion.button
      whileHover={buttonHover}
      whileTap={buttonPress}
      className={cn(
        baseStyle,
        variants[variant],
        sizes[size],
        fullWidth && "w-full",
        className
      )}
      {...(props as any)}
    >
      {children}
    </motion.button>
  );
};

export default Button;
