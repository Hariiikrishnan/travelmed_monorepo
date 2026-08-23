import React from 'react';

export const TrustedBy: React.FC = () => {
  const partners = [
    'Allianz Global Assistance',
    'AXA Partners',
    'Berkshire Hathaway Travel Protection',
    'World Nomads',
    'World Health Organization Partner',
    'Lloyd\'s Medical Insurance',
    'Global Emergency Response Net'
  ];

  // Duplicate the array to ensure continuous flow in marquee
  const doublePartners = [...partners, ...partners];

  return (
    <section className="py-10 bg-white dark:bg-neutral-900 border-y border-border overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto px-4 mb-4 text-center">
        <span className="text-[10px] md:text-xs font-bold text-neutral-400 uppercase tracking-widest">
          Endorsed by Premier Travel Insurance & Health Organizations
        </span>
      </div>
      
      {/* Sliding Marquee Wrapper */}
      <div className="relative w-full flex items-center overflow-hidden">
        {/* Shadow overlays for smooth fading edges */}
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-neutral-900 to-transparent z-1" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-neutral-900 to-transparent z-1" />

        <div className="flex animate-marquee whitespace-nowrap gap-16 py-2">
          {doublePartners.map((partner, index) => (
            <div
              key={index}
              className="text-sm md:text-base font-extrabold tracking-tight text-neutral-400 dark:text-neutral-500 hover:text-primary dark:hover:text-white transition duration-300 select-none"
            >
              {partner}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
