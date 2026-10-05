import type { BlogPost } from '@/entities/guide/types';

/**
 * High-intent buying & trip-planning posts.
 * NOTE: medically reviewed content — changes need sign-off from the medical director.
 */
export const BUYING_AND_PLANNING_POSTS: BlogPost[] = [
  {
    slug: 'best-travel-medical-kit-india',
    category: 'Buying guides',
    image: '/products.webp',
    featured: true,
    title: 'Best travel medical kit in India: how to choose the right one',
    metaTitle: 'Best Travel Medical Kit in India: Buying Guide',
    description:
      'How to choose the best travel medical kit in India for international trips: the 8 things a doctor checks — medicines covered, prescription, expiry, packaging and support.',
    keyword: 'best travel medical kit India',
    eyebrow: 'Buying guide',
    quickAnswer:
      'The best travel medical kit for international trips covers the common travel ailments (stomach, fever, pain, allergy, motion sickness, cold and first aid), is curated by a doctor, comes with a prescription for customs, has clearly labelled medicines with long expiry, is liquid-free for flights, and gives you access to a doctor if you are unsure what to take.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 7,
    sections: [
      {
        heading: 'Why most “travel first aid kits” fall short abroad',
        paragraphs: [
          'Many kits sold online as travel first aid kits contain mostly bandages, scissors and antiseptic wipes. Those help with cuts, but the problems that actually ruin trips are loose motions, fever, acidity, allergies and motion sickness — and for those you need medicines, dosing guidance and sometimes a doctor.',
        ],
      },
      {
        heading: 'The 8 things to check before you buy',
        table: {
          head: ['What to check', 'What good looks like'],
          rows: [
            ['1. Ailments covered', 'Stomach, fever & pain, allergy, motion sickness, cold & cough, and first aid — not only bandages'],
            ['2. Doctor-curated', 'Medicines chosen and dosed by a qualified doctor for travel'],
            ['3. Prescription included', 'A signed prescription listing the medicines, useful at security or customs'],
            ['4. Regulated medicines', 'CDSCO-regulated medicines from licensed manufacturers'],
            ['5. Expiry', 'Every item has a printed expiry date with long remaining shelf life'],
            ['6. Organisation', 'Clearly labelled, colour-coded compartments and an English dosage guide'],
            ['7. Flight-friendly', 'Liquid-free, blister-packed medicines in a compact, sturdy pouch'],
            ['8. Doctor support', 'A way to speak to a doctor when you are unsure what to take'],
          ],
        },
      },
      {
        heading: 'Your options compared',
        table: {
          head: ['Option', 'Pros', 'Cons'],
          rows: [
            ['Pack your own from a pharmacy', 'Fully customised', 'Takes time; easy to miss categories; no prescription or dosing guide'],
            ['Generic first aid kit', 'Cheap and compact', 'Mostly bandages; few or no medicines'],
            ['Doctor-curated travel medical kit', 'Complete, organised, documented, with doctor support', 'Costs more than a basic first aid kit'],
          ],
        },
      },
      {
        heading: 'Who needs a complete kit most',
        bullets: [
          'Families travelling with elderly parents.',
          'Travellers going to Southeast Asia, the Middle East or long-haul destinations where food and climate change a lot.',
          'Anyone travelling to countries where medicines need a local prescription, such as most of Europe, Japan and Singapore.',
          'Students and professionals moving abroad for months.',
        ],
      },
      {
        heading: 'How TravelMed meets these criteria',
        paragraphs: [
          'TravelMed was created by a doctor for exactly this checklist: 150+ medicines and essentials across 17 categories, a signed prescription, colour-coded compartments with an English dosage guide, liquid-free packaging, and 2 free doctor teleconsultations — for {price} with free shipping across India.',
        ],
      },
    ],
    faqs: [
      { q: 'What should a travel medical kit contain?', a: 'Medicines for stomach upsets (ORS, antidiarrhoeal, antacid, probiotic), fever and pain, allergies, motion sickness, cold and cough, plus first-aid items like bandages, plasters and cotton.' },
      { q: 'Is a first aid kit enough for international travel?', a: 'Usually not. Basic first aid kits focus on cuts and wounds, while most travel illnesses — stomach upsets, fever and allergies — need medicines and dosing guidance.' },
      { q: 'How much does a good travel medical kit cost in India?', a: 'Basic first aid kits are cheaper but contain few medicines. The doctor-curated TravelMed kit costs {price} and includes 150+ medicines, a signed prescription and 2 free doctor consultations.' },
    ],
    sources: [
      { label: 'CDC — Pack smart (travel health kit)', url: 'https://wwwnc.cdc.gov/travel/page/pack-smart' },
    ],
    relatedGuides: ['readymade-vs-diy-travel-medicine-kit', 'medicines-to-carry-abroad-from-india', 'family-travel-medical-kit'],
    relatedDestinations: ['thailand'],
  },
  {
    slug: 'readymade-vs-diy-travel-medicine-kit',
    category: 'Buying guides',
    image: '/pro.webp',
    title: 'Readymade travel medicine kit vs packing your own: which is better?',
    metaTitle: 'Readymade vs DIY Travel Medicine Kit',
    description:
      'Should you buy a readymade travel medicine kit or pack your own? Compare time, cost, coverage, documentation and safety before your international trip.',
    keyword: 'readymade travel medicine kit',
    eyebrow: 'Buying guide',
    quickAnswer:
      'Packing your own kit works if you know exactly which medicines and doses you need and have time to shop. A readymade doctor-curated kit is better if you want complete coverage without research, clear labelling and dosing, a prescription for customs, and access to a doctor while abroad.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 5,
    sections: [
      {
        heading: 'Side-by-side comparison',
        table: {
          head: ['Factor', 'Pack your own', 'Doctor-curated kit'],
          rows: [
            ['Time needed', 'Research + pharmacy visits', 'Order online in minutes'],
            ['Coverage', 'Depends on what you remember', '17 categories planned by a doctor'],
            ['Dosing guidance', 'Leaflets in small print, often mixed up', 'English dosage guide, colour-coded'],
            ['Prescription for customs', 'Only if you visit a doctor', 'Signed prescription included'],
            ['Expiry', 'Old stock from home cabinets is common', 'Fresh stock with long shelf life'],
            ['Doctor support abroad', 'None', '2 free teleconsultations'],
          ],
        },
      },
      {
        heading: 'When packing your own makes sense',
        bullets: [
          'Short domestic trips where pharmacies are easy to reach.',
          'You already take regular medicines and only need a few extras.',
          'You have a doctor at home who can advise on doses.',
        ],
      },
      {
        heading: 'When a readymade kit is worth it',
        bullets: [
          'International trips, especially with family or elderly parents.',
          'Destinations where medicines need a local prescription.',
          'You want everything organised in one pouch you can reuse for every trip.',
        ],
      },
      {
        heading: 'Common mistakes with home-made kits',
        bullets: [
          'Carrying expired medicines from the home cabinet.',
          'Loose strips without names or expiry dates, which can cause problems at customs.',
          'Forgetting ORS — the most important treatment for loose motions.',
          'Packing cold medicines with ingredients banned in some countries, such as pseudoephedrine in Japan.',
        ],
      },
    ],
    faqs: [
      { q: 'Is it cheaper to make my own travel medicine kit?', a: 'Buying a few basics can be cheaper, but matching the coverage of a complete kit — plus a doctor’s prescription and consultation — usually costs more time and money.' },
      { q: 'Can I reuse a travel medicine kit?', a: 'Yes. Replace used items and check expiry dates before each trip.' },
    ],
    sources: [
      { label: 'CDC — Pack smart (travel health kit)', url: 'https://wwwnc.cdc.gov/travel/page/pack-smart' },
    ],
    relatedGuides: ['best-travel-medical-kit-india', 'medicines-to-carry-abroad-from-india'],
  },
  {
    slug: 'family-travel-medical-kit',
    category: 'Packing & checklists',
    image: '/scenarios/family.webp',
    title: 'Family travel medical kit: what to pack for kids and elderly parents abroad',
    metaTitle: 'Family Travel Medical Kit: Kids & Parents Abroad',
    description:
      'Travelling abroad with children or elderly parents? A doctor’s checklist for a family travel medical kit, including prescription medicines, doses and when to see a doctor.',
    keyword: 'family travel medical kit',
    eyebrow: 'Family travel',
    quickAnswer:
      'A family travel kit needs the adult essentials — ORS, fever and pain relief, antacid, antihistamine, motion sickness tablets and first aid — plus age-appropriate children’s medicines prescribed by your paediatrician, and enough of parents’ regular medicines for the whole trip with extra days and prescriptions.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 6,
    sections: [
      {
        heading: 'The core kit for adults',
        bullets: [
          'ORS sachets, antidiarrhoeal and probiotic for stomach upsets.',
          'Paracetamol for fever and pain.',
          'Antacid, antihistamine and motion sickness tablets.',
          'Cold, cough and sore-throat relief.',
          'Bandages, plasters and cotton.',
        ],
      },
      {
        heading: 'Travelling with children',
        paragraphs: [
          'Children need age- and weight-appropriate doses, and many adult tablets are not suitable for them. Ask your paediatrician before the trip for the right fever medicine, ORS and anything else your child may need, and carry the prescription.',
        ],
        callout: {
          tone: 'warning',
          title: 'See a doctor quickly if a child has',
          text: 'High or persistent fever, signs of dehydration (fewer wet nappies, no tears, drowsiness), repeated vomiting, or blood in stool.',
        },
      },
      {
        heading: 'Travelling with elderly parents',
        bullets: [
          'Carry regular medicines (blood pressure, diabetes, thyroid, heart) for the full trip plus 5–7 extra days.',
          'Keep them in the cabin bag with the prescription, and split a backup supply into checked baggage.',
          'Pack a list of their conditions, allergies and doctor’s contact details.',
          'Plan rest breaks and hydration — heat and long walks affect older travellers faster.',
        ],
      },
      {
        heading: 'Family packing checklist',
        table: {
          head: ['Item', 'Who it is for'],
          rows: [
            ['Complete adult travel kit', 'Adults'],
            ['Children’s medicines (as prescribed)', 'Kids'],
            ['Regular prescription medicines + prescriptions', 'Parents / anyone on long-term treatment'],
            ['Thermometer, sunscreen, insect repellent', 'Everyone'],
            ['Travel insurance details & emergency numbers', 'Everyone'],
          ],
        },
      },
    ],
    faqs: [
      { q: 'Can children use a travel medical kit made for adults?', a: 'Not without guidance. Children need age- and weight-based doses, so ask your paediatrician before travelling. TravelMed kit owners can also use a free teleconsultation.' },
      { q: 'How much extra medicine should elderly parents carry?', a: 'Enough regular medicine for the whole trip plus 5–7 extra days, with prescriptions, split between cabin and checked baggage.' },
    ],
    sources: [
      { label: 'CDC — Traveling safely with infants & children', url: 'https://wwwnc.cdc.gov/travel/page/children' },
      { label: 'CDC — Traveling abroad with medicine', url: 'https://wwwnc.cdc.gov/travel/page/travel-abroad-with-medicine' },
    ],
    relatedGuides: ['medicines-to-carry-abroad-from-india', 'best-travel-medical-kit-india'],
    relatedDestinations: ['umrah-hajj', 'europe'],
  },
  {
    slug: 'medicines-for-students-going-abroad',
    category: 'Packing & checklists',
    image: '/scenarios/business.webp',
    title: 'Medicine checklist for Indian students going abroad',
    metaTitle: 'Medicines for Students Going Abroad: Checklist',
    description:
      'Moving to the USA, UK, Canada, Australia or Germany for studies? The medicines Indian students should carry, how much, what documents you need and what to sort out after arrival.',
    keyword: 'medicines to carry for students going abroad',
    eyebrow: 'Study abroad',
    quickAnswer:
      'Indian students going abroad should carry a small kit for common illnesses (fever, cold, stomach upset, acidity, allergies, minor cuts), a supply of any regular prescription medicines for the first few months with prescriptions, and register with a local doctor or student health service soon after arriving.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 6,
    sections: [
      {
        heading: 'Why students should pack medicines',
        paragraphs: [
          'In your first weeks abroad you will not yet be registered with a local doctor, many medicines need a prescription, and the weather, food and stress of moving make minor illnesses common. A small kit covers you until you settle in.',
        ],
      },
      {
        heading: 'The student medicine checklist',
        table: {
          head: ['Category', 'Why'],
          rows: [
            ['Paracetamol', 'Fever, headache and body ache'],
            ['Anti-cold, cough suppressant, lozenges', 'Colder climates and new germs'],
            ['Antacid & ORS', 'New food and irregular meals'],
            ['Antidiarrhoeal & probiotic', 'Stomach upsets'],
            ['Antihistamine', 'Pollen and dust allergies'],
            ['Plasters & cotton', 'Minor cuts in hostel kitchens'],
            ['Regular prescription medicines', 'Enough for the first 2–3 months, with prescriptions'],
          ],
        },
      },
      {
        heading: 'Documents to carry',
        bullets: [
          'Prescriptions or a doctor’s letter for every prescription medicine (generic names and doses).',
          'Medicines in original, labelled packaging.',
          'Your vaccination records and any medical reports for ongoing conditions.',
          'Details of your student health insurance.',
        ],
      },
      {
        heading: 'After you arrive',
        steps: [
          'Register with the university health service or a local doctor (GP).',
          'Find the nearest pharmacy and the local emergency number.',
          'Arrange ongoing prescriptions locally before your supply runs out.',
        ],
      },
    ],
    faqs: [
      { q: 'How much medicine can students take abroad?', a: 'A personal-use quantity, typically up to about 3 months for regular medicines, with prescriptions. Some countries restrict controlled medicines, so check the rules of your destination.' },
      { q: 'Can I take Indian medicines to the UK or USA?', a: 'Ordinary medicines for personal use are generally allowed with prescriptions and original packaging. Controlled medicines may need extra documentation.' },
    ],
    sources: [
      { label: 'CDC — Traveling abroad with medicine', url: 'https://wwwnc.cdc.gov/travel/page/travel-abroad-with-medicine' },
      { label: 'INCB — Information for travellers', url: 'https://www.incb.org/incb/en/travellers/general-information.html' },
    ],
    relatedGuides: ['doctor-letter-for-carrying-medicines-abroad', 'carrying-medicines-on-international-flights'],
    relatedDestinations: ['europe'],
  },
  {
    slug: 'doctor-letter-for-carrying-medicines-abroad',
    category: 'Flights & customs',
    image: '/scenarios/airport.webp',
    title: 'Doctor’s letter for carrying medicines abroad: what it must include (with template)',
    metaTitle: 'Doctor’s Letter for Medicines Abroad (Template)',
    description:
      'What a doctor’s letter for carrying medicines abroad must include, when you need one, and a ready-to-use template to take to your doctor before international travel.',
    keyword: 'doctor letter for carrying medicines abroad',
    eyebrow: 'Flights & customs',
    quickAnswer:
      'A doctor’s letter for travel should state your full name as on your passport, date of birth and passport number, your diagnosis, each medicine’s generic name, strength, dose and total quantity, the trip dates, and the doctor’s name, registration number, contact details, signature and stamp. Keep it with your medicines.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 5,
    sections: [
      {
        heading: 'When you need a doctor’s letter',
        bullets: [
          'You carry prescription medicines, especially injectables, inhalers or syringes.',
          'You carry controlled medicines (strong painkillers, sleeping or anxiety medicines).',
          'You carry larger quantities for a long stay.',
          'Your destination asks for documentation, such as the UAE, Singapore, Japan or Thailand for controlled medicines.',
        ],
      },
      {
        heading: 'What the letter must include',
        table: {
          head: ['Section', 'Details'],
          rows: [
            ['Patient', 'Full name as on passport, date of birth, passport number'],
            ['Condition', 'Diagnosis or reason for treatment'],
            ['Medicines', 'Generic name, brand name, strength, dose, frequency and total quantity'],
            ['Trip', 'Destination and travel dates'],
            ['Doctor', 'Name, qualification, medical registration number, clinic address, phone, email'],
            ['Validation', 'Signature, clinic stamp and date'],
          ],
        },
      },
      {
        heading: 'Template to take to your doctor',
        template: {
          title: 'Sample doctor’s letter (to be issued on clinic letterhead)',
          body: `To whom it may concern,

This is to certify that [Full name as on passport], born on [DD/MM/YYYY], passport number [XXXXXXXX], is under my medical care for [diagnosis].

For the duration of travel to [country] from [date] to [date], the patient requires the following medicines for personal use:

1. [Generic name] ([Brand]) [strength] — [dose], [frequency] — total quantity: [number]
2. [Generic name] ([Brand]) [strength] — [dose], [frequency] — total quantity: [number]

These medicines are prescribed for the patient's personal treatment only.

Dr. [Name], [Qualification]
Medical Registration No.: [Number]
[Clinic address] · [Phone] · [Email]
Signature & stamp:                      Date:`,
        },
        callout: {
          tone: 'info',
          title: 'Tip',
          text: 'Carry the original plus a photocopy, and keep a digital copy on your phone. For controlled medicines, some countries also need a permit applied for before travel.',
        },
      },
    ],
    faqs: [
      { q: 'Does a doctor’s letter need to be in English?', a: 'English is widely accepted. For some countries a translation may help, and for controlled medicines within Schengen Europe a specific certificate format is used.' },
      { q: 'Is a prescription enough, or do I need a letter?', a: 'For ordinary medicines a prescription is usually enough. For controlled medicines, injectables or large quantities, a detailed doctor’s letter is strongly recommended.' },
    ],
    sources: [
      { label: 'CDC — Traveling abroad with medicine', url: 'https://wwwnc.cdc.gov/travel/page/travel-abroad-with-medicine' },
      { label: 'INCB — Information for travellers', url: 'https://www.incb.org/incb/en/travellers/general-information.html' },
    ],
    relatedGuides: ['carrying-medicines-on-international-flights', 'medicines-banned-abroad-for-indian-travellers'],
    relatedDestinations: ['japan', 'dubai-uae'],
  },
  {
    slug: 'motion-sickness-while-travelling',
    category: 'Health on the go',
    image: '/scenarios/mountain.webp',
    title: 'Motion sickness on flights, cruises and mountain roads: what to take',
    metaTitle: 'Motion Sickness While Travelling: What to Take',
    description:
      'How to prevent and treat motion sickness on flights, ferries, cruises and hill roads: when to take tablets, side effects, and simple non-medicine tricks that work.',
    keyword: 'motion sickness tablets for travel',
    eyebrow: 'Health on the go',
    quickAnswer:
      'To prevent motion sickness, take a motion sickness tablet 30–60 minutes before the journey as directed on the label, sit where motion is least (over the wing, middle of the ship, front seat of a car), look at the horizon, avoid reading and heavy meals, and keep fresh air flowing. Many tablets cause drowsiness, so don’t drive after taking them.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 4,
    sections: [
      {
        heading: 'Why it happens',
        paragraphs: [
          'Motion sickness happens when your eyes and inner ear send your brain different signals about movement. It is common on ferries, winding mountain roads, small planes and cruise ships.',
        ],
      },
      {
        heading: 'Best seat for each journey',
        table: {
          head: ['Transport', 'Where to sit'],
          rows: [
            ['Flight', 'Over the wing, window seat'],
            ['Ferry / cruise', 'Middle of the vessel, lower deck, facing forward'],
            ['Car / bus', 'Front seat, looking at the road ahead'],
            ['Train', 'Forward-facing seat by a window'],
          ],
        },
      },
      {
        heading: 'Medicines and how to use them',
        bullets: [
          'Take motion sickness tablets 30–60 minutes before travel, following the label or doctor’s advice.',
          'Expect possible drowsiness — do not drive or drink alcohol after taking them.',
          'An antiemetic can help if nausea or vomiting has already started.',
          'Sip water or ORS if you vomit, to avoid dehydration.',
        ],
      },
      {
        heading: 'Non-medicine tips that help',
        bullets: [
          'Look at a fixed point on the horizon.',
          'Avoid reading or screens while moving.',
          'Eat a light meal before travel; avoid greasy food and alcohol.',
          'Get fresh air and keep your head still.',
        ],
      },
    ],
    faqs: [
      { q: 'When should I take a motion sickness tablet?', a: 'About 30–60 minutes before the journey starts, following the label or your doctor’s advice. It works much better as prevention than after symptoms begin.' },
      { q: 'Can children take motion sickness tablets?', a: 'Only in doses suitable for their age — ask a paediatrician before travelling.' },
    ],
    sources: [
      { label: 'CDC Yellow Book — Motion sickness', url: 'https://www.cdc.gov/yellow-book/hcp/travel-air-sea/motion-sickness.html' },
    ],
    relatedGuides: ['medicines-to-carry-abroad-from-india', 'family-travel-medical-kit'],
    relatedDestinations: ['thailand', 'japan'],
  },
];
