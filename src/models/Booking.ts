export type BookingStatus = 'upcoming' | 'completed' | 'cancelled';

export type BookingCategory =
  | 'Consultation'
  | 'Health & Wellness'
  | 'Home Services'
  | 'Creative & Design'
  | 'Technical Support'
  | 'Legal & Finance';

export interface Booking {
  id: string;
  title: string;
  serviceCategory: BookingCategory;
  providerName: string;
  providerAvatar?: string;
  date: string; // ISO date or 'YYYY-MM-DD'
  time: string; // e.g. '10:30 AM'
  durationMinutes: number;
  price: number;
  currency: string;
  location: string;
  status: BookingStatus;
  notes?: string;
  createdAt: string;
}

export interface CreateBookingDTO {
  title: string;
  serviceCategory: BookingCategory;
  providerName: string;
  date: string;
  time: string;
  durationMinutes: number;
  price: number;
  location: string;
  notes?: string;
}
