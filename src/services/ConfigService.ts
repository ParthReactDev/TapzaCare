import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppConfig, HomeSection, ThemeColors } from '../models/Config';

const CACHE_KEY = '@tapza_cached_config';
const SIMULATION_KEY = '@tapza_simulation_settings';

export interface SimulationSettings {
  latencyMs: number;
  simulateFailure: boolean;
  simulateEmpty: boolean;
  activeConfigId: 'normal' | 'festival_diwali';
}

const DEFAULT_SIMULATION: SimulationSettings = {
  latencyMs: 500,
  simulateFailure: false,
  simulateEmpty: false,
  activeConfigId: 'normal',
};

// --- CONFIG 1: NORMAL DAY ---
const NORMAL_THEME: ThemeColors = {
  primary: '#0D9488', // Teal 600
  primaryLight: '#2DD4BF',
  primaryDark: '#115E59',
  accent: '#6366F1', // Indigo
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceBorder: '#E2E8F0',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textInverse: '#FFFFFF',
  bannerBg: '#042F2E',
  statusChipBg: '#CCFBF1',
};

const NORMAL_SECTIONS: HomeSection[] = [
  {
    id: 'sec-hero-normal',
    type: 'hero_banner',
    background: {
      type: 'gradient',
      colors: ['#042F2E', '#0F766E'],
    },
    data: {
      greeting: 'Good Day, Alex 👋',
      headline: 'Instant Care & Doctors at Your Doorstep',
      subtext: 'Get verified specialist consults & lab samples in 10 minutes.',
      badge: 'VERIFIED HEALTHCARE',
      ctaText: 'Find Doctors',
      bannerImage: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=500',
      accentColor: '#2DD4BF',
    },
  },
  {
    id: 'sec-offer-normal',
    type: 'offer_strip',
    background: {
      type: 'solid',
      color: '#F0FDFA',
    },
    data: {
      icon: '🛡️',
      message: 'Comprehensive Full-Body Health Checkup at Flat 20% OFF',
      code: 'HEALTH20',
      actionText: 'Claim Now',
      bgColor: '#CCFBF1',
      textColor: '#0F766E',
    },
  },
  {
    id: 'sec-quick-actions-normal',
    type: 'quick_actions',
    title: 'Instant Access',
    subtitle: 'Tap to access your health tools',
    background: {
      type: 'solid',
      color: '#FFFFFF',
    },
    data: {
      tiles: [
        {
          id: 'qa-book',
          title: 'Book Doctor',
          icon: '🩺',
          badge: 'Online',
          actionRoute: 'BookingsTab',
          tintColor: '#0D9488',
        },
        {
          id: 'qa-prescriptions',
          title: 'Prescriptions',
          icon: '💊',
          badge: 'Active',
          actionRoute: 'PrescriptionsTab',
          tintColor: '#6366F1',
        },
        {
          id: 'qa-reminders',
          title: 'Dose Alerts',
          icon: '🔔',
          actionRoute: 'RemindersTab',
          tintColor: '#EA580C',
        },
        {
          id: 'qa-family',
          title: 'Family Care',
          icon: '👨‍👩‍👧',
          actionRoute: 'Family',
          tintColor: '#E11D48',
        },
      ],
    },
  },
  {
    id: 'sec-chips-normal',
    type: 'category_chips',
    title: 'Explore Services',
    subtitle: 'Select a clinical category',
    background: {
      type: 'solid',
      color: '#F8FAFC',
    },
    data: {
      items: [
        { id: 'cat-all', label: 'All Services', icon: '✨' },
        { id: 'cat-consult', label: 'Consult', icon: '👨‍⚕️' },
        { id: 'cat-lab', label: 'Lab Tests', icon: '🔬', badge: 'Fast' },
        { id: 'cat-pharmacy', label: 'Pharmacy', icon: '💊' },
        { id: 'cat-vaccines', label: 'Vaccines', icon: '💉' },
        { id: 'cat-physio', label: 'Physiotherapy', icon: '🧘' },
        { id: 'cat-dental', label: 'Dental Care', icon: '🦷' },
      ],
    },
  },
  {
    id: 'sec-doctors-normal',
    type: 'doctor_carousel',
    title: 'Top Specialists Available Today',
    subtitle: 'Instant video or clinic visits in under 30 mins',
    background: {
      type: 'gradient',
      colors: ['#F8FAFC', '#F0FDFA'],
    },
    data: {
      doctors: [
        {
          id: 'doc-1',
          name: 'Dr. Priya Sharma',
          specialty: 'Senior Cardiologist (AIIMS)',
          experienceYears: 14,
          rating: 4.9,
          consultationFee: 799,
          nextAvailableSlot: 'Today, 10:30 AM',
          photo: 'https://images.unsplash.com/photo-1594824813589-77579626e257?w=200',
          isAvailableToday: true,
        },
        {
          id: 'doc-2',
          name: 'Dr. Rajesh Nair',
          specialty: 'Pediatric Specialist',
          experienceYears: 10,
          rating: 4.8,
          consultationFee: 599,
          nextAvailableSlot: 'Today, 11:15 AM',
          photo: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200',
          isAvailableToday: true,
        },
        {
          id: 'doc-3',
          name: 'Dr. Ananya Sen',
          specialty: 'Clinical Dermatologist',
          experienceYears: 8,
          rating: 4.9,
          consultationFee: 650,
          nextAvailableSlot: 'Today, 02:00 PM',
          photo: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200',
          isAvailableToday: true,
        },
        {
          id: 'doc-4',
          name: 'Dr. Vikram Malhotra',
          specialty: 'Orthopedic Consultant',
          experienceYears: 16,
          rating: 4.7,
          consultationFee: 850,
          nextAvailableSlot: 'Today, 04:30 PM',
          photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200',
          isAvailableToday: true,
        },
      ],
    },
  },
  {
    id: 'sec-services-normal',
    type: 'service_grid',
    title: 'Popular Health Services',
    subtitle: 'Certified at-home collections & consultations',
    background: {
      type: 'solid',
      color: '#FFFFFF',
    },
    data: {
      columns: 2,
      items: [
        {
          id: 'srv-1',
          name: 'Comprehensive Blood Profile',
          category: 'Diagnostics',
          price: 799,
          originalPrice: 1499,
          duration: '60 mins',
          rating: 4.9,
          badge: 'BESTSELLER',
          image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300',
        },
        {
          id: 'srv-2',
          name: 'General Physician Video Call',
          category: 'Consultation',
          price: 499,
          originalPrice: 799,
          duration: '20 mins',
          rating: 4.8,
          badge: 'INSTANT',
          image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=300',
        },
        {
          id: 'srv-3',
          name: 'Diabetes & HbA1c Package',
          category: 'Screening',
          price: 599,
          originalPrice: 999,
          duration: 'At Home',
          rating: 4.7,
          badge: 'TOP RATED',
          image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=300',
        },
        {
          id: 'srv-4',
          name: 'Advanced Dental Hygiene & Polish',
          category: 'Dental Clinic',
          price: 1199,
          originalPrice: 1800,
          duration: '45 mins',
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?w=300',
        },
      ],
    },
  },
  // Intentional unknown section to test requirement: "An unknown section type must render nothing and never crash"
  {
    id: 'sec-quantum-teleport-unknown',
    type: 'unknown_teleportation_pod',
    background: {
      type: 'solid',
      color: '#000000',
    },
    data: {
      mystery: 'This should safely not render and not crash',
    },
  },
];

