import 'dotenv/config';
import { PrismaClient } from '@prisma/client';

import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // 1. Create Default Admin Account
  const adminEmail = 'admin@travelmed.com';
  const adminPassword = 'AdminPassword123';
  const hashedAdminPassword = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedAdminPassword,
      name: 'System Administrator',
      role: 'admin'
    }
  });
  console.log('Default Admin Account created:');
  console.log(`- Email: ${adminEmail}`);
  console.log(`- Password: ${adminPassword}`);

  // 2. Seed Medicines
  const medicinesData = [
    {
      id: 'med-paracetamol',
      name: 'Paracetamol 650mg',
      category: 'Pain Relief',
      description: 'Rapid-acting pain reliever and fever reducer. Essential for headaches, muscle soreness, and travel fevers.',
      activeIngredient: 'Paracetamol 650mg',
      dosage: '1 tablet every 4-6 hours as needed. Do not exceed 4 tablets in 24 hours.',
      warning: 'Do not consume alcohol. Severe liver damage may occur if daily limit is exceeded.',
      sideEffects: 'Generally safe. Rare allergic reactions or rashes.',
      fdaStatus: 'CDSCO Regulated / WHO Essential',
      travelNote: 'Globally recognized and legal in all countries.',
      compartment: 'A',
      alternative: 'Crocin, Dolo 650, Calpol',
      symptoms: ['Headache', 'Fever', 'Body Aches', 'Toothache']
    },
    {
      id: 'med-ibuprofen',
      name: 'Ibuprofen 400mg',
      category: 'Pain Relief',
      description: 'Anti-inflammatory medicine that targets swelling, joint stiffness, toothache, and deep muscular pain.',
      activeIngredient: 'Ibuprofen 400mg',
      dosage: '1 tablet every 6-8 hours with food. Do not exceed 3 tablets in 24 hours.',
      warning: 'May cause stomach irritation. Avoid if you have active ulcers.',
      sideEffects: 'Nausea, heartburn, mild stomach discomfort.',
      fdaStatus: 'CDSCO Regulated / OTC',
      travelNote: 'Must be taken with food. Ideal for recovery after long walks or mountain climbs.',
      compartment: 'A',
      alternative: 'Brufen, Advil',
      symptoms: ['Joint Pain', 'Toothache', 'Muscle Sprain', 'Swelling']
    },
    {
      id: 'med-diclofenac',
      name: 'Diclofenac 50mg',
      category: 'Pain Relief',
      description: 'Non-steroidal anti-inflammatory drug (NSAID) designed to target acute backaches, neck stiffness, and joint soreness.',
      activeIngredient: 'Diclofenac Sodium 50mg',
      dosage: '1 tablet twice daily after meals.',
      warning: 'Do not take on an empty stomach. Avoid taking with other oral NSAIDs.',
      sideEffects: 'Mild dizziness, stomach discomfort, acid reflux.',
      fdaStatus: 'CDSCO Regulated / Prescription',
      travelNote: 'Excellent rapid action for sudden cramps or heavy backpack fatigue.',
      compartment: 'A',
      alternative: 'Voveran, Voltaren',
      symptoms: ['Backache', 'Neck Pain', 'Arthritic Flares', 'Severe Muscle Pain']
    },
    {
      id: 'med-aceclofenac',
      name: 'Aceclofenac 100mg',
      category: 'Pain Relief',
      description: 'Effective anti-inflammatory medication targeting bone and joint discomfort, dental extraction recovery, and sprains.',
      activeIngredient: 'Aceclofenac 100mg',
      dosage: '1 tablet in the morning and 1 at night after food.',
      warning: 'Ensure adequate hydration during use to protect kidney function.',
      sideEffects: 'Indigestion, mild drowsiness, headache.',
      fdaStatus: 'CDSCO Regulated / Prescription',
      travelNote: 'Highly stable in tropical climates. Best kept in foil packaging.',
      compartment: 'A',
      alternative: 'Zerodol, Hifenac',
      symptoms: ['Dental Pain', 'Sprains', 'Osteoarthritis discomfort', 'Severe body ache']
    },
    {
      id: 'med-combiflam',
      name: 'Combiflam Tablet',
      category: 'Pain Relief',
      description: 'A powerful combination of Paracetamol and Ibuprofen to provide dual action against severe pain and fever.',
      activeIngredient: 'Ibuprofen 400mg + Paracetamol 325mg',
      dosage: '1 tablet up to 3 times a day after meals.',
      warning: 'Do not use if allergic to aspirin or other NSAIDs.',
      sideEffects: 'Heartburn, nausea, minor rash.',
      fdaStatus: 'CDSCO Regulated / Popular Generic Brand',
      travelNote: 'A trusted go-to medicine across India for immediate multi-pain relief.',
      compartment: 'A',
      alternative: 'Flexon, Ibugesic Plus',
      symptoms: ['High Fever', 'Migraine', 'Joint Pain', 'Severe Toothache']
    },
    {
      id: 'med-loperamide',
      name: 'Loperamide 2mg',
      category: 'Digestion',
      description: 'Fast-acting anti-diarrheal compound. Slows bowel movements to control diarrhea and restore digestive balance.',
      activeIngredient: 'Loperamide HCl 2mg',
      dosage: '2 tablets immediately after the first loose stool, then 1 tablet after each loose stool. Max 4 tablets daily.',
      warning: 'Do not use in case of dysentery (blood in stool) or high fever.',
      sideEffects: 'Constipation, dry mouth, mild abdominal cramps.',
      fdaStatus: 'CDSCO Regulated / OTC',
      travelNote: 'Essential for travellers visiting destinations with risk of food/water contamination.',
      compartment: 'B',
      alternative: 'Lopamide, Imodium',
      symptoms: ['Diarrhea', 'Loose Stools', 'Traveller\'s Tummy']
    },
    {
      id: 'med-digene',
      name: 'Digene Antacid Tablet',
      category: 'Digestion',
      description: 'Chewable antacid tablet providing quick relief from acidity, gas, bloating, and burning sensation in stomach.',
      activeIngredient: 'Magnesium Hydroxide, Aluminium Hydroxide, Simethicone',
      dosage: 'Chew 2-4 tablets after meals or when experiencing symptoms.',
      warning: 'Do not swallow whole; chew thoroughly for immediate effect.',
      sideEffects: 'None under recommended usage. High doses may affect bowel consistency.',
      fdaStatus: 'CDSCO Regulated / OTC',
      travelNote: 'Perfect companion when sampling local street food and rich culinary dishes.',
      compartment: 'B',
      alternative: 'Gelusil, Tums',
      symptoms: ['Acidity', 'Heartburn', 'Bloating', 'Indigestion']
    },
    {
      id: 'med-avomine',
      name: 'Avomine 25mg',
      category: 'Digestion',
      description: 'Effective medication for prevention and treatment of motion sickness, nausea, and travel-induced vomiting.',
      activeIngredient: 'Promethazine Theoclate 25mg',
      dosage: 'Take 1 tablet 1-2 hours before travel. Repeat after 6-8 hours if journey is long.',
      warning: 'Causes marked drowsiness. Avoid driving or alcohol intake.',
      sideEffects: 'Drowsiness, dry mouth, blurred vision.',
      fdaStatus: 'CDSCO Regulated / Travel Category Standard',
      travelNote: 'Invaluable for winding mountain roads, ferry trips, or long bumpy bus rides.',
      compartment: 'B',
      alternative: 'Phenergan, Gravol',
      symptoms: ['Motion Sickness', 'Nausea', 'Vomiting', 'Car Sickness']
    },
    {
      id: 'med-ors',
      name: 'ORS Hydration Salts',
      category: 'Digestion',
      description: 'WHO-formula Oral Rehydration Salts designed to restore body fluids and key electrolytes lost during illness or extreme heat.',
      activeIngredient: 'Sodium Chloride, Potassium Chloride, Sodium Citrate, Dextrose',
      dosage: 'Dissolve entire contents of 1 sachet in 1 litre of clean drinking water. Consume within 24 hours.',
      warning: 'Do not mix with milk or juice. Use only safe drinking water.',
      sideEffects: 'None.',
      fdaStatus: 'WHO Standard Hydration Formula',
      travelNote: 'Critical for tropical climates, desert exploration, or recovering from stomach bugs.',
      compartment: 'B',
      alternative: 'Electral, ORS Powder',
      symptoms: ['Dehydration', 'Heat Stroke', 'Dizziness', 'Fatigue']
    },
    {
      id: 'med-cetirizine',
      name: 'Cetirizine 10mg',
      category: 'Allergies',
      description: 'Second-generation non-drowsy antihistamine providing 24-hour relief from allergies, runny nose, and sneezing.',
      activeIngredient: 'Cetirizine HCl 10mg',
      dosage: '1 tablet daily at bedtime.',
      warning: 'May cause mild drowsiness in sensitive individuals. Do not exceed 1 tablet daily.',
      sideEffects: 'Dry mouth, mild fatigue, headache.',
      fdaStatus: 'CDSCO Regulated / 24h Antihistamine',
      travelNote: 'Excellent for destinations with high pollen counts or different seasonal allergens.',
      compartment: 'C',
      alternative: 'Alerid, Zyrtec',
      symptoms: ['Sneezing', 'Allergic Rhinitis', 'Hives', 'Watery Eyes']
    },
    {
      id: 'med-diphenhydramine',
      name: 'Emergency Antihistamine',
      category: 'Allergies',
      description: 'Rapid-acting antihistamine used for severe allergic reactions, insect bites, and itching.',
      activeIngredient: 'Diphenhydramine HCl 25mg',
      dosage: '1-2 tablets every 4-6 hours. Max 6 tablets in 24 hours.',
      warning: 'Causes heavy drowsiness. Do not drive or operate machinery.',
      sideEffects: 'Sleepiness, dry throat, coordination impairment.',
      fdaStatus: 'CDSCO Regulated / Emergency Med',
      travelNote: 'Also highly effective as a short-term sleep aid for adjusting to time-zone shifts.',
      compartment: 'C',
      alternative: 'Benadryl',
      symptoms: ['Insect Bites', 'Severe Itching', 'Acute Hives', 'Allergic Flare']
    },
    {
      id: 'med-decongestant',
      name: 'Cough & Cold Decongestant',
      category: 'Respiratory',
      description: 'Provides relief from nasal congestion, sinus pressure, runny nose, and throat irritation associated with common cold.',
      activeIngredient: 'Phenylephrine HCl + Chlorpheniramine Maleate',
      dosage: '1 tablet every 6 hours. Max 4 tablets daily.',
      warning: 'May cause mild restlessness. Monitor blood pressure if hypertensive.',
      sideEffects: 'Dryness of throat, mild dizziness, dry nose.',
      fdaStatus: 'CDSCO Regulated / OTC Cold Combo',
      travelNote: 'Keeps sinus passages open during high-altitude flights to prevent ear blocks.',
      compartment: 'C',
      alternative: 'Solvin Cold, Sinarest',
      symptoms: ['Runny Nose', 'Sinus Pressure', 'Nasal Blockage', 'Cold & Cough']
    },
    {
      id: 'med-amoxicillin',
      name: 'Amoxicillin 500mg',
      category: 'Anti-Infectives',
      description: 'Broad-spectrum antibiotic used to treat bacterial infections of the chest, throat, urinary tract, and skin.',
      activeIngredient: 'Amoxicillin Trihydrate 500mg',
      dosage: '1 tablet three times daily for 5-7 days. Always finish the prescribed course.',
      warning: 'Do not use if allergic to Penicillin. Requires teleconsultation confirmation.',
      sideEffects: 'Stomach upset, mild diarrhea, nausea.',
      fdaStatus: 'CDSCO Regulated / Prescription Only',
      travelNote: 'Included for emergencies. Use only after scanning kit QR and speaking with a doctor.',
      compartment: 'C',
      alternative: 'Novamox, Amoxil',
      symptoms: ['Throat Infection', 'Chest Infection', 'Bacterial Scratches', 'UTI Symptoms']
    },
    {
      id: 'med-bandaid',
      name: 'Band-Aid & Wound Dressings',
      category: 'Wound Care',
      description: 'Premium adhesive strips and sterile dressing pads. Protects minor cuts, scrapes, and blisters from dust and infection.',
      activeIngredient: 'Sterile Adhesive Dressings',
      dosage: 'Apply to cleaned and disinfected skin. Change daily.',
      warning: 'Ensure wound is clean before sealing.',
      sideEffects: 'None. Minimal adhesive irritation in rare skin types.',
      fdaStatus: 'Clinical First Aid Standard',
      travelNote: 'Pack includes various sizes, including flexible fabric strips ideal for joints and blisters.',
      compartment: 'First Aid Pouch',
      alternative: 'Plasters, Bandages',
      symptoms: ['Cuts', 'Scrapes', 'Blisters', 'Minor Bleeding']
    },
    {
      id: 'med-antibiotic-ointment',
      name: 'Triple Antibiotic Ointment',
      category: 'Wound Care',
      description: 'Topical antibiotic ointment that prevents local infection in minor cuts, scrapes, and burns.',
      activeIngredient: 'Bacitracin + Neomycin + Polymyxin B',
      dosage: 'Clean the area. Apply a thin layer 1-3 times daily.',
      warning: 'For external skin use only. Do not apply in eyes or large open wounds.',
      sideEffects: 'None. Rare local skin redness.',
      fdaStatus: 'CDSCO Regulated / USP Grade',
      travelNote: 'Apply after sanitizing the wound and before cover with a Band-Aid.',
      compartment: 'First Aid Pouch',
      alternative: 'Neosporin',
      symptoms: ['Minor Scrapes', 'Light Burns', 'Cuts', 'Skin Abrasions']
    },
    {
      id: 'med-thermometer',
      name: 'Digital Thermometer',
      category: 'First Aid',
      description: 'High-accuracy oral or underarm digital thermometer. Essential for tracking body temperature spikes.',
      activeIngredient: 'N/A (Electronic Device)',
      dosage: 'Place under tongue or armpit. Wait for beep. Read digital screen.',
      warning: 'Do not submerge under boiling water. Clean with antiseptic wipes after use.',
      sideEffects: 'None.',
      fdaStatus: 'ISO Certified Medical Device',
      travelNote: 'Uses standard button battery. Compact and shock-proof casing.',
      compartment: 'First Aid Pouch',
      alternative: 'Electronic Temp Sensor',
      symptoms: ['High Fever', 'Chills', 'Temperature Tracking']
    }
  ];

  for (const med of medicinesData) {
    await prisma.medicine.upsert({
      where: { id: med.id },
      update: med,
      create: med
    });
  }
  console.log(`Seeded ${medicinesData.length} medicines.`);

  // 3. Seed Doctors
  const doctorsData = [
    {
      id: 'doc-elena',
      name: 'Dr. Elena Rostova, MD',
      specialty: 'Travel Medicine & Infectious Diseases',
      languages: ['English', 'Spanish', 'Russian'],
      experience: '14 years',
      bio: 'Former consultant for the World Health Organization (WHO) specializing in tropical pathogens, vaccine-preventable travel illnesses, and high-altitude emergency protocols.',
      rating: 4.95,
      reviewsCount: 342,
      availability: 'Available Now (Wait < 3 mins)',
      image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300',
      videoSimulatedUrl: '/videos/doc-elena-preview.mp4'
    },
    {
      id: 'doc-marcus',
      name: 'Dr. Marcus Vance, DO',
      specialty: 'Emergency Medicine & Wilderness Rescue',
      languages: ['English', 'French'],
      experience: '11 years',
      bio: 'Lead physician for wilderness medical search-and-rescue teams. Expert in acute trauma triage, insect/venom exposures, and wilderness self-medication.',
      rating: 4.88,
      reviewsCount: 289,
      availability: 'Available in 15 mins',
      image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300',
      videoSimulatedUrl: '/videos/doc-marcus-preview.mp4'
    },
    {
      id: 'doc-priya',
      name: 'Dr. Priya Patel, MD',
      specialty: 'Internal Medicine & Gastroenterology',
      languages: ['English', 'Hindi', 'Gujarati'],
      experience: '9 years',
      bio: 'Specialist in digestive health, enteric infections, and food-borne pathogens. Helps travelers manage gastrointestinal challenges and dehydration in remote regions.',
      rating: 4.92,
      reviewsCount: 198,
      availability: 'Available Now (Wait < 5 mins)',
      image: 'https://images.unsplash.com/photo-1594824813573-246434de83fb?auto=format&fit=crop&q=80&w=300&h=300',
      videoSimulatedUrl: '/videos/doc-priya-preview.mp4'
    },
    {
      id: 'doc-kenji',
      name: 'Dr. Kenji Sato, MD',
      specialty: 'Family Medicine & Pediatrics',
      languages: ['English', 'Japanese'],
      experience: '16 years',
      bio: 'Dedicated family practitioner with extensive experience in pediatric travel safety, dosage adjustments for infants, and foreign healthcare navigation.',
      rating: 4.97,
      reviewsCount: 412,
      availability: 'Available in 30 mins',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300',
      videoSimulatedUrl: '/videos/doc-kenji-preview.mp4'
    }
  ];

  for (const doc of doctorsData) {
    await prisma.doctor.upsert({
      where: { id: doc.id },
      update: doc,
      create: doc
    });
  }
  console.log(`Seeded ${doctorsData.length} doctors.`);

  // 4. Seed Travel Scenarios
  const scenariosData = [
    {
      id: 'scenario-sea',
      title: 'Southeast Asia Backpacking',
      description: 'Explore vibrant food markets, lush rainforests, and tropical islands. Common hazards include stomach bugs (travelers diarrhea), severe mosquito bite swelling, minor coral scrapes, and extreme humidity dehydration.',
      riskLevel: 'High',
      region: 'Thailand, Vietnam, Bali, Philippines',
      medicinesList: [
        'Diarrhea Shield (Loperamide)',
        'Bismuth Relief Caplets',
        'Hydration Recovery Salts',
        'Antiseptic Healing Ointment',
        'Medical Alcohol Wipes'
      ],
      instructions: 'Always use bottled water to brush teeth. Drink ORS daily in extreme heat. Apply antiseptic immediately to coral scrapes to prevent tropical infections.',
      icon: 'Palmtree',
      image: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&q=80&w=600&h=400'
    },
    {
      id: 'scenario-europe',
      title: 'European City Breaks',
      description: 'Wander historic cobblestones, art museums, and local bistros. Common issues are intense muscle soreness from long walking days, flight-induced sinus blockages, and seasonal pollen allergies from park visits.',
      riskLevel: 'Low',
      region: 'Italy, France, United Kingdom, Spain',
      medicinesList: [
        'Travel-Acetaminophen',
        'Travel-Ibuprofen',
        'Allergy Shield (Cetirizine)',
        'Sinus Decongestant'
      ],
      instructions: 'Take Cetirizine in the morning to block local pollen. Use sinus decongestant 30 minutes before flight descent to alleviate cabin ear pressure.',
      icon: 'Compass',
      image: 'https://images.unsplash.com/photo-1486299267070-83823f5448dd?auto=format&fit=crop&q=80&w=600&h=400'
    },
    {
      id: 'scenario-adventure',
      title: 'High Altitude & Outdoor Adventure',
      description: 'Hike high-altitude passes, camp in national parks, or raft white waters. Hazards include muscle sprains, deep scrapes, altitude headaches, and sunburn or windburn rashes.',
      riskLevel: 'Medium',
      region: 'Peru (Inca Trail), Nepal, Alps, Rocky Mountains',
      medicinesList: [
        'Travel-Ibuprofen',
        'Hydration Recovery Salts',
        'Hydrocortisone 1% Cream',
        'Antiseptic Healing Ointment',
        'Travel-Acetaminophen'
      ],
      instructions: 'Take Ibuprofen at the first sign of altitude headache to reduce cerebral vascular inflammation. Drink rehydration salts throughout the climb.',
      icon: 'Mountain',
      image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=600&h=400'
    },
    {
      id: 'scenario-latam',
      title: 'Central & South America Expeditions',
      description: 'Journey from high volcanic peaks to coastal surf towns. Common issues involve acute digestive adjustive stress, severe tropical insect bites, and minor cuts.',
      riskLevel: 'High',
      region: 'Mexico, Costa Rica, Peru, Brazil',
      medicinesList: [
        'Diarrhea Shield (Loperamide)',
        'Bismuth Relief Caplets',
        'Hydrocortisone 1% Cream',
        'Medical Alcohol Wipes'
      ],
      instructions: 'Apply Hydrocortisone cream immediately to insect bites to prevent excessive scratching and secondary skin infections. Keep bismuth tablets close during dining.',
      icon: 'Sun',
      image: 'https://images.unsplash.com/photo-1512813583145-baaa340ef29f?auto=format&fit=crop&q=80&w=600&h=400'
    }
  ];

  for (const scen of scenariosData) {
    await prisma.travelScenario.upsert({
      where: { id: scen.id },
      update: scen,
      create: scen
    });
  }
  console.log(`Seeded ${scenariosData.length} travel scenarios.`);

  // 5. Seed Testimonials
  const testimonialsData = [
    {
      id: 'test-1',
      name: 'Sarah Jenkins',
      location: 'New York, USA',
      tripType: '2 Weeks in Bali',
      quote: 'My husband got the infamous Bali Belly on day 3. Having the Travel Med kit in our hotel room saved us a trip to the local clinic. The color-coded diarrhea guide was foolproof, and we were back on the beach by the next afternoon!',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
      id: 'test-2',
      name: 'David Chen',
      location: 'San Francisco, USA',
      tripType: 'Trekking in Peru',
      quote: 'At 11,000 feet, I got a pounding headache and stomach nausea. I popped the Travel-Ibuprofen and mixed the rehydration salts. Within an hour, I felt stable enough to finish the day. This kit is literally a lifesaver for outdoor treks.',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
      id: 'test-3',
      name: 'Emma Watson-Smith',
      location: 'London, UK',
      tripType: 'Southeast Asia Backpacking',
      quote: 'I scratched my ankle on coral while snorkeling. I cleaned it with the alcohol wipes, applied the triple antibiotic ointment, and taped a waterproof dressing. It healed beautifully without any of the tropical infections my friends suffered.',
      rating: 5.0,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150&h=150'
    },
    {
      id: 'test-4',
      name: 'Carlos Ruiz',
      location: 'Madrid, Spain',
      tripType: 'Business in Tokyo & Kyoto',
      quote: 'Adjusting to the flights and time difference was rough, but having the sinus decongestant saved my ears during the descent. The teleconsultation doctor (Dr. Kenji) was incredibly helpful in verifying imports beforehand.',
      rating: 4.8,
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=150&h=150'
    }
  ];

  for (const test of testimonialsData) {
    await prisma.testimonial.upsert({
      where: { id: test.id },
      update: test,
      create: test
    });
  }
  console.log(`Seeded ${testimonialsData.length} testimonials.`);

  console.log('Database seeding completed successfully! 🎉');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
