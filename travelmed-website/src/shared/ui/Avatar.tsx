import React from 'react';
import { cn } from '@/shared/utils/cn';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  alt,
  size = 'md',
  className
}) => {
  const sizes = {
    sm: "w-8 h-8 text-xs",
    md: "w-12 h-12 text-sm",
    lg: "w-16 h-16 text-base",
    xl: "w-24 h-24 text-xl"
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <div className={cn("relative flex shrink-0 overflow-hidden rounded-full border border-border bg-neutral-100 dark:bg-neutral-800", sizes[size], className)}>
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={alt}
          className="h-full w-full object-cover"
          onError={(e) => {
            (e.currentTarget as any).style.display = 'none';
          }}
        />
      ) : null}
      <div className="flex h-full w-full items-center justify-center font-semibold text-neutral-500 dark:text-neutral-400 select-none">
        {getInitials(alt)}
      </div>
    </div>
  );
};

export default Avatar;