export const NORMAL_CONFIG: AppConfig = {
  configId: 'normal',
  version: '2.4.0',
  name: 'Standard Care Mode',
  tagline: 'Modern everyday clinical care',
  theme: NORMAL_THEME,
  sections: NORMAL_SECTIONS,
};

// --- CONFIG 2: FESTIVAL DAY (DIWALI WELLNESS DHAMAKA) ---
const DIWALI_THEME: ThemeColors = {
  primary: '#EA580C', // Festive Saffron
  primaryLight: '#FB923C',
  primaryDark: '#9A3412',
  accent: '#D97706', // Warm Gold
  background: '#FFFBEB', // Light amber background
  surface: '#FFFFFF',
  surfaceBorder: '#FDE68A',
  textPrimary: '#451A03',
  textSecondary: '#92400E',
  textInverse: '#FFFFFF',
  bannerBg: '#7C2D12',
  statusChipBg: '#FEF3C7',
};

const DIWALI_SECTIONS: HomeSection[] = [
  // Notice: Different order! Offer strip at very top, festive hero banner, 3-column service grid first!
  {
    id: 'sec-offer-diwali',
    type: 'offer_strip',
    background: {
      type: 'gradient',
      colors: ['#D97706', '#EA580C'],
    },
    data: {
      icon: '🪔',
      message: 'DIWALI WELLNESS DHAMAKA: Flat 50% OFF + Free Family Consults!',
      code: 'DIWALI50',
      actionText: 'Unlock Deal',
      bgColor: '#FEF3C7',
      textColor: '#7C2D12',
    },
  },
  {
    id: 'sec-hero-diwali',
    type: 'hero_banner',
    background: {
      type: 'gradient',
      colors: ['#7C2D12', '#9A3412'],
    },
    data: {
      greeting: 'Happy Diwali, Alex! 🪔✨',
      headline: 'Light Up Your Health & Family Wellness',
      subtext: 'Celebrate with zero-worry festive detox, pollution defense & 24x7 doctor support.',
      badge: 'FESTIVE SPECIAL',
      ctaText: 'Claim Festive Pass',
      bannerImage: 'https://images.unsplash.com/photo-1605379399642-870262d3d051?w=500',
      accentColor: '#FBBF24',
    },
  },
  {
    id: 'sec-quick-actions-diwali',
    type: 'quick_actions',
    title: 'Festive Essentials',
    subtitle: 'Speedy bookings & medicine refills for the holiday',
    background: {
      type: 'solid',
      color: '#FFFFFF',
    },
    data: {
      tiles: [
        {
          id: 'qa-diwali-book',
          title: 'Book Doc',
          icon: '🪔',
          badge: 'Flat 50%',
          actionRoute: 'BookingsTab',
          tintColor: '#EA580C',
        },
        {
          id: 'qa-diwali-rx',
          title: 'Prescriptions',
          icon: '💊',
          badge: 'Refill',
          actionRoute: 'PrescriptionsTab',
          tintColor: '#D97706',
        },
        {
          id: 'qa-diwali-remind',
          title: 'Dose Alerts',
          icon: '⏰',
          actionRoute: 'RemindersTab',
          tintColor: '#B45309',
        },
        {
          id: 'qa-diwali-family',
          title: 'Gift Health',
          icon: '🎁',
          badge: 'Free VIP',
          actionRoute: 'Family',
          tintColor: '#7C2D12',
        },
      ],
    },
  },
  {
    id: 'sec-services-diwali',
    type: 'service_grid',
    title: 'Festive Care Packages (3-Column)',
    subtitle: 'Curated wellness packages for Diwali celebrations',
    background: {
      type: 'solid',
      color: '#FEF3C7',
    },
    data: {
      columns: 3, // Shows dynamic 3-column layout!
      items: [
        {
          id: 'srv-diwali-1',
          name: 'Festive Detox Cleanse',
          category: 'Detox',
          price: 999,
          originalPrice: 1999,
          duration: 'Full Body',
          rating: 5.0,
          badge: '50% OFF',
          image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=300',
        },
        {
          id: 'srv-diwali-2',
          name: 'Air Pollution Lung Check',
          category: 'Pulmonology',
          price: 849,
          originalPrice: 1500,
          duration: '30 mins',
          rating: 4.9,
          badge: 'ESSENTIAL',
          image: 'https://images.unsplash.com/photo-1584362917165-526a968579e8?w=300',
        },
        {
          id: 'srv-diwali-3',
          name: 'Sweet Tooth Glucose Test',
          category: 'Sugar Check',
          price: 349,
          originalPrice: 699,
          duration: 'At Home',
          rating: 4.8,
          badge: 'FESTIVE',
          image: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=300',
        },
      ],
    },
  },
  {
    id: 'sec-doctors-diwali',
    type: 'doctor_carousel',
    title: 'On-Call Doctors This Diwali',
    subtitle: 'Available right through the festive weekend',
    background: {
      type: 'gradient',
      colors: ['#FFFBEB', '#FDE68A'],
    },
    data: {
      doctors: [
        {
          id: 'doc-diwali-1',
          name: 'Dr. Priya Sharma',
          specialty: 'Cardiac Wellness Lead',
          experienceYears: 14,
          rating: 5.0,
          consultationFee: 499, // discounted!
          nextAvailableSlot: 'Diwali Morning, 09:30 AM',
          photo: 'https://images.unsplash.com/photo-1594824813589-77579626e257?w=200',
          isAvailableToday: true,
        },
        {
          id: 'doc-diwali-2',
          name: 'Dr. Sameer Kapoor',
          specialty: 'Emergency Medicine & Burns',
          experienceYears: 12,
          rating: 4.9,
          consultationFee: 450,
          nextAvailableSlot: 'Today, Available Now',
          photo: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=200',
          isAvailableToday: true,
        },
      ],
    },
  },
  {
    id: 'sec-chips-diwali',
    type: 'category_chips',
    title: 'Diwali Health Categories',
    background: {
      type: 'solid',
      color: '#FFFFFF',
    },
    data: {
      items: [
        { id: 'cat-d1', label: 'Diwali Offers', icon: '🪔', badge: 'Hot' },
        { id: 'cat-d2', label: 'Lungs & Smoke', icon: '🫁' },
        { id: 'cat-d3', label: 'Digestive Care', icon: '🍵' },
        { id: 'cat-d4', label: 'Eye Irritation', icon: '👁️' },
        { id: 'cat-d5', label: 'Burn Care Kit', icon: '🩹' },
      ],
    },
  },
];

