import * as React from "react";
import { cn } from "@/shared/utils/cn";
import { ArrowRight } from "lucide-react";

// Define the props for the DestinationCard component
export interface DestinationCardProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  location: string;
  flag?: string;
  stats?: string;
  tagline?: string;
  href?: string;
  themeColor: string; // e.g., "150 50% 25%" for a deep green
  buttonText?: string;
}

const DestinationCard = React.forwardRef<HTMLDivElement, DestinationCardProps>(
  ({ className, imageUrl, location, flag, stats, tagline, href = "#", themeColor, buttonText = "Explore Now", ...props }, ref) => {
    return (
      // The 'group' class enables hover effects on child elements
      <div
        ref={ref}
        style={{
          "--theme-color": themeColor,
        } as React.CSSProperties}
        className={cn("group w-full h-full min-h-[260px] sm:min-h-[280px]", className)}
        {...props}
      >
        <a
          href={href}
          className="relative block w-full h-full rounded-2xl sm:rounded-3xl overflow-hidden shadow-md 
                     transition-all duration-500 ease-in-out 
                     group-hover:scale-[1.02] group-hover:shadow-[0_0_50px_-12px_hsl(var(--theme-color)/0.6)]"
          aria-label={`Explore details for ${location}`}
          style={{
             boxShadow: `0 0 30px -12px hsl(var(--theme-color) / 0.4)`
          }}
        >
          {/* Background Image with Parallax Zoom */}
          <div
            className="absolute inset-0 bg-cover bg-center 
                       transition-transform duration-700 ease-out group-hover:scale-110"
            style={{ backgroundImage: `url(${imageUrl})` }}
          />

          {/* Themed Gradient Overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, hsl(var(--theme-color) / 0.95), hsl(var(--theme-color) / 0.6) 40%, transparent 75%)`,
            }}
          />
          
          {/* Content */}
          <div className="relative z-10 flex flex-col justify-end h-full p-4 sm:p-5 text-white space-y-1">
            <span className="block text-xl sm:text-2xl font-black tracking-tight font-heading flex items-center gap-2 drop-shadow-md" style={{ color: '#ffffff' }}>
              {location} {flag && <span className="text-lg sm:text-xl">{flag}</span>}
            </span>
            
            {stats && <p className="text-xs text-white/90 font-bold leading-tight drop-shadow-xs">{stats}</p>}
            {tagline && <p className="text-[11px] text-white/75 font-medium leading-tight">{tagline}</p>}

            {/* Explore Button */}
            <div className="mt-2.5 flex items-center justify-between bg-[hsl(var(--theme-color)/0.3)] backdrop-blur-md border border-[hsl(var(--theme-color)/0.4)] 
                           rounded-xl px-3 py-2 
                           transition-all duration-300 
                           group-hover:bg-[hsl(var(--theme-color)/0.5)] group-hover:border-[hsl(var(--theme-color)/0.7)]">
              <span className="text-[10.5px] font-black tracking-wider uppercase">{buttonText}</span>
              <ArrowRight className="h-3.5 w-3.5 transform transition-transform duration-300 group-hover:translate-x-1" />
            </div>
          </div>
        </a>
      </div>
    );
  }
);
DestinationCard.displayName = "DestinationCard";

export { DestinationCard };
