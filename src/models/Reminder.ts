export type ReminderPriority = 'high' | 'medium' | 'low';

export type ReminderCategory =
  | 'Appointment'
  | 'Payment'
  | 'Follow-up'
  | 'Task'
  | 'Health';

export type ReminderRepeat = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Reminder {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM AM/PM
  priority: ReminderPriority;
  category: ReminderCategory;
  isCompleted: boolean;
  linkedBookingId?: string;
  snoozedUntil?: string;
  repeat: ReminderRepeat;
  createdAt: string;
}

export interface CreateReminderDTO {
  title: string;
  description?: string;
  date: string;
  time: string;
  priority: ReminderPriority;
  category: ReminderCategory;
  repeat?: ReminderRepeat;
  linkedBookingId?: string;
}
