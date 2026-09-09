import { TravelScenario } from '@/types';

export const travelScenarios: TravelScenario[] = [
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
