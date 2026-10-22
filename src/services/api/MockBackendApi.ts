import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  BookingPayload,
  BookingResponse,
  Doctor,
  LayoutConfig,
  Prescription,
  Slot,
} from '../../models/BackendApi';

const CONFIG_CACHE_KEY = '@tapza_backend_cached_config';
const SIM_SETTINGS_KEY = '@tapza_backend_sim_settings';

export interface BackendSimSettings {
  latencyMs: number;
  simulate500Error: boolean;
  simulateSlotConflict409: boolean;
  simulateEmptyConfig: boolean;
  activeConfigMode: 'normal' | 'festival_diwali';
}

const DEFAULT_SIM: BackendSimSettings = {
  latencyMs: 400,
  simulate500Error: false,
  simulateSlotConflict409: false,
  simulateEmptyConfig: false,
  activeConfigMode: 'normal',
};

// ==========================================
// REALISTIC INDIAN DATA (Hyderabad & Vijayawada)
// ==========================================

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc-hyd-1',
    name: 'Dr. K. S. Rao',
    specialty: 'Senior Interventional Cardiologist',
    photoUrl: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300',
    feeInr: 799,
    languages: ['Telugu', 'English', 'Hindi'],
    clinicName: 'Apollo Hospitals, Jubilee Hills',
    location: 'Road No. 72, Jubilee Hills, Hyderabad',
    rating: 4.9,
    experienceYears: 18,
  },
  {
    id: 'doc-hyd-2',
    name: 'Dr. Ananya Reddy',
    specialty: 'Clinical & Cosmetic Dermatologist',
    photoUrl: 'https://images.unsplash.com/photo-1594824813589-77579626e257?w=300',
    feeInr: 650,
    languages: ['Telugu', 'English'],
    clinicName: 'KIMS Hospital, Gachibowli',
    location: 'Near Bio-Diversity Park, Gachibowli, Hyderabad',
    rating: 4.8,
    experienceYears: 10,
  },
  {
    id: 'doc-vja-3',
    name: 'Dr. Venkat Ramana',
    specialty: 'Consultant Orthopedic & Joint Specialist',
    photoUrl: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=300',
    feeInr: 800,
    languages: ['Telugu', 'English'],
    clinicName: 'Manipal Hospital, Benz Circle',
    location: 'M.G. Road, Benz Circle, Vijayawada',
    rating: 4.9,
    experienceYears: 16,
  },
  {
    id: 'doc-hyd-4',
    name: 'Dr. Sandhya Swamy',
    specialty: 'Senior Pediatrician & Child Health Specialist',
    photoUrl: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=300',
    feeInr: 599,
    languages: ['Telugu', 'Hindi', 'English'],
    clinicName: "Rainbow Children's Hospital",
    location: 'Road No. 2, Banjara Hills, Hyderabad',
    rating: 4.9,
    experienceYears: 14,
  },
  {
    id: 'doc-hyd-5',
    name: 'Dr. Mohammed Imran',
    specialty: 'General Physician & Diabetologist',
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300',
    feeInr: 499,
    languages: ['Urdu', 'Telugu', 'Hindi', 'English'],
    clinicName: 'Care Hospital, Nampally',
    location: 'Exhibition Grounds Road, Nampally, Hyderabad',
    rating: 4.7,
    experienceYears: 12,
  },
];