export const DIWALI_CONFIG: AppConfig = {
  configId: 'festival_diwali',
  version: '2.4.0-diwali',
  name: 'Diwali Dhamaka Mode',
  tagline: 'Festive wellness, discounts & warmth',
  theme: DIWALI_THEME,
  sections: DIWALI_SECTIONS,
};

type ConfigSubscriber = (config: AppConfig) => void;
type SimulationSubscriber = (settings: SimulationSettings) => void;

class ConfigService {
  private currentConfig: AppConfig = NORMAL_CONFIG;
  private settings: SimulationSettings = { ...DEFAULT_SIMULATION };
  private configSubscribers: Set<ConfigSubscriber> = new Set();
  private simSubscribers: Set<SimulationSubscriber> = new Set();
  private isInitialized = false;

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const savedSim = await AsyncStorage.getItem(SIMULATION_KEY);
      if (savedSim) {
        this.settings = JSON.parse(savedSim);
      }
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        this.currentConfig = JSON.parse(cached);
      } else {
        this.currentConfig =
          this.settings.activeConfigId === 'festival_diwali'
            ? DIWALI_CONFIG
            : NORMAL_CONFIG;
      }
    } catch {
      // Fallback
      this.currentConfig = NORMAL_CONFIG;
    } finally {
      this.isInitialized = true;
      this.notifyConfig();
      this.notifySim();
    }
  }

  public subscribeConfig(sub: ConfigSubscriber): () => void {
    this.configSubscribers.add(sub);
    sub(this.currentConfig);
    return () => this.configSubscribers.delete(sub);
  }

  public subscribeSimulation(sub: SimulationSubscriber): () => void {
    this.simSubscribers.add(sub);
    sub(this.settings);
    return () => this.simSubscribers.delete(sub);
  }

  private notifyConfig() {
    this.configSubscribers.forEach((fn) => fn(this.currentConfig));
  }

  private notifySim() {
    this.simSubscribers.forEach((fn) => fn({ ...this.settings }));
  }

  public getSettings(): SimulationSettings {
    return { ...this.settings };
  }

  public async updateSimulation(partial: Partial<SimulationSettings>) {
    this.settings = { ...this.settings, ...partial };
    await AsyncStorage.setItem(SIMULATION_KEY, JSON.stringify(this.settings));
    this.notifySim();

    // If activeConfigId changed, re-fetch config
    if (partial.activeConfigId) {
      await this.fetchConfig(true);
    }
  }

  /**
   * GET /config
   * Simulates network latency, handles failure with cache recovery,
   * handles empty simulation, and saves successful config to cache.
   */
  public async fetchConfig(forceRefresh = false): Promise<AppConfig> {
    // 1. Simulate Latency
    if (this.settings.latencyMs > 0) {
      await new Promise((resolve) =>
        setTimeout(() => resolve(null), this.settings.latencyMs)
      );
    }

    // 2. Simulate Failure
    if (this.settings.simulateFailure) {
      // Try to recover from cached last good config!
      try {
        const cached = await AsyncStorage.getItem(CACHE_KEY);
        if (cached) {
          const cachedConfig = JSON.parse(cached);
          this.currentConfig = cachedConfig;
          this.notifyConfig();
          throw new Error(
            'Network request failed: Served last good cached config'
          );
        }
      } catch (err: any) {
        if (err.message.includes('Served last good')) throw err;
      }
      throw new Error('GET /config failed: Unable to connect to host');
    }

    // 3. Simulate Empty Content
    if (this.settings.simulateEmpty) {
      const emptyConfig: AppConfig = {
        ...this.currentConfig,
        sections: [],
      };
      this.currentConfig = emptyConfig;
      this.notifyConfig();
      return emptyConfig;
    }

    // 4. Normal vs Festival resolution
    const targetConfig =
      this.settings.activeConfigId === 'festival_diwali'
        ? DIWALI_CONFIG
        : NORMAL_CONFIG;

    this.currentConfig = targetConfig;
    // Cache last good config
    try {
      await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(targetConfig));
    } catch {
      // ignore
    }

    this.notifyConfig();
    return targetConfig;
  }

  public getCurrentConfig(): AppConfig {
    return this.currentConfig;
  }
}

export const configService = new ConfigService();
