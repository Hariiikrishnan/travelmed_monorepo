'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface CarouselProps {
  children: React.ReactNode[];
  className?: string;
  slideClassName?: string;
  showArrows?: boolean;
  showDots?: boolean;
  loop?: boolean;
}

export const Carousel: React.FC<CarouselProps> = ({
  children,
  className,
  slideClassName,
  showArrows = true,
  showDots = true,
  loop = true
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop, align: 'start' });
  const [prevBtnEnabled, setPrevBtnEnabled] = useState(false);
  const [nextBtnEnabled, setNextBtnEnabled] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);
  const scrollTo = useCallback((index: number) => emblaApi && emblaApi.scrollTo(index), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    setPrevBtnEnabled(emblaApi.canScrollPrev());
    setNextBtnEnabled(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
  }, [emblaApi, onSelect]);

  return (
    <div className={cn("relative w-full overflow-hidden", className)}>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4">
          {children.map((child, idx) => (
            <div
              key={idx}
              className={cn("flex-none shrink-0", slideClassName)}
              style={{ minWidth: '0' }}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      {showArrows && children.length > 1 && (
        <div className="flex items-center gap-2 mt-6 justify-end">
          <button
            onClick={scrollPrev}
            disabled={!prevBtnEnabled}
            className="flex items-center justify-center w-10 h-10 border border-border rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed select-none cursor-pointer transition"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            disabled={!nextBtnEnabled}
            className="flex items-center justify-center w-10 h-10 border border-border rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800 disabled:opacity-30 disabled:cursor-not-allowed select-none cursor-pointer transition"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Dots Indicator */}
      {showDots && children.length > 1 && (
        <div className="flex justify-center items-center gap-1.5 mt-4">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={cn(
                "w-2 h-2 rounded-full cursor-pointer transition-all duration-300",
                index === selectedIndex
                  ? "bg-primary w-5"
                  : "bg-neutral-300 dark:bg-neutral-700 hover:bg-neutral-400"
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