// ==========================================
// 1. NORMAL DAY LAYOUT CONFIG (Hyderabad Everyday Care)
// ==========================================
export const NORMAL_LAYOUT_CONFIG: LayoutConfig = {
  version: 1,
  theme: {
    primary: '#0D9488', // Emerald Teal
    secondary: '#00CEC9',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    accent: '#6366F1',
  },
  tabs: [
    { id: 'tab-1', label: 'Home', icon: '🏠', screen: 'home' },
    { id: 'tab-2', label: 'Bookings', icon: '📅', screen: 'bookings' },
    { id: 'tab-3', label: 'Medicines', icon: '💊', screen: 'prescriptions' },
    { id: 'tab-4', label: 'Reminders', icon: '🔔', screen: 'profile' },
  ],
  sections: [
    {
      id: 'sec-hero-normal',
      type: 'hero_banner',
      background: {
        kind: 'gradient',
        value: '#042F2E,#0F766E',
      },
      title: 'Welcome to Tapza Health',
      items: [
        {
          greeting: 'Namaskaram, Alex 👋',
          headline: 'Top Hyderabad & Vijayawada Doctors in 10 Mins',
          subtext: 'Apollo, KIMS, & Rainbow verified specialists at clinic or video.',
          badge: 'HYD & VJA NETWORK',
          ctaText: 'Consult Specialist',
          accentColor: '#2DD4BF',
        },
      ],
    },
    {
      id: 'sec-offer-normal',
      type: 'offer_strip',
      background: {
        kind: 'color',
        value: '#F0FDFA',
      },
      items: [
        {
          icon: '🛡️',
          message: 'Full Body Health Screening in Hyderabad at Flat 20% OFF',
          code: 'HYDHEALTH20',
          actionText: 'Book Now',
          textColor: '#0F766E',
        },
      ],
    },
    {
      id: 'sec-quick-actions-normal',
      type: 'quick_actions',
      background: {
        kind: 'color',
        value: '#FFFFFF',
      },
      title: 'Instant Healthcare Actions',
      items: [
        {
          id: 'qa-1',
          title: 'Book Doctor',
          icon: '🩺',
          badge: 'Verified',
          screen: 'bookings',
          tintColor: '#0D9488',
        },
        {
          id: 'qa-2',
          title: 'Prescriptions',
          icon: '💊',
          badge: 'Dose Track',
          screen: 'prescriptions',
          tintColor: '#6366F1',
        },
        {
          id: 'qa-3',
          title: 'Reminders',
          icon: '⏰',
          screen: 'profile',
          tintColor: '#EA580C',
        },
        {
          id: 'qa-4',
          title: 'Family Care',
          icon: '👨‍👩‍👧',
          screen: 'bookings',
          tintColor: '#E11D48',
        },
      ],
    },
    {
      id: 'sec-chips-normal',
      type: 'category_chips',
      background: {
        kind: 'color',
        value: '#F8FAFC',
      },
      title: 'Explore Medical Specialties',
      items: [
        { id: 'cat-all', label: 'All Services', icon: '✨' },
        { id: 'cat-cardio', label: 'Cardiology', icon: '❤️', badge: 'Popular' },
        { id: 'cat-derma', label: 'Dermatology', icon: '✨' },
        { id: 'cat-ortho', label: 'Orthopedics', icon: '🦴' },
        { id: 'cat-pedia', label: 'Pediatrics', icon: '👶' },
        { id: 'cat-diab', label: 'Diabetes Care', icon: '🩸' },
      ],
    },
    {
      id: 'sec-doctors-normal',
      type: 'doctor_carousel',
      background: {
        kind: 'gradient',
        value: '#F8FAFC,#F0FDFA',
      },
      title: 'Verified Specialists Available Today',
      items: MOCK_DOCTORS,
    },
    {
      id: 'sec-services-normal',
      type: 'service_grid',
      background: {
        kind: 'color',
        value: '#FFFFFF',
      },
      title: 'Popular Clinic & Diagnostic Services',
      items: [
        {
          id: 'srv-1',
          name: 'Complete Hemogram (CBC + ESR)',
          category: 'Diagnostics',
          price: 499,
          originalPrice: 899,
          duration: 'Home Collection',
          rating: 4.9,
          badge: 'HYD LAB',
          image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300',
        },
        {
          id: 'srv-2',
          name: 'Apollo Heart Echo & ECG',
          category: 'Cardiology',
          price: 1199,
          originalPrice: 1800,
          duration: 'Clinic Visit',
          rating: 4.8,
          badge: 'APOLLO',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300',
        },
        {
          id: 'srv-3',
          name: 'HbA1c & Fasting Glucose Screening',
          category: 'Diabetes',
          price: 399,
          originalPrice: 650,
          duration: 'Home Collection',
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=300',
        },
        {
          id: 'srv-4',
          name: 'Orthopedic Knee Joint Assessment',
          category: 'Orthopedic',
          price: 799,
          originalPrice: 1200,
          duration: '30 mins',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=300',
        },
      ],
    },
    // Unknown section to test requirement: "unknown type -> skip"
    {
      id: 'sec-unknown-teleport',
      type: 'quantum_teleport_pod',
      background: {
        kind: 'color',
        value: '#000000',
      },
      items: [],
    },
  ],
};

