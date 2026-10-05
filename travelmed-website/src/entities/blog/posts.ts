import type { BlogPost } from '@/entities/guide/types';
import { BUYING_AND_PLANNING_POSTS } from './planning-posts';

/**
 * Evergreen, medically reviewed guides targeting high-intent searches from Indian travellers.
 * NOTE: every guide must be reviewed by the medical director before publishing changes.
 */
const CORE_POSTS: BlogPost[] = [
  {
    slug: 'medicines-to-carry-abroad-from-india',
    category: 'Packing & checklists',
    image: '/pro.webp',
    title: 'Medicines to carry when travelling abroad from India: a doctor’s checklist',
    metaTitle: 'Medicines to Carry Abroad from India: Checklist',
    description:
      'A doctor-made checklist of medicines to carry for international travel from India: stomach, fever, allergy, motion sickness and first aid — plus packing and customs tips.',
    keyword: 'medicines to carry while travelling abroad from India',
    eyebrow: 'Travel health checklist',
    quickAnswer:
      'For an international trip from India, carry medicines for the problems travellers get most: stomach upsets (ORS, antidiarrhoeal, antacid, probiotic), fever and pain (paracetamol), allergies (antihistamine), motion sickness, cold and sore throat, plus a basic first-aid kit. Add enough of your regular prescription medicines for the whole trip with a few days extra, and carry the prescription.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 7,
    sections: [
      {
        heading: 'Why a travel medicine kit matters abroad',
        paragraphs: [
          'New food, water, climate and long journeys make minor illnesses common on international trips. In many countries, medicines that are sold over the counter in India need a local prescription, pharmacies can be hard to find at night, and a short doctor visit can cost far more than at home.',
          'Carrying a small, well-organised kit means you can treat common problems within hours instead of losing a day of your trip — and you know exactly what you are taking.',
        ],
      },
      {
        heading: 'The essential checklist',
        table: {
          head: ['Problem', 'What to carry', 'Why'],
          rows: [
            ['Loose motions / food poisoning', 'ORS sachets, antimotility tablets, probiotics', 'Dehydration is the main risk; ORS is the first treatment'],
            ['Acidity & indigestion', 'Antacid tablets', 'Rich or unfamiliar food is the most common trigger'],
            ['Fever, headache, body pain', 'Paracetamol; a pain reliever', 'Jet lag, long walks and infections'],
            ['Allergies, sneezing, hives', 'Antihistamine tablets', 'Pollen, dust, insect bites and new foods'],
            ['Motion & air sickness', 'Motion sickness tablets, antiemetic', 'Flights, ferries, winding mountain roads'],
            ['Cold, cough, sore throat', 'Anti-cold tablets, cough suppressant, lozenges', 'Air-conditioning and weather changes'],
            ['Cuts, scrapes, blisters', 'Bandages, plasters, cotton, antiseptic', 'Walking tours, beaches and hikes'],
          ],
        },
      },
      {
        heading: 'Don’t forget your regular prescription medicines',
        bullets: [
          'Carry enough for the whole trip plus 3–5 extra days in case of delays.',
          'Keep them in their original labelled packaging.',
          'Carry a copy of your prescription or a doctor’s letter listing the generic names and doses.',
          'Split supplies between your cabin bag and checked bag so a lost suitcase doesn’t leave you without them.',
        ],
      },
      {
        heading: 'Check your destination’s medicine rules',
        paragraphs: [
          'Some medicines that are common in India are restricted or banned elsewhere. Japan, for example, prohibits medicines containing pseudoephedrine or ephedrine, and the UAE, Singapore and Thailand control many narcotic and psychotropic medicines. Always check the official rules for your destination before you fly.',
        ],
        callout: {
          tone: 'info',
          title: 'Tip',
          text: 'Read our guide to medicines banned or restricted abroad before packing cold, cough, sleep or strong pain medicines.',
        },
      },
      {
        heading: 'Ready-made option: the TravelMed kit',
        paragraphs: [
          'TravelMed puts 150+ medicines and essentials across 17 categories into one colour-coded pouch, with an English dosage guide, a signed doctor’s prescription and 2 free doctor teleconsultations for when you are unsure what to take.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How many days of medicines should I carry abroad?',
        a: 'Carry enough of your regular medicines for the full trip plus 3–5 extra days. For common-ailment medicines, a small supply of each is usually enough for a one- to three-week trip.',
      },
      {
        q: 'Do I need a prescription to carry medicines abroad?',
        a: 'For prescription medicines, yes — carry a copy of the prescription or a doctor’s letter with generic names and doses. Some countries also require advance approval for controlled medicines.',
      },
      {
        q: 'Can I buy medicines easily abroad?',
        a: 'Often not. Many medicines sold over the counter in India need a local prescription abroad, and pharmacy hours and languages can make it difficult to get help quickly.',
      },
    ],
    sources: [
      { label: 'CDC — Traveling abroad with medicine', url: 'https://wwwnc.cdc.gov/travel/page/travel-abroad-with-medicine' },
      { label: 'INCB — Information for travellers', url: 'https://www.incb.org/incb/en/travellers/general-information.html' },
    ],
    relatedGuides: ['carrying-medicines-on-international-flights', 'medicines-banned-abroad-for-indian-travellers', 'food-poisoning-abroad-what-to-do'],
    relatedDestinations: ['thailand', 'dubai-uae', 'europe'],
  },
  {
    slug: 'carrying-medicines-on-international-flights',
    category: 'Flights & customs',
    image: '/scenarios/airport.webp',
    title: 'Carrying medicines on international flights from India: rules & customs tips',
    metaTitle: 'Carrying Medicines on Flights from India',
    description:
      'Can you carry medicines in flight from India? Cabin vs checked bag rules, liquid limits, prescriptions, doctor’s letters and how to clear customs abroad without trouble.',
    keyword: 'can I carry medicines in flight India',
    eyebrow: 'Flights & customs',
    quickAnswer:
      'Yes. Tablets and capsules are allowed in both cabin and checked baggage on flights from India. Keep medicines in original packaging, carry a prescription or doctor’s letter for prescription medicines, pack only a personal-use quantity, and check your destination’s rules — some countries require approval for controlled medicines.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 6,
    sections: [
      {
        heading: 'Cabin bag or checked bag?',
        paragraphs: [
          'Solid medicines such as tablets, capsules and blister packs can travel in either bag. Liquid medicines above the usual cabin liquid limit are generally allowed when medically necessary, but may be screened separately — tell security staff before screening.',
        ],
        bullets: [
          'Keep your daily prescription medicines and a day or two of essentials (motion sickness tablets, ORS, pain reliever) in your cabin bag.',
          'Pack your full travel medical kit in your checked bag if you prefer to travel light.',
          'Never keep your only supply of critical medicines in checked baggage.',
        ],
      },
      {
        heading: 'Documents to carry',
        bullets: [
          'A copy of your prescription or a doctor’s letter with your name (as on your passport), generic medicine names and doses.',
          'Medicines in original, labelled packaging — avoid loose tablets in unmarked boxes.',
          'For controlled medicines (strong painkillers, sleeping pills, some ADHD or anxiety medicines), check whether your destination needs a permit or advance approval.',
        ],
        callout: {
          tone: 'info',
          title: 'TravelMed kits include a signed prescription',
          text: 'Every TravelMed kit comes with a signed doctor’s prescription listing the medicines inside, so you can show it if asked at security or customs.',
        },
      },
      {
        heading: 'How much can you carry?',
        paragraphs: [
          'Carry a quantity that clearly matches personal use for the length of your trip. Many countries use limits of about 30 to 90 days’ supply for personal medicines, and controlled medicines often have stricter limits.',
        ],
        table: {
          head: ['Destination', 'Key rule for personal medicines'],
          rows: [
            ['Japan', 'Pseudoephedrine/ephedrine products prohibited; over one month’s supply of some medicines needs a Yunyu Kakunin-sho'],
            ['UAE', 'Controlled medicines up to 3 months’ supply with prescription; optional MOHAP pre-approval'],
            ['Singapore', 'Up to 3 months’ supply without approval unless it contains controlled substances'],
            ['Thailand', 'Psychotropics up to 30 days with prescription; narcotic medicines need a Thai FDA permit'],
            ['Schengen Europe', 'Carry prescription; narcotic/psychotropic medicines need a doctor’s certificate'],
          ],
        },
      },
      {
        heading: 'At customs abroad',
        bullets: [
          'Declare medicines if the country asks you to, especially controlled ones.',
          'Keep documents easy to reach, not buried in your suitcase.',
          'If you are unsure about a medicine, leave it at home or check with the embassy before you fly.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Are tablets allowed in cabin baggage in India?',
        a: 'Yes. Tablets, capsules and blister packs are allowed in cabin baggage. Keep them in original packaging and carry the prescription for prescription medicines.',
      },
      {
        q: 'Do I need a doctor’s letter to carry medicines abroad?',
        a: 'It is strongly recommended for prescription medicines and essential for controlled medicines or injectables. The letter should list generic names, doses and your diagnosis.',
      },
      {
        q: 'Can customs confiscate my medicines?',
        a: 'Yes, if a medicine is banned in that country, exceeds personal-use limits or has no supporting prescription. Checking the destination’s rules beforehand avoids this.',
      },
    ],
    sources: [
      { label: 'CDC — Traveling abroad with medicine', url: 'https://wwwnc.cdc.gov/travel/page/travel-abroad-with-medicine' },
      { label: 'HSA Singapore — Travelling with medications', url: 'https://www.hsa.gov.sg/travelling-with-medication-and-medical-devices/personal-medications/' },
      { label: 'UAE MOHAP — Permit to import medicines for personal use', url: 'https://mohap.gov.ae/en/w/issue-of-permit-to-import-medicines-for-personal-use' },
      { label: 'U.S. Embassy Japan — Importing medication', url: 'https://jp.usembassy.gov/services/importing-medication/' },
    ],
    relatedGuides: ['medicines-banned-abroad-for-indian-travellers', 'medicines-to-carry-abroad-from-india'],
    relatedDestinations: ['japan', 'dubai-uae', 'singapore'],
  },
  {
    slug: 'medicines-banned-abroad-for-indian-travellers',
    category: 'Flights & customs',
    image: '/scenarios/business.webp',
    title: 'Medicines banned or restricted abroad: what Indian travellers must know',
    metaTitle: 'Medicines Banned Abroad for Indian Travellers',
    description:
      'Which common Indian medicines are banned or restricted in Japan, UAE, Singapore, Thailand and Europe? Check cold, cough, sleep and pain medicines before you fly.',
    keyword: 'medicines banned in Japan UAE for Indian travellers',
    eyebrow: 'Restricted medicines',
    quickAnswer:
      'The medicines most likely to cause trouble abroad are cold and sinus tablets with pseudoephedrine or ephedrine (banned in Japan), codeine cough syrups, strong painkillers such as tramadol, sleeping pills and anxiety medicines. These are controlled in countries like the UAE, Singapore and Thailand and may need a prescription, declaration or advance permit.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 6,
    sections: [
      {
        heading: 'The medicine groups to double-check',
        table: {
          head: ['Medicine group', 'Common examples', 'Why it matters'],
          rows: [
            ['Decongestants', 'Pseudoephedrine, ephedrine in cold & sinus tablets', 'Prohibited in Japan even with a prescription'],
            ['Opioid cough & pain medicines', 'Codeine syrups, tramadol', 'Controlled in the UAE, Singapore, Thailand and many others'],
            ['Sleeping & anxiety medicines', 'Benzodiazepines, zolpidem', 'Psychotropic — limits, prescriptions or permits needed'],
            ['ADHD medicines', 'Stimulants such as methylphenidate', 'Banned or strictly controlled in several countries'],
          ],
        },
      },
      {
        heading: 'Country quick guide',
        bullets: [
          'Japan: medicines containing pseudoephedrine or ephedrine are prohibited. Psychotropic medicines above a one-month supply need a Yunyu Kakunin-sho import certificate.',
          'UAE: narcotic and psychotropic medicines are allowed for up to 3 months’ personal use with a recent prescription; MOHAP offers optional pre-approval.',
          'Singapore: up to 3 months’ supply of personal medicines is allowed without approval, unless they contain controlled substances — those need HSA approval at least 2 weeks before arrival.',
          'Thailand: psychotropic medicines up to 30 days’ supply with a prescription; narcotic medicines need a Thai FDA permit applied for at least 15 days before travel.',
          'Schengen Europe: carry prescriptions; narcotic or psychotropic medicines need a certificate from your doctor.',
        ],
        callout: {
          tone: 'warning',
          title: 'Always check the official source',
          text: 'Rules change. Confirm with the destination’s health authority or embassy before you travel, especially for controlled medicines.',
        },
      },
      {
        heading: 'How to stay safe',
        bullets: [
          'Read the ingredient list on every cold, cough and pain medicine you pack.',
          'Carry prescriptions and keep medicines in original packaging.',
          'If you are not sure, ask a doctor for an alternative before you fly — you can use a TravelMed teleconsultation for this.',
        ],
      },
    ],
    faqs: [
      {
        q: 'Can I take cold medicine to Japan?',
        a: 'Only if it does not contain pseudoephedrine or ephedrine, which are prohibited in Japan even with a prescription. Check the ingredient list of every cold and sinus product before packing.',
      },
      {
        q: 'Is codeine cough syrup allowed in the UAE?',
        a: 'Codeine is a controlled medicine in the UAE. It may be carried for personal use only with a valid recent prescription and within quantity limits; pre-approval from MOHAP is recommended.',
      },
      {
        q: 'Do I need approval to bring medicines into Singapore?',
        a: 'Not for up to 3 months’ supply of ordinary personal medicines. Medicines containing controlled substances need HSA approval, applied for at least 2 weeks before arrival.',
      },
    ],
    sources: [
      { label: 'U.S. Embassy Japan — Importing medication', url: 'https://jp.usembassy.gov/services/importing-medication/' },
      { label: 'UAE MOHAP — Permit to import medicines for personal use', url: 'https://mohap.gov.ae/en/w/issue-of-permit-to-import-medicines-for-personal-use' },
      { label: 'HSA Singapore — Travelling with medications', url: 'https://www.hsa.gov.sg/travelling-with-medication-and-medical-devices/personal-medications/' },
      { label: 'Thai FDA — Permit for travellers', url: 'https://permitfortraveler.fda.moph.go.th/nct_permit_main/' },
      { label: 'INCB — Information for travellers', url: 'https://www.incb.org/incb/en/travellers/general-information.html' },
    ],
    relatedGuides: ['carrying-medicines-on-international-flights', 'medicines-to-carry-abroad-from-india'],
    relatedDestinations: ['japan', 'dubai-uae', 'singapore', 'thailand'],
  },
  {
    slug: 'food-poisoning-abroad-what-to-do',
    category: 'Health on the go',
    image: '/scenarios/thailand.webp',
    title: 'Food poisoning & loose motions abroad: what to do',
    metaTitle: 'Food Poisoning Abroad: What to Do',
    description:
      'Got loose motions or food poisoning on holiday? A doctor explains what to take, how to prevent dehydration, and the warning signs that need urgent medical care.',
    keyword: 'food poisoning while travelling abroad what to do',
    eyebrow: 'Traveller’s diarrhoea',
    quickAnswer:
      'Most travellers’ diarrhoea settles in 1–3 days. Start oral rehydration solution (ORS) straight away, eat light food, and use an antidiarrhoeal only if you have no fever or blood in the stool. See a doctor urgently for blood in stool, high fever, severe pain, signs of dehydration, or symptoms lasting more than 3 days.',
    datePublished: '2026-09-29',
    dateModified: '2026-09-29',
    readingMinutes: 5,
    sections: [
      {
        heading: 'What to do in the first few hours',
        bullets: [
          'Start ORS immediately and keep sipping — replace every loose motion with a glass of ORS.',
          'Eat light, simple food (rice, toast, bananas, curd) when you feel able.',
          'Avoid alcohol, very oily food and caffeine until you recover.',
          'Rest — schedule a quieter day if you can.',
        ],
      },
      {
        heading: 'Medicines that can help',
        table: {
          head: ['Medicine', 'Use it for', 'Avoid when'],
          rows: [
            ['ORS', 'Preventing and treating dehydration', 'Never needs to be avoided'],
            ['Antimotility tablet', 'Reducing frequent loose motions', 'Fever, blood in stool, or in young children'],
            ['Antiemetic', 'Nausea and vomiting', 'Follow the dosage guide'],
            ['Probiotic', 'Supporting gut recovery', '—'],
            ['Antibiotic', 'Only for moderate–severe cases', 'Take only on a doctor’s advice'],
          ],
        },
      },
      {
        heading: 'When to see a doctor urgently',
        callout: {
          tone: 'warning',
          title: 'Seek medical care if you notice',
          text: 'Blood or mucus in stool, fever above 38.5 °C, severe abdominal pain, signs of dehydration (very little urine, dizziness, dry mouth), symptoms lasting more than 3 days, or illness in a child, pregnant woman or older adult.',
        },
      },
      {
        heading: 'How to prevent it',
        bullets: [
          'Drink sealed bottled water and avoid ice of unknown origin.',
          'Choose food that is freshly cooked and served hot.',
          'Peel fruit yourself; be careful with salads and raw seafood.',
          'Wash or sanitise hands before eating.',
        ],
      },
    ],
    faqs: [
      {
        q: 'How long does traveller’s diarrhoea last?',
        a: 'Most cases improve within 1–3 days with rest and ORS. If it lasts longer than 3 days or you have fever or blood in stool, see a doctor.',
      },
      {
        q: 'Should I take an antibiotic for loose motions abroad?',
        a: 'Not routinely. Antibiotics are only needed for moderate to severe cases and should be taken on a doctor’s advice — TravelMed kit owners can book a free teleconsultation.',
      },
      {
        q: 'What is the best thing to drink with loose motions?',
        a: 'Oral rehydration solution (ORS). It replaces the salts and fluids you lose and is the most important treatment.',
      },
    ],
    sources: [
      { label: 'CDC — Travelers’ diarrhea', url: 'https://wwwnc.cdc.gov/travel/page/travelers-diarrhea' },
      { label: 'WHO — Diarrhoeal disease', url: 'https://www.who.int/news-room/fact-sheets/detail/diarrhoeal-disease' },
    ],
    relatedGuides: ['medicines-to-carry-abroad-from-india'],
    relatedDestinations: ['thailand', 'dubai-uae'],
  },
];

/** Newest first; the featured post leads the blog hub. */
export const BLOG_POSTS: BlogPost[] = [...BUYING_AND_PLANNING_POSTS, ...CORE_POSTS];

export const getPost = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);
