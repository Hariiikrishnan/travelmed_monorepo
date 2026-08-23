'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cardReveal } from '@/shared/animations';
import { cn } from '@/shared/utils/cn';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glass?: boolean;
  animate?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  hoverEffect = true,
  glass = false,
  animate = false,
  ...props
}) => {
  const baseStyle = cn(
    "bg-card text-card-foreground rounded-card border border-border shadow-card overflow-hidden",
    glass && "glass",
    hoverEffect && "transition-all duration-300 hover:shadow-hover hover:border-primary/20 hover:-translate-y-1"
  );

  if (animate) {
    return (
      <motion.div
        variants={cardReveal}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-20px' }}
        className={cn(baseStyle, className)}
        {...(props as any)}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn(baseStyle, className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