// ==========================================
// 2. FESTIVAL DAY LAYOUT CONFIG (Diwali Dhamaka)
// ==========================================
export const DIWALI_LAYOUT_CONFIG: LayoutConfig = {
  version: 2,
  theme: {
    primary: '#EA580C', // Festive Deep Saffron
    secondary: '#D97706', // Warm Gold
    background: '#FFFBEB', // Light Amber surface
    surface: '#FFFFFF',
    textPrimary: '#451A03',
    textSecondary: '#92400E',
    accent: '#B45309',
    festival: {
      name: 'Diwali Dhamaka',
      greeting: 'Happy Diwali! 🪔 Deepavali Subhakankshalu',
      bannerImageUrl: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=600',
    },
  },
  tabs: [
    { id: 'tab-1', label: 'Diwali Home', icon: '🪔', screen: 'home' },
    { id: 'tab-2', label: 'Bookings', icon: '📅', screen: 'bookings' },
    { id: 'tab-3', label: 'Medicines', icon: '💊', screen: 'prescriptions' },
    { id: 'tab-4', label: 'Reminders', icon: '🔔', screen: 'profile' },
  ],
  sections: [
    // Different order: Offer strip at top!
    {
      id: 'sec-offer-diwali',
      type: 'offer_strip',
      background: {
        kind: 'gradient',
        value: '#D97706,#EA580C',
      },
      items: [
        {
          icon: '🪔',
          message: 'DIWALI HEALTH DHAMAKA: Flat 50% OFF at Hyderabad & Vijayawada Clinics!',
          code: 'DIWALI50',
          actionText: 'Claim Deal',
          textColor: '#7C2D12',
        },
      ],
    },
    {
      id: 'sec-hero-diwali',
      type: 'hero_banner',
      background: {
        kind: 'gradient',
        value: '#7C2D12,#9A3412',
      },
      title: 'Diwali Wellness Dhamaka',
      items: [
        {
          greeting: 'Happy Diwali! 🪔 Deepavali Subhakankshalu',
          headline: 'Light Up Your Family Health & Happiness',
          subtext: 'Special festive sweet detox, pollution lung defense & 24x7 doctor support.',
          badge: 'FESTIVAL SPECIAL',
          ctaText: 'Book Festive Health Pass',
          accentColor: '#FBBF24',
        },
      ],
    },
    {
      id: 'sec-quick-actions-diwali',
      type: 'quick_actions',
      background: {
        kind: 'color',
        value: '#FFFFFF',
      },
      title: 'Diwali Emergency & Care',
      items: [
        {
          id: 'qa-d1',
          title: 'Book Doc',
          icon: '🪔',
          badge: '50% Off',
          screen: 'bookings',
          tintColor: '#EA580C',
        },
        {
          id: 'qa-d2',
          title: 'Prescriptions',
          icon: '💊',
          badge: 'Refill',
          screen: 'prescriptions',
          tintColor: '#D97706',
        },
        {
          id: 'qa-d3',
          title: 'Dose Alerts',
          icon: '⏰',
          screen: 'profile',
          tintColor: '#B45309',
        },
        {
          id: 'qa-d4',
          title: 'Diwali Gift Card',
          icon: '🎁',
          badge: 'Gift Health',
          screen: 'bookings',
          tintColor: '#7C2D12',
        },
      ],
    },
    {
      id: 'sec-services-diwali',
      type: 'service_grid',
      background: {
        kind: 'color',
        value: '#FEF3C7',
      },
      title: 'Diwali Health Packages (3 Columns)',
      items: [
        {
          id: 'srv-d1',
          name: 'Festive Sweet Sugar Check',
          category: 'Diabetes',
          price: 299,
          originalPrice: 600,
          duration: 'Home Visit',
          rating: 4.9,
          badge: '50% OFF',
          image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300',
        },
        {
          id: 'srv-d2',
          name: 'Smoke & Pollution Defense',
          category: 'Pulmonology',
          price: 699,
          originalPrice: 1400,
          duration: '30 mins',
          rating: 4.8,
          badge: 'ESSENTIAL',
          image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=300',
        },
        {
          id: 'srv-d3',
          name: 'Burn & Allergy First Aid Pack',
          category: 'Emergency',
          price: 349,
          originalPrice: 500,
          duration: 'Delivered in 15m',
          rating: 5.0,
          badge: 'INSTANT',
          image: 'https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=300',
        },
      ],
    },
    {
      id: 'sec-doctors-diwali',
      type: 'doctor_carousel',
      background: {
        kind: 'gradient',
        value: '#FFFBEB,#FDE68A',
      },
      title: 'Hyderabad Doctors On-Call This Diwali',
      items: MOCK_DOCTORS.slice(0, 3),
    },
    {
      id: 'sec-chips-diwali',
      type: 'category_chips',
      background: {
        kind: 'color',
        value: '#FFFFFF',
      },
      title: 'Festive Health Care Categories',
      items: [
        { id: 'cat-d1', label: 'Diwali Offers', icon: '🪔', badge: 'Hot' },
        { id: 'cat-d2', label: 'Smoke & Lungs', icon: '🫁' },
        { id: 'cat-d3', label: 'Digestive Detox', icon: '🍵' },
        { id: 'cat-d4', label: 'Eye Irritation', icon: '👁️' },
        { id: 'cat-d5', label: 'Burn Care Kit', icon: '🩹' },
      ],
    },
  ],
};

