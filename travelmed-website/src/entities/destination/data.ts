import type { Article } from '@/entities/guide/types';

export interface Destination extends Article {
  /** Short display name, e.g. "Thailand" */
  name: string;
}

/**
 * Destination landing pages targeting "medicines to carry for <country> trip from India".
 * NOTE: medicine-import rules change — re-verify sources at least every 6 months.
 */
export const DESTINATIONS: Destination[] = [
  {
    slug: 'thailand',
    name: 'Thailand',
    title: 'Medicines to carry for a Thailand trip from India',
    metaTitle: 'Medicines to Carry for Thailand Trip from India',
    description:
      'Going to Bangkok, Phuket or Krabi? A doctor’s list of medicines to carry for Thailand from India, plus Thai rules on bringing medicines and tips to avoid stomach bugs.',
    keyword: 'medicines to carry for Thailand trip from India',
    eyebrow: 'Destination guide · Thailand',
    image: '/scenarios/thailand.webp',
    quickAnswer:
      'For Thailand, pack ORS, an antidiarrhoeal, antacid and probiotic for street food, paracetamol for fever, an antihistamine for bites and allergies, motion sickness tablets for ferries, plus plasters and antiseptic. Thailand allows psychotropic medicines up to 30 days with a prescription; narcotic medicines need a Thai FDA permit.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Common health issues for Indian travellers in Thailand',
        bullets: [
          'Stomach upsets from street food, seafood and ice.',
          'Dehydration and heat exhaustion in humid weather.',
          'Motion sickness on ferries and speedboats to the islands.',
          'Insect bites, sunburn and coral or rock scrapes on beaches.',
        ],
      },
      {
        heading: 'Medicine checklist for Thailand',
        table: {
          head: ['Category', 'Why you need it in Thailand'],
          rows: [
            ['ORS, antimotility, probiotic', 'Street food and heat raise the risk of loose motions and dehydration'],
            ['Antacid', 'Spicy and unfamiliar food'],
            ['Paracetamol / pain reliever', 'Fever, headache after long travel days'],
            ['Antihistamine', 'Insect bites, seafood or pollen allergies'],
            ['Motion sickness tablets', 'Ferries to Phi Phi, Koh Samui and Krabi'],
            ['Plasters, cotton, antiseptic', 'Cuts from rocks, coral and sandals'],
          ],
        },
      },
      {
        heading: 'Thai rules on bringing medicines',
        paragraphs: [
          'Ordinary medicines for personal use are generally fine. Medicines containing psychotropic substances are allowed up to a 30-day supply with a prescription or medical certificate. Medicines containing narcotic drugs (such as some strong painkillers) need a permit from the Thai FDA, applied for online at least 15 days before travel.',
        ],
      },
      {
        heading: 'Tips to stay healthy',
        bullets: [
          'Drink sealed bottled water; be cautious with ice at street stalls.',
          'Eat at busy stalls where food is cooked fresh and hot.',
          'Use sunscreen and insect repellent, especially in the evening.',
        ],
      },
    ],
    faqs: [
      { q: 'Can I carry medicines from India to Thailand?', a: 'Yes. Ordinary medicines for personal use are allowed. Psychotropic medicines are limited to 30 days’ supply with a prescription, and narcotic medicines need a Thai FDA permit.' },
      { q: 'What is the most common illness for tourists in Thailand?', a: 'Traveller’s diarrhoea from food or water. Carry ORS and an antidiarrhoeal, and drink sealed bottled water.' },
    ],
    sources: [
      { label: 'Thai FDA — Guidance for travellers carrying medicines', url: 'https://en.fda.moph.go.th/entrepreneurs-narcotic-drugs-and-psychotropic-substances/category/guidance-for-travelers-under-treatment-carrying-personal-medications-containing-narcotic-drugs-into-/' },
      { label: 'CDC — Thailand traveller health', url: 'https://wwwnc.cdc.gov/travel/destinations/traveler/none/thailand' },
    ],
    relatedGuides: ['food-poisoning-abroad-what-to-do', 'medicines-to-carry-abroad-from-india'],
    relatedDestinations: ['singapore', 'dubai-uae'],
  },
  {
    slug: 'dubai-uae',
    name: 'Dubai & UAE',
    title: 'Medicines to carry for a Dubai trip from India',
    metaTitle: 'Medicines to Carry for Dubai Trip from India',
    description:
      'Travelling to Dubai or Abu Dhabi? What medicines to carry from India, UAE rules for controlled medicines, and how to handle heat and stomach issues.',
    keyword: 'medicines allowed in Dubai from India',
    eyebrow: 'Destination guide · UAE',
    image: '/herobg3.webp',
    quickAnswer:
      'For Dubai, pack ORS for the heat, paracetamol, an antihistamine for dust allergies, antacids, antidiarrhoeals and basic first aid. Carry prescriptions for all prescription medicines. Narcotic and psychotropic medicines are controlled in the UAE: up to 3 months’ supply with a recent prescription, and MOHAP pre-approval is recommended.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Health issues to prepare for in the UAE',
        bullets: [
          'Heat exhaustion and dehydration — summer temperatures often exceed 40 °C.',
          'Dust and sand allergies, dry eyes and sore throat from air-conditioning.',
          'Stomach upsets from rich buffet and street food.',
        ],
      },
      {
        heading: 'Medicine checklist for Dubai',
        table: {
          head: ['Category', 'Why you need it in the UAE'],
          rows: [
            ['ORS', 'Heat and sweating cause rapid dehydration'],
            ['Antihistamine', 'Dust, sand and pollen allergies'],
            ['Lozenges & cough suppressant', 'Dry air-conditioned air'],
            ['Antacid, antimotility', 'Rich food and buffets'],
            ['Paracetamol', 'Headaches from heat and fever'],
          ],
        },
      },
      {
        heading: 'UAE rules on bringing medicines',
        paragraphs: [
          'The UAE strictly controls narcotic and psychotropic medicines, including some strong painkillers, codeine products, sleeping pills and anxiety medicines. Visitors may bring them for personal use up to a 3-month supply with a prescription issued within the last three months that shows the patient’s name, medicine, dose and duration. Pre-approval through the Ministry of Health and Prevention (MOHAP) e-service is optional but makes entry smoother.',
        ],
        callout: {
          tone: 'warning',
          title: 'Check before you fly',
          text: 'Always verify controlled medicines against the official MOHAP list — carrying one without documents can lead to serious legal problems.',
        },
      },
    ],
    faqs: [
      { q: 'Which medicines are not allowed in Dubai?', a: 'Many narcotic and psychotropic medicines (such as codeine, tramadol and some sleeping or anxiety medicines) are controlled. They need a recent prescription and are limited to a 3-month supply; check the MOHAP list before travelling.' },
      { q: 'Do I need a prescription for paracetamol in Dubai?', a: 'No. Ordinary over-the-counter medicines like paracetamol and antacids for personal use do not need special approval, but keep them in original packaging.' },
    ],
    sources: [
      { label: 'UAE MOHAP — Permit to import medicines for personal use', url: 'https://mohap.gov.ae/en/w/issue-of-permit-to-import-medicines-for-personal-use' },
    ],
    relatedGuides: ['medicines-banned-abroad-for-indian-travellers', 'carrying-medicines-on-international-flights'],
    relatedDestinations: ['umrah-hajj', 'singapore'],
  },
  {
    slug: 'singapore',
    name: 'Singapore',
    title: 'Medicines to carry for a Singapore trip from India',
    metaTitle: 'Medicines to Carry for Singapore Trip from India',
    description:
      'Planning a Singapore holiday? Medicines to carry from India, Singapore HSA rules on personal medicines and controlled drugs, and tips for humid weather.',
    keyword: 'medicines to carry for Singapore trip',
    eyebrow: 'Destination guide · Singapore',
    image: '/scenarios/airport.webp',
    quickAnswer:
      'For Singapore, pack ORS, paracetamol, an antihistamine, antacids, motion sickness tablets and basic first aid. You can bring up to 3 months’ supply of personal medicines without approval, as long as they do not contain controlled substances. Medicines with controlled substances need HSA approval at least 2 weeks before arrival.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 4,
    sections: [
      {
        heading: 'What to prepare for',
        bullets: [
          'Hot, humid weather — dehydration and heat rash on long walking days.',
          'Mosquito bites; dengue is present in the region, so use repellent.',
          'Long theme-park days: blisters, headaches and motion sickness on rides.',
        ],
      },
      {
        heading: 'Singapore rules on personal medicines',
        bullets: [
          'Up to 3 months’ supply is allowed without prior approval if it is prescribed for you or an immediate family member and contains no controlled or prohibited substances.',
          'Medicines containing controlled substances need approval from the Health Sciences Authority (HSA) — apply at least 2 weeks before arrival.',
          'Carry a copy of your prescription or doctor’s letter and keep medicines in original, labelled packaging.',
        ],
      },
      {
        heading: 'Medicine checklist for Singapore',
        table: {
          head: ['Category', 'Why'],
          rows: [
            ['ORS', 'Heat and humidity'],
            ['Antihistamine', 'Bites and allergies'],
            ['Motion sickness tablets', 'Rides, cable cars and ferries'],
            ['Plasters & blister care', 'Long walking days'],
            ['Paracetamol', 'Fever and headaches'],
          ],
        },
      },
    ],
    faqs: [
      { q: 'Can I bring medicines from India to Singapore?', a: 'Yes, up to 3 months’ supply of personal medicines without approval if they contain no controlled substances. Controlled medicines need HSA approval before travel.' },
      { q: 'Do I need to declare medicines in Singapore?', a: 'Ordinary personal medicines do not need approval, but carry prescriptions. Medicines with controlled substances must be approved by HSA in advance.' },
    ],
    sources: [
      { label: 'HSA Singapore — Travelling with medications', url: 'https://www.hsa.gov.sg/travelling-with-medication-and-medical-devices/personal-medications/' },
    ],
    relatedGuides: ['carrying-medicines-on-international-flights', 'medicines-to-carry-abroad-from-india'],
    relatedDestinations: ['thailand', 'japan'],
  },
  {
    slug: 'europe',
    name: 'Europe',
    title: 'Medicines to carry for a Europe trip from India',
    metaTitle: 'Medicines to Carry for Europe Trip from India',
    description:
      'Heading to Europe? Medicines to carry from India for cold weather, long walks and rich food, plus Schengen rules for prescription and controlled medicines.',
    keyword: 'medicines to carry for Europe trip from India',
    eyebrow: 'Destination guide · Europe',
    image: '/scenarios/europe.webp',
    quickAnswer:
      'For Europe, pack cold and sore-throat relief, paracetamol, an antihistamine, antacids for rich food, antidiarrhoeals, ORS and blister care for long walks. Carry prescriptions for all prescription medicines. Narcotic or psychotropic medicines need a doctor’s certificate; for travel within Schengen countries this is the Article 75 certificate.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Common problems on European trips',
        bullets: [
          'Colds, coughs and sore throats from cold weather and crowded transport.',
          'Blisters and sore legs from 15,000+ steps a day of sightseeing.',
          'Acidity and indigestion from rich, unfamiliar food.',
          'Pharmacies need prescriptions for many medicines and may close early on Sundays.',
        ],
      },
      {
        heading: 'Medicine checklist for Europe',
        table: {
          head: ['Category', 'Why you need it in Europe'],
          rows: [
            ['Anti-cold, cough suppressant, lozenges', 'Cold weather and weather changes'],
            ['Paracetamol / pain reliever', 'Fever, headache and leg pain'],
            ['Antacid', 'Cheese, cream and rich food'],
            ['Plasters & blister care', 'Long walking days'],
            ['Antihistamine', 'Spring pollen season'],
          ],
        },
      },
      {
        heading: 'Rules for carrying medicines into Europe',
        paragraphs: [
          'Carry prescriptions for prescription medicines and keep them in original packaging. For narcotic or psychotropic medicines, carry a multilingual certificate from your doctor listing the active ingredient, daily dose and trip duration. Within the Schengen area, travellers use the Article 75 Schengen certificate, valid for up to 30 days.',
        ],
      },
    ],
    faqs: [
      { q: 'Can I buy medicines easily in Europe?', a: 'Many medicines that are over the counter in India need a prescription in Europe, and pharmacies may be closed on Sundays, so carry a small kit.' },
      { q: 'Do I need a Schengen certificate for my medicines?', a: 'Only for narcotic or psychotropic medicines. Ordinary medicines just need a prescription for anything prescription-only.' },
    ],
    sources: [
      { label: 'INCB — Information for travellers', url: 'https://www.incb.org/incb/en/travellers/general-information.html' },
      { label: 'German Customs — Medicinal products and narcotics', url: 'https://www.zoll.de/EN/Private-individuals/Travel/Entering-Germany/Restrictions/Medicinal-products-and-narcotics/medicinal-products-and-narcotics_node.html' },
    ],
    relatedGuides: ['medicines-to-carry-abroad-from-india', 'carrying-medicines-on-international-flights'],
    relatedDestinations: ['japan', 'singapore'],
  },
  {
    slug: 'japan',
    name: 'Japan',
    title: 'Medicines to carry for a Japan trip from India',
    metaTitle: 'Medicines Allowed in Japan for Indian Travellers',
    description:
      'Japan bans many common cold medicines. What Indian travellers can carry to Japan, the pseudoephedrine rule, one-month supply limits and a safe checklist.',
    keyword: 'medicines allowed in Japan from India',
    eyebrow: 'Destination guide · Japan',
    image: '/scenarios/mountain.webp',
    quickAnswer:
      'Japan has strict medicine rules. Medicines containing pseudoephedrine or ephedrine — found in many cold and sinus tablets — are prohibited, even with a prescription. Up to a one-month supply of most personal medicines is allowed; larger amounts of some medicines need a Yunyu Kakunin-sho certificate. Check every cold, cough and pain medicine’s ingredients before packing.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 5,
    sections: [
      {
        heading: 'The rule that surprises most travellers',
        callout: {
          tone: 'warning',
          title: 'No pseudoephedrine or ephedrine',
          text: 'Japan’s Stimulants Control Act prohibits medicines containing pseudoephedrine or ephedrine. A prescription does not make them legal. Read the ingredient list on every cold, sinus and allergy tablet before packing.',
        },
      },
      {
        heading: 'Quantity limits',
        bullets: [
          'Up to a one-month supply of most prescription medicines, and up to two months of many over-the-counter medicines, can be brought without paperwork.',
          'Larger quantities, and some psychotropic medicines, need a Yunyu Kakunin-sho import certificate — apply at least two weeks before travel.',
          'Narcotic medicines such as strong opioid painkillers need special permission.',
        ],
      },
      {
        heading: 'Japan-safe checklist',
        table: {
          head: ['Category', 'Notes'],
          rows: [
            ['Paracetamol', 'Widely accepted'],
            ['Antacid, ORS, probiotic', 'Unfamiliar food and long travel days'],
            ['Antihistamine', 'Spring pollen (cedar) season'],
            ['Cold & cough products', 'Only if free of pseudoephedrine, ephedrine and codeine'],
            ['Motion sickness tablets', 'Shinkansen and mountain buses'],
          ],
        },
      },
    ],
    faqs: [
      { q: 'Which medicines are banned in Japan?', a: 'Medicines containing pseudoephedrine or ephedrine (many cold and sinus tablets), stimulant ADHD medicines and some codeine products are prohibited or restricted. Check the official list before travel.' },
      { q: 'How much medicine can I bring to Japan?', a: 'Generally up to a one-month supply of prescription medicines without paperwork. More than that, or certain controlled medicines, needs a Yunyu Kakunin-sho certificate.' },
    ],
    sources: [
      { label: 'U.S. Embassy Japan — Importing medication', url: 'https://jp.usembassy.gov/services/importing-medication/' },
    ],
    relatedGuides: ['medicines-banned-abroad-for-indian-travellers', 'carrying-medicines-on-international-flights'],
    relatedDestinations: ['singapore', 'europe'],
  },
  {
    slug: 'umrah-hajj',
    name: 'Umrah & Hajj',
    title: 'Medicine kit for Umrah & Hajj from India',
    metaTitle: 'Umrah & Hajj Medicine Kit: What to Carry',
    description:
      'A doctor’s list of medicines to carry for Umrah and Hajj from India: heat, dehydration, blisters, cough and stomach care, plus the mandatory ACWY meningitis vaccine.',
    keyword: 'Umrah medicine kit list',
    eyebrow: 'Destination guide · Saudi Arabia',
    image: '/scenarios/family.webp',
    quickAnswer:
      'For Umrah or Hajj, carry ORS for heat and dehydration, paracetamol, cough and sore-throat relief, antihistamines, antacids, antidiarrhoeals and blister care for long walks. All pilgrims aged one year and older must show proof of the quadrivalent (ACWY) meningococcal vaccine, taken at least 10 days before arrival.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Mandatory vaccine',
        callout: {
          tone: 'warning',
          title: 'Meningococcal ACWY vaccine is required',
          text: 'Saudi Arabia requires all Umrah and Hajj pilgrims aged one year and above to show proof of a quadrivalent (ACWY) meningococcal vaccine received at least 10 days before arrival (valid 3–5 years depending on vaccine type).',
        },
      },
      {
        heading: 'Common health problems for pilgrims',
        bullets: [
          'Heat exhaustion and dehydration during Tawaf and Sa’i.',
          'Cough, cold and sore throat (“Hajj cough”) from crowds and air-conditioning.',
          'Blisters and foot pain from long walks.',
          'Stomach upsets from changes in food and water.',
        ],
      },
      {
        heading: 'Umrah medicine checklist',
        table: {
          head: ['Category', 'Why'],
          rows: [
            ['ORS', 'Heat and long rituals cause rapid dehydration'],
            ['Cough suppressant, lozenges, anti-cold', 'Crowded spaces spread respiratory infections'],
            ['Paracetamol / pain reliever', 'Fever, headache and leg pain'],
            ['Plasters & blister care', 'Walking long distances in sandals'],
            ['Antacid, antimotility, probiotic', 'Changes in food and water'],
          ],
        },
      },
      {
        heading: 'Carrying medicines into Saudi Arabia',
        paragraphs: [
          'Carry prescriptions for all prescription medicines in original packaging. Narcotic and psychotropic medicines are strictly controlled and must be supported by a prescription and medical report. Elderly pilgrims should carry enough of their regular medicines for the whole trip plus extra.',
        ],
      },
    ],
    faqs: [
      { q: 'Is the meningitis vaccine compulsory for Umrah?', a: 'Yes. Pilgrims aged one year and above must show proof of the quadrivalent ACWY meningococcal vaccine received at least 10 days before arrival.' },
      { q: 'What medicines should elderly pilgrims carry?', a: 'Their regular prescription medicines for the full trip plus extra, prescriptions, ORS, paracetamol, blister care and cough relief. A doctor’s review before travel is recommended.' },
    ],
    sources: [
      { label: 'CDC — Meningococcal vaccine requirements for Hajj and Umrah', url: 'https://wwwnc.cdc.gov/travel/notices/level1/hajj-umrah-saudi-arabia' },
      { label: 'Saudi MOH — Health requirements for pilgrims', url: 'https://www.moh.gov.sa/HealthAwareness/Pilgrims-Health/Documents/Hajj-Health-Requirements-English-language.pdf' },
    ],
    relatedGuides: ['medicines-to-carry-abroad-from-india', 'food-poisoning-abroad-what-to-do'],
    relatedDestinations: ['dubai-uae'],
  },
];

export const getDestination = (slug: string) => DESTINATIONS.find((d) => d.slug === slug);
