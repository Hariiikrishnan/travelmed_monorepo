import React from 'react';
import { cn } from '@/shared/utils/cn';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'warning' | 'neutral';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  className,
  variant = 'primary',
  ...props
}) => {
  const styles = {
    primary: "bg-primary-light text-primary border-primary/10",
    secondary: "bg-secondary-light text-secondary-dark border-secondary/10",
    accent: "bg-accent-light text-accent-dark border-accent/10",
    warning: "bg-warning-light text-warning-dark border-warning/10",
    neutral: "bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:border-neutral-700"
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-3 py-1 text-xs font-semibold rounded-full border tracking-wide select-none",
        styles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
