import type { Metadata } from 'next';
import { JsonLd, buildFaqSchema, buildBreadcrumbSchema } from '@/shared/seo/StructuredData';

export const metadata: Metadata = {
  title: 'Travel Health FAQ & Compliance Guide | TravelMed',
  description: 'Frequently asked questions regarding travel medical kits, airport security & customs compliance, TSA doctor prescriptions, CDSCO/WHO approval, and 24/7 teleconsultation.',
  keywords: [
    'best travel medical kit',
    'travel medicine kit',
    'international travel first aid kit',
    'prescription travel medical kit',
    'travel health pouch with doctor prescription',
    'family travel medical kit',
    'TSA approved travel medicine kit',
    'bali belly medicine kit',
    'altitude sickness pills travel',
    'southeast asia travel medicine list',
    'travel medicine for europe trip',
    'medicines to take to thailand',
    'traveler diarrhea kit',
    'online doctor consultation while traveling',
    'telehealth for international travelers',
    'get doctor prescription abroad online',
    '24/7 video doctor travel emergency',
    'travel clinic online video call',
    'WHO GMP approved travel medical kit',
    'CDSCO DCGI approved travel prescription',
    'taking prescription medicines through airport customs',
    'customs friendly travel medicine pouch'
  ],
  openGraph: {
    title: 'Travel Health FAQ & Compliance Guide | TravelMed',
    description: 'Get verified answers on airport customs compliance, doctor prescriptions, and emergency travel health advice.',
    url: 'https://travelmed.org/faq',
  },
};

const faqEntities = [
  {
    title: 'What medications should I pack for a 2-week trip to Bali or Thailand?',
    contentText: 'TravelMed Complete Kit provides 150+ prescription & OTC remedies specifically formulated for travel to Bali, Thailand, and Southeast Asia. Includes Compartment A GI distress & Bali Belly treatments (Ciprofloxacin, Ondansetron), altitude sickness pills, fever, pain, allergies, and 24/7 video doctor access.'
  },
  {
    title: 'How do I carry prescription medications through international airport security?',
    contentText: 'Every TravelMed kit comes with an official signed doctor prescription matching all 150+ medications inside, formatted to meet TSA, IATA, and international customs border verification standards.'
  },
  {
    title: 'Can I consult a licensed doctor online while traveling in Europe or Asia?',
    contentText: 'Yes. TravelMed provides instant 24/7 video teleconsultation with board-certified physicians anywhere in the world. Connect in under 3 minutes by scanning the QR code inside your TravelMed pouch lid or through your online dashboard.'
  },
  {
    title: 'Are TravelMed kits approved by WHO, GMP, CDSCO, and DCGI?',
    contentText: 'Yes. Every TravelMed kit is manufactured in WHO-GMP certified facilities, compliant with CDSCO and DCGI regulatory standards, and includes an official signed doctor prescription.'
  },
  {
    title: 'What medical conditions are covered in the TravelMed pouch?',
    contentText: 'The kit features 150+ remedies categorized across 4 triage compartments covering GI distress (Bali Belly), altitude sickness, fever/pain, severe allergies, asthma, and wound care.'
  }
];

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  const faqSchema = buildFaqSchema(faqEntities);
  const breadcrumb = buildBreadcrumbSchema([
    { name: 'Home', url: 'https://travelmed.org' },
    { name: 'FAQ & Help Desk', url: 'https://travelmed.org/faq' }
  ]);

  return (
    <>
      <JsonLd data={faqSchema} />
      <JsonLd data={breadcrumb} />
      {children}
    </>
  );
}
