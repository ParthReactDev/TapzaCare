import AsyncStorage from '@react-native-async-storage/async-storage';
import { Prescription, TimeOfDay } from '../models/Prescription';
import { reminderService } from './ReminderService';

const PRESCRIPTIONS_STORAGE_KEY = '@tapza_prescriptions_data';

const INITIAL_PRESCRIPTIONS: Prescription[] = [
  {
    id: 'rx-101',
    doctorName: 'Dr. Priya Sharma',
    doctorSpecialty: 'Cardiology & Internal Medicine',
    hospitalOrClinic: 'Metro Heart Institute, Suite 402',
    diagnosis: 'Hypertension & Vitamin Deficiency Management',
    date: '2026-10-20',
    expiryDate: '2026-11-20',
    doctorAvatar: 'https://images.unsplash.com/photo-1594824813589-77579626e257?w=150',
    notes: 'Maintain low sodium diet, 30 min brisk walk, monitor BP twice weekly.',
    medicines: [
      {
        id: 'med-1',
        name: 'Telmisartan 40mg',
        dosage: '1 Tablet',
        frequency: 'Once Daily (Morning)',
        instructions: 'After breakfast with water',
        remainingDays: 24,
        doses: [
          {
            id: 'dose-1a',
            timeOfDay: 'morning',
            scheduledTime: '08:30 AM',
            taken: true,
            takenAt: 'Today, 08:35 AM',
          },
        ],
      },
      {
        id: 'med-2',
        name: 'Metformin SR 500mg',
        dosage: '1 Tablet',
        frequency: 'Twice Daily (Morning & Night)',
        instructions: 'Take immediately with meals',
        remainingDays: 14,
        doses: [
          {
            id: 'dose-2a',
            timeOfDay: 'morning',
            scheduledTime: '09:00 AM',
            taken: true,
            takenAt: 'Today, 09:12 AM',
          },
          {
            id: 'dose-2b',
            timeOfDay: 'night',
            scheduledTime: '09:00 PM',
            taken: false,
          },
        ],
      },
      {
        id: 'med-3',
        name: 'Multivitamin & Zinc Chelate',
        dosage: '1 Capsule',
        frequency: 'Afternoon',
        instructions: 'Post lunch',
        remainingDays: 28,
        doses: [
          {
            id: 'dose-3a',
            timeOfDay: 'afternoon',
            scheduledTime: '01:30 PM',
            taken: false,
          },
        ],
      },
    ],
  },
  {
    id: 'rx-102',
    doctorName: 'Dr. Rajesh Nair',
    doctorSpecialty: 'Pediatrics & Allergy',
    hospitalOrClinic: 'Apollo Child Wellness Care',
    diagnosis: 'Seasonal Bronchial Allergy & Cough',
    date: '2026-10-18',
    expiryDate: '2026-10-28',
    doctorAvatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150',
    notes: 'Warm water steam inhalation twice daily.',
    medicines: [
      {
        id: 'med-4',
        name: 'Levocetirizine 5mg',
        dosage: '1 Tablet',
        frequency: 'Night',
        instructions: 'At bedtime',
        remainingDays: 5,
        doses: [
          {
            id: 'dose-4a',
            timeOfDay: 'night',
            scheduledTime: '09:30 PM',
            taken: false,
          },
        ],
      },
      {
        id: 'med-5',
        name: 'Ambroxol Syrup',
        dosage: '5 ml',
        frequency: 'Thrice Daily',
        instructions: 'After meals',
        remainingDays: 3,
        doses: [
          {
            id: 'dose-5a',
            timeOfDay: 'morning',
            scheduledTime: '08:00 AM',
            taken: true,
            takenAt: 'Today, 08:05 AM',
          },
          {
            id: 'dose-5b',
            timeOfDay: 'afternoon',
            scheduledTime: '01:00 PM',
            taken: false,
          },
          {
            id: 'dose-5c',
            timeOfDay: 'night',
            scheduledTime: '08:30 PM',
            taken: false,
          },
        ],
      },
    ],
  },
];

type PrescriptionSubscriber = (list: Prescription[]) => void;

class PrescriptionService {
  private prescriptions: Prescription[] = [...INITIAL_PRESCRIPTIONS];
  private subscribers: Set<PrescriptionSubscriber> = new Set();

  constructor() {
    this.loadFromStorage();
  }

  private async loadFromStorage() {
    try {
      const data = await AsyncStorage.getItem(PRESCRIPTIONS_STORAGE_KEY);
      if (data) {
        this.prescriptions = JSON.parse(data);
      }
    } catch {
      // fallback to initial
    } finally {
      this.notify();
    }
  }

  private async persist() {
    try {
      await AsyncStorage.setItem(
        PRESCRIPTIONS_STORAGE_KEY,
        JSON.stringify(this.prescriptions)
      );
    } catch {
      // ignore
    }
  }

  public subscribe(sub: PrescriptionSubscriber): () => void {
    this.subscribers.add(sub);
    sub([...this.prescriptions]);
    return () => this.subscribers.delete(sub);
  }

  private notify() {
    const copy = [...this.prescriptions];
    this.subscribers.forEach((fn) => fn(copy));
  }

  public getPrescriptions(): Prescription[] {
    return [...this.prescriptions];
  }

  public getPrescriptionById(id: string): Prescription | undefined {
    return this.prescriptions.find((p) => p.id === id);
  }

  /**
   * Mark a specific dose as taken or not taken
   */
  public async toggleDoseTaken(
    prescriptionId: string,
    medicineId: string,
    doseId: string
  ): Promise<boolean> {
    const rx = this.prescriptions.find((p) => p.id === prescriptionId);
    if (!rx) return false;

    const med = rx.medicines.find((m) => m.id === medicineId);
    if (!med) return false;

    const dose = med.doses.find((d) => d.id === doseId);
    if (!dose) return false;

    // Toggle
    dose.taken = !dose.taken;
    if (dose.taken) {
      const nowStr = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
      dose.takenAt = `Today, ${nowStr}`;

      // Also create an auto reminder record or complete matching reminder
      reminderService.createReminder({
        title: `Dose Taken: ${med.name} (${med.dosage})`,
        description: `Prescribed by ${rx.doctorName}. Recorded at ${nowStr}`,
        date: new Date().toISOString().split('T')[0],
        time: dose.scheduledTime,
        priority: 'medium',
        category: 'Health',
      });
    } else {
      dose.takenAt = undefined;
    }

    this.prescriptions = [...this.prescriptions];
    await this.persist();
    this.notify();
    return true;
  }
}

export const prescriptionService = new PrescriptionService();
