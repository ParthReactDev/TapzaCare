export type TabScreen = 'home' | 'bookings' | 'prescriptions' | 'profile';

export interface LayoutTheme {
  primary: string;
  secondary: string;
  background: string;
  surface: string;
  textPrimary: string;
  textSecondary: string;
  accent: string;
  festival?: {
    name: string;
    greeting: string;
    bannerImageUrl: string;
  };
}

export interface LayoutTab {
  id: string;
  label: string;
  icon: string;
  screen: TabScreen;
}

export interface SectionBackground {
  kind: 'color' | 'gradient' | 'image';
  value: string;
}

export interface LayoutSection {
  id: string;
  type: string;
  background: SectionBackground;
  title?: string;
  items: unknown[];
}

export interface LayoutConfig {
  version: number;
  theme: LayoutTheme;
  tabs: LayoutTab[];
  sections: LayoutSection[];
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  photoUrl: string;
  feeInr: number;
  languages: string[];
  clinicName?: string;
  location?: string;
  rating?: number;
  experienceYears?: number;
}

export interface Slot {
  id: string;
  doctorId: string;
  startsAt: string;
  endsAt: string;
  available: boolean;
  date: string; // YYYY-MM-DD
}

export interface BookingPayload {
  doctorId: string;
  slotId: string;
  patientName?: string;
}

export interface BookingResponse {
  id: string;
  doctorId: string;
  slotId: string;
  doctor: Doctor;
  slot: Slot;
  status: 'confirmed' | 'cancelled';
  createdAt: string;
}

export interface MedicineScheduleItem {
  id: string;
  name: string;
  dose: string;
  days: number;
  timing: ('morning' | 'afternoon' | 'night')[];
  dosesTaken?: {
    morning?: boolean;
    afternoon?: boolean;
    night?: boolean;
  };
}

export interface Prescription {
  id: string;
  issuedAt: string;
  doctorName: string;
  clinicName: string;
  medicines: MedicineScheduleItem[];
  diagnosis?: string;
  doctorSpecialty?: string;
}
