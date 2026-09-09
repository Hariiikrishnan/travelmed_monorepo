export interface Medicine {
  id: string;
  name: string;
  category: 'Pain Relief' | 'Digestion' | 'Allergies' | 'Wound Care' | 'Respiratory' | 'Anti-Infectives' | 'First Aid';
  description: string;
  activeIngredient: string;
  dosage: string;
  warning: string;
  sideEffects: string;
  fdaStatus: string;
  travelNote: string;
  compartment: 'A' | 'B' | 'C' | 'First Aid Pouch';
  alternative: string;
  symptoms: string[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  languages: string[];
  experience: string;
  bio: string;
  rating: number;
  reviewsCount: number;
  availability: string;
  image: string;
  videoSimulatedUrl: string;
}

export interface Testimonial {
  id: string;
  name: string;
  location: string;
  tripType: string;
  quote: string;
  rating: number;
  avatar: string;
}

export interface TravelScenario {
  id: string;
  title: string;
  description: string;
  riskLevel: 'Low' | 'Medium' | 'High';
  region: string;
  medicinesList: string[];
  instructions: string;
  icon: string;
  image: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  type: 'kit' | 'addon';
  description?: string;
  options?: {
    size?: 'Solo' | 'Couple' | 'Family';
    pediatricAddon?: boolean;
    seniorAddon?: boolean;
  };
}

export interface Order {
  orderId: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Out for Delivery' | 'Delivered' | 'Cancelled' | 'Refunded';
  trackingNumber: string;
  estimatedDelivery: string;
  items: CartItem[];
  subtotal: number;
  shippingCost: number;
  total: number;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
}
