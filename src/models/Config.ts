export type SectionType =
  | 'hero_banner'
  | 'category_chips'
  | 'quick_actions'
  | 'service_grid'
  | 'doctor_carousel'
  | 'offer_strip'
  | string; // Allows unknown types gracefully

export interface SolidBackground {
  type: 'solid';
  color: string;
}

export interface GradientBackground {
  type: 'gradient';
  colors: [string, string];
}

export interface ImageBackground {
  type: 'image';
  uri: string;
  overlay?: string;
}

export type SectionBackground = SolidBackground | GradientBackground | ImageBackground;

export interface HeroBannerData {
  greeting: string;
  headline: string;
  subtext: string;
  badge?: string;
  ctaText?: string;
  bannerImage?: string;
  accentColor?: string;
}

export interface CategoryChipItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
}

export interface CategoryChipsData {
  items: CategoryChipItem[];
  selectedId?: string;
}

export interface QuickActionTile {
  id: string;
  title: string;
  icon: string;
  badge?: string;
  actionRoute: 'BookingsTab' | 'PrescriptionsTab' | 'RemindersTab' | 'Family';
  tintColor: string;
}

export interface QuickActionsData {
  tiles: QuickActionTile[];
}

export interface ServiceGridItem {
  id: string;
  name: string;
  category: string;
  price: number; // in Rupees
  originalPrice?: number;
  duration: string;
  rating: number;
  badge?: string;
  image: string;
}

export interface ServiceGridData {
  columns: 2 | 3;
  items: ServiceGridItem[];
}

export interface DoctorSlot {
  time: string;
  available: boolean;
}

export interface DoctorCardItem {
  id: string;
  name: string;
  specialty: string;
  experienceYears: number;
  rating: number;
  consultationFee: number; // in Rupees
  nextAvailableSlot: string;
  photo: string;
  isAvailableToday: boolean;
}

export interface DoctorCarouselData {
  doctors: DoctorCardItem[];
}

export interface OfferStripData {
  message: string;
  code?: string;
  actionText?: string;
  bgColor: string;
  textColor: string;
  icon?: string;
}

export interface HomeSection {
  id: string;
  type: SectionType;
  title?: string;
  subtitle?: string;
  background: SectionBackground;
  data: any;
}

export interface ThemeColors {
  primary: string;
  primaryLight: string;
  primaryDark: string;
  accent: string;
  background: string;
  surface: string;
  surfaceBorder: string;
  textPrimary: string;
  textSecondary: string;
  textInverse: string;
  bannerBg: string;
  statusChipBg: string;
}

export interface AppConfig {
  configId: 'normal' | 'festival_diwali';
  version: string;
  name: string;
  tagline: string;
  theme: ThemeColors;
  sections: HomeSection[];
}
