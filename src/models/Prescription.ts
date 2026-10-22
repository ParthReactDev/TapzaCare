export type TimeOfDay = 'morning' | 'afternoon' | 'night';

export interface DoseSlot {
  id: string;
  timeOfDay: TimeOfDay;
  scheduledTime: string; // e.g. "08:30 AM"
  taken: boolean;
  takenAt?: string;
}

export interface Medicine {
  id: string;
  name: string;
  dosage: string; // e.g. "500 mg" or "1 tablet"
  frequency: string; // e.g. "1-0-1" or "Twice daily"
  instructions: string; // "After food", "Before meal"
  remainingDays: number;
  doses: DoseSlot[];
}

export interface Prescription {
  id: string;
  doctorName: string;
  doctorSpecialty: string;
  hospitalOrClinic: string;
  diagnosis: string;
  date: string;
  expiryDate: string;
  medicines: Medicine[];
  doctorAvatar: string;
  notes?: string;
}