// ==========================================
// 3. REALISTIC INDIAN PRESCRIPTIONS (Hyderabad & Vijayawada)
// ==========================================
export const MOCK_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-hyd-101',
    issuedAt: '2026-10-20T10:30:00+05:30',
    doctorName: 'Dr. K. S. Rao',
    doctorSpecialty: 'Cardiologist',
    clinicName: 'Apollo Hospitals, Jubilee Hills, Hyderabad',
    diagnosis: 'Hypertension Stage 1 & Dyslipidemia Care',
    medicines: [
      {
        id: 'med-1',
        name: 'Telmisartan 40mg',
        dose: '1 Tablet',
        days: 30,
        timing: ['morning'],
        dosesTaken: { morning: true },
      },
      {
        id: 'med-2',
        name: 'Metformin SR 500mg',
        dose: '1 Tablet',
        days: 14,
        timing: ['morning', 'night'],
        dosesTaken: { morning: true, night: false },
      },
      {
        id: 'med-3',
        name: 'Zincovit & Multivitamin',
        dose: '1 Capsule',
        days: 30,
        timing: ['afternoon'],
        dosesTaken: { afternoon: false },
      },
    ],
  },
  {
    id: 'rx-vja-102',
    issuedAt: '2026-10-18T14:15:00+05:30',
    doctorName: 'Dr. Venkat Ramana',
    doctorSpecialty: 'Orthopedic Consultant',
    clinicName: 'Manipal Hospital, Benz Circle, Vijayawada',
    diagnosis: 'Osteoarthritis & Vitamin D Deficiency',
    medicines: [
      {
        id: 'med-4',
        name: 'Shelcal 500 (Calcium + D3)',
        dose: '1 Tablet',
        days: 60,
        timing: ['morning', 'afternoon'],
        dosesTaken: { morning: true, afternoon: false },
      },
      {
        id: 'med-5',
        name: 'Aceclofenac 100mg + Paracetamol',
        dose: '1 Tablet SOS',
        days: 5,
        timing: ['night'],
        dosesTaken: { night: false },
      },
    ],
  },
  {
    id: 'rx-hyd-103',
    issuedAt: '2026-10-22T09:00:00+05:30',
    doctorName: 'Dr. Sandhya Swamy',
    doctorSpecialty: 'Pediatric Specialist',
    clinicName: "Rainbow Children's Hospital, Banjara Hills, Hyderabad",
    diagnosis: 'Seasonal Cough & Bronchial Irritation',
    medicines: [
      {
        id: 'med-6',
        name: 'Levocetirizine 5mg',
        dose: '1 Tablet',
        days: 5,
        timing: ['night'],
        dosesTaken: { night: false },
      },
      {
        id: 'med-7',
        name: 'Ascoril D Plus Cough Syrup',
        dose: '5 ml',
        days: 5,
        timing: ['morning', 'afternoon', 'night'],
        dosesTaken: { morning: true, afternoon: false, night: false },
      },
    ],
  },
];

