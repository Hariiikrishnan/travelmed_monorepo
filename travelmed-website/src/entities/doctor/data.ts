import { Doctor } from '@/types';

export const doctors: Doctor[] = [
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
