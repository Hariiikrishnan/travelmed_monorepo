'use client';

import React, { useState } from 'react';
import { cn } from '@/shared/utils/cn';

interface AvatarProps {
  src?: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  className?: string;
}

const sizes = {
  sm: 'w-8 h-8 text-xs',
  md: 'w-12 h-12 text-sm',
  lg: 'w-16 h-16 text-base',
  xl: 'w-24 h-24 text-xl',
  '2xl': 'w-32 h-32 text-3xl',
};

const getInitials = (name: string) =>
  name
    .replace(/^dr\.?\s+/i, '')
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

/** Photo with an initials fallback when there is no image or it fails to load (e.g. a blocked host). */
export const Avatar: React.FC<AvatarProps> = ({ src, alt, size = 'md', className }) => {
  const [failedSrc, setFailedSrc] = useState<string | null>(null);
  const showImage = Boolean(src) && failedSrc !== src;

  return (
    <div
      className={cn(
        'relative flex shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-gradient-to-br from-primary/10 to-secondary/15',
        sizes[size],
        className
      )}
    >
      {showImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className="h-full w-full object-cover" onError={() => setFailedSrc(src ?? null)} />
      ) : (
        <span aria-label={alt} role="img" className="font-heading font-bold text-primary select-none">
          {getInitials(alt)}
        </span>
      )}
    </div>
  );
};

export default Avatar;