// ==========================================
// MOCK SLOTS REPOSITORY (with Conflict / Available states)
// ==========================================
class MockBackendApi {
  private simSettings: BackendSimSettings = { ...DEFAULT_SIM };
  private bookings: BookingResponse[] = [];
  private prescriptions: Prescription[] = [...MOCK_PRESCRIPTIONS];
  private bookedSlotIds: Set<string> = new Set(['slot-taken-example']);

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const saved = await AsyncStorage.getItem(SIM_SETTINGS_KEY);
      if (saved) {
        this.simSettings = JSON.parse(saved);
      }
    } catch {
      // ignore
    }
  }

  public getSettings(): BackendSimSettings {
    return { ...this.simSettings };
  }

  public async updateSettings(partial: Partial<BackendSimSettings>) {
    this.simSettings = { ...this.simSettings, ...partial };
    await AsyncStorage.setItem(SIM_SETTINGS_KEY, JSON.stringify(this.simSettings));
  }

  private async simulateNetworkDelay() {
    if (this.simSettings.latencyMs > 0) {
      await new Promise((res) => setTimeout(() => res(null), this.simSettings.latencyMs));
    }
  }

  // ----------------------------------------------------
  // ENDPOINT 1: GET /config -> LayoutConfig
  // ----------------------------------------------------
  public async getConfig(): Promise<LayoutConfig> {
    await this.simulateNetworkDelay();

    if (this.simSettings.simulate500Error) {
      // Try to recover from cached last good config
      try {
        const cached = await AsyncStorage.getItem(CONFIG_CACHE_KEY);
        if (cached) {
          throw new Error('500 Server Error: Served last good cached config');
        }
      } catch (err: any) {
        if (err.message.includes('Served last good')) throw err;
      }
      throw new Error('GET /config failed with 500 Internal Server Error');
    }

    if (this.simSettings.simulateEmptyConfig) {
      return {
        version: 1,
        theme: NORMAL_LAYOUT_CONFIG.theme,
        tabs: NORMAL_LAYOUT_CONFIG.tabs,
        sections: [],
      };
    }

    const config =
      this.simSettings.activeConfigMode === 'festival_diwali'
        ? DIWALI_LAYOUT_CONFIG
        : NORMAL_LAYOUT_CONFIG;

    // Cache the good config
    await AsyncStorage.setItem(CONFIG_CACHE_KEY, JSON.stringify(config));
    return config;
  }

  // ----------------------------------------------------
  // ENDPOINT 2: GET /doctors -> Doctor[]
  // ----------------------------------------------------
  public async getDoctors(): Promise<Doctor[]> {
    await this.simulateNetworkDelay();
    if (this.simSettings.simulate500Error) {
      throw new Error('GET /doctors failed: 500 Server Error');
    }
    return [...MOCK_DOCTORS];
  }

  // ----------------------------------------------------
  // ENDPOINT 3: GET /slots?doctorId=&date=YYYY-MM-DD -> Slot[]
  // ----------------------------------------------------
  public async getSlots(doctorId: string, date: string): Promise<Slot[]> {
    await this.simulateNetworkDelay();
    if (this.simSettings.simulate500Error) {
      throw new Error('GET /slots failed: 500 Server Error');
    }

    // Generate standardized realistic slots for this doctor on this date
    const slotTimes = [
      { start: '09:30 AM', end: '10:15 AM' },
      { start: '10:30 AM', end: '11:15 AM' },
      { start: '11:30 AM', end: '12:15 PM' },
      { start: '02:00 PM', end: '02:45 PM' },
      { start: '03:30 PM', end: '04:15 PM' },
      { start: '05:00 PM', end: '05:45 PM' },
      { start: '06:30 PM', end: '07:15 PM' },
    ];

    return slotTimes.map((st, i) => {
      const slotId = `slot-${doctorId}-${date}-${i}`;
      const isTaken = this.bookedSlotIds.has(slotId) || i === 2; // e.g. slot 2 is booked
      return {
        id: slotId,
        doctorId,
        startsAt: `${date} ${st.start}`,
        endsAt: `${date} ${st.end}`,
        available: !isTaken,
        date,
      };
    });
  }

  // ----------------------------------------------------
  // ENDPOINT 4: POST /bookings {doctorId, slotId} -> Booking (201) · 409 if slot taken
  // ----------------------------------------------------
  public async postBooking(payload: BookingPayload): Promise<{ status: 201; data: BookingResponse }> {
    await this.simulateNetworkDelay();

    // 1. Conflict simulation check (409)
    if (this.simSettings.simulateSlotConflict409 || this.bookedSlotIds.has(payload.slotId)) {
      const error: any = new Error(
        `409 Conflict: Slot ${payload.slotId} is already booked or taken.`
      );
      error.status = 409;
      throw error;
    }

    if (this.simSettings.simulate500Error) {
      const error: any = new Error('500 Internal Server Error: Failed to commit booking transaction.');
      error.status = 500;
      throw error;
    }

    // 2. Mark slot as taken
    this.bookedSlotIds.add(payload.slotId);

    // 3. Resolve doctor
    const doctor =
      MOCK_DOCTORS.find((d) => d.id === payload.doctorId) || MOCK_DOCTORS[0];

    const newBooking: BookingResponse = {
      id: `bkg-${Date.now()}`,
      doctorId: payload.doctorId,
      slotId: payload.slotId,
      doctor,
      slot: {
        id: payload.slotId,
        doctorId: payload.doctorId,
        startsAt: 'Today, 10:30 AM',
        endsAt: 'Today, 11:15 AM',
        available: false,
        date: new Date().toISOString().split('T')[0],
      },
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    this.bookings.push(newBooking);

    return {
      status: 201,
      data: newBooking,
    };
  }

  // ----------------------------------------------------
  // ENDPOINT 5: GET /prescriptions -> Prescription[]
  // ----------------------------------------------------
  public async getPrescriptions(): Promise<Prescription[]> {
    await this.simulateNetworkDelay();
    if (this.simSettings.simulate500Error) {
      throw new Error('GET /prescriptions failed: 500 Server Error');
    }
    return [...this.prescriptions];
  }

  // Mark a dose as taken on a prescription medicine
  public async markDoseTaken(
    prescriptionId: string,
    medicineId: string,
    timing: 'morning' | 'afternoon' | 'night'
  ): Promise<boolean> {
    const rx = this.prescriptions.find((p) => p.id === prescriptionId);
    if (!rx) return false;
    const med = rx.medicines.find((m) => m.id === medicineId);
    if (!med) return false;

    if (!med.dosesTaken) {
      med.dosesTaken = {};
    }
    med.dosesTaken[timing] = !med.dosesTaken[timing];
    this.prescriptions = [...this.prescriptions];
    return true;
  }
}

export const mockBackendApi = new MockBackendApi();
