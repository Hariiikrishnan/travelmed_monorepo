import React from 'react';
import { Pill } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

/** Built-in icon files for category names (used when the admin hasn't set an icon). */
const IMAGE_ICONS: Record<string, string> = {
  Antacids: '/icons/Antacids.webp',
  'Antimotility Drugs': '/icons/Antimotility Drugs.webp',
  'Cough Suppressant': '/icons/cough.webp',
  Respiratory: '/icons/cough.webp',
  Antibiotic: '/icons/antibiotic.webp',
  'Anti-Infectives': '/icons/antibiotic.webp',
  Antihistamine: '/icons/antihistamines.webp',
  Allergies: '/icons/antihistamines.webp',
  'Motion Sickness Tablets': '/icons/Motion Sickness Tablets.webp',
  'Antipyretic (Fever)': '/icons/Antipyretic.svg',
  Antipyretic: '/icons/Antipyretic.svg',
  'Anti Cold': '/icons/Anticold.webp',
  'Sore Throat Lozenges': '/icons/sore-throat.webp',
  'Pre & Probiotics': '/icons/probiotics.webp',
  Digestion: '/icons/probiotics.webp',
  'Bandages & Plasters': '/icons/bandage.webp',
  Bandages: '/icons/bandage.webp',
  'Bandages and Plasters': '/icons/bandage.webp',
  'Wound Care': '/icons/bandage.webp',
  'First Aid Cotton': '/icons/bandage.webp',
  'First Aid Essentials': '/icons/bandage.webp',
  'First Aid': '/icons/bandage.webp',
};

/** Hand-drawn outline icons for categories that have no image file. */
function SvgIcon({ name, className }: { name: string; className: string }) {
  const svg = (children: React.ReactNode) => (
    <svg className={className} viewBox="0 0 24 24" fill="none" strokeWidth="1.5" stroke="currentColor" aria-hidden>
      {children}
    </svg>
  );
  switch (name) {
    case 'Pain Killers & Analgesics':
    case 'Pain Relief':
      return svg(
        <>
          <rect x="5" y="11" width="6" height="11" rx="3" transform="rotate(-45 5 11)" strokeLinecap="round" />
          <path d="M7.12 12.12L11.36 7.88" stroke="#14B8A6" />
          <circle cx="16" cy="15" r="5" strokeLinecap="round" />
          <line x1="13.5" y1="12.5" x2="18.5" y2="17.5" stroke="#14B8A6" />
        </>
      );
    case 'Laxative Stimulant':
    case 'Laxative Stimulant for Constipation':
      return svg(
        <>
          <path d="M12 3V6" strokeLinecap="round" />
          <path d="M8 8H16" strokeLinecap="round" />
          <path d="M9 8V18C9 19.1 9.9 20 11 20H13C14.1 20 15 19.1 15 18V8" strokeLinecap="round" />
          <path d="M12 11C12 11 10.5 13 10.5 14C10.5 14.83 11.17 15.5 12 15.5C12.83 15.5 13.5 14.83 13.5 14C13.5 13 12 11 12 11Z" fill="#14B8A6" stroke="#14B8A6" />
        </>
      );
    case 'Antispasmodics':
      return svg(
        <>
          <circle cx="12" cy="12" r="8" strokeLinecap="round" />
          <path d="M12 8A4 4 0 0 1 12 16A4 4 0 0 1 12 8" stroke="#14B8A6" strokeLinecap="round" />
          <circle cx="12" cy="12" r="1.5" fill="#14B8A6" />
        </>
      );
    case 'ORS Salts':
      return svg(
        <>
          <rect x="5" y="5" width="8" height="12" rx="1" transform="rotate(-15 5 5)" />
          <path d="M11 14L16 19C16.6 19.6 17.4 20 18.2 20H19.5" stroke="#14B8A6" strokeLinecap="round" />
          <circle cx="16" cy="10" r="1.5" fill="#14B8A6" />
        </>
      );
    case 'Antiemetic':
      return svg(
        <>
          <circle cx="12" cy="12" r="9" />
          <path d="M8 12C8 9.79 9.79 8 12 8C14.21 8 16 9.79 16 12C16 14.21 14.21 16 12 16" stroke="#14B8A6" strokeLinecap="round" />
        </>
      );
    default:
      return <Pill className={cn(className, 'text-primary')} aria-hidden />;
  }
}

/**
 * Icon for a medicine category. Uses the admin-set icon when present, otherwise the
 * built-in icon for that category name, otherwise a generic pill.
 */
export function CategoryIcon({ name, icon, className = 'w-10 h-10' }: { name: string; icon?: string | null; className?: string }) {
  const src = icon || IMAGE_ICONS[name];
  if (src) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt="" className={cn(className, 'object-contain')} />;
  }
  return <SvgIcon name={name} className={className} />;
}

export default CategoryIcon;
