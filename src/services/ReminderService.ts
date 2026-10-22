import { CreateReminderDTO, Reminder } from '../models/Reminder';
import { INITIAL_REMINDERS } from './MockDataService';

type ReminderListener = (reminders: Reminder[]) => void;

class ReminderService {
  private reminders: Reminder[] = [...INITIAL_REMINDERS];
  private listeners: Set<ReminderListener> = new Set();

  public subscribe(listener: ReminderListener): () => void {
    this.listeners.add(listener);
    listener([...this.reminders]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const copy = [...this.reminders];
    this.listeners.forEach((listener) => listener(copy));
  }

  public async getReminders(): Promise<Reminder[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.reminders]);
      }, 150);
    });
  }

  public async createReminder(dto: CreateReminderDTO): Promise<Reminder> {
    const newReminder: Reminder = {
      id: `rem-${Date.now()}`,
      title: dto.title,
      description: dto.description,
      date: dto.date,
      time: dto.time,
      priority: dto.priority,
      category: dto.category,
      repeat: dto.repeat || 'none',
      isCompleted: false,
      linkedBookingId: dto.linkedBookingId,
      createdAt: new Date().toISOString(),
    };

    this.reminders = [newReminder, ...this.reminders];
    this.notify();
    return newReminder;
  }

  public async toggleComplete(id: string): Promise<boolean> {
    const index = this.reminders.findIndex((r) => r.id === id);
    if (index === -1) return false;

    this.reminders[index] = {
      ...this.reminders[index],
      isCompleted: !this.reminders[index].isCompleted,
    };
    this.reminders = [...this.reminders];
    this.notify();
    return true;
  }

  public async snoozeReminder(id: string, minutes = 15): Promise<boolean> {
    const index = this.reminders.findIndex((r) => r.id === id);
    if (index === -1) return false;

    const snoozeDate = new Date(Date.now() + minutes * 60 * 1000);
    const snoozeTimeStr = snoozeDate.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });

    this.reminders[index] = {
      ...this.reminders[index],
      snoozedUntil: snoozeTimeStr,
    };
    this.reminders = [...this.reminders];
    this.notify();
    return true;
  }

  public async deleteReminder(id: string): Promise<boolean> {
    const prevLen = this.reminders.length;
    this.reminders = this.reminders.filter((r) => r.id !== id);
    if (this.reminders.length !== prevLen) {
      this.notify();
      return true;
    }
    return false;
  }
}

export const reminderService = new ReminderService();
