import AsyncStorage from '@react-native-async-storage/async-storage';
import { reminderService } from './ReminderService';

const NOTIF_STORAGE_KEY = '@tapza_scheduled_notifications';

export interface ScheduledNotification {
  id: string;
  title: string;
  body: string;
  timeSlot: 'morning' | 'afternoon' | 'night';
  scheduledTime: string;
  medicineName: string;
  prescriptionId: string;
}

type NotificationBannerCallback = (notif: ScheduledNotification) => void;

class NotificationService {
  private bannerListeners: Set<NotificationBannerCallback> = new Set();
  private scheduledList: ScheduledNotification[] = [];

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const saved = await AsyncStorage.getItem(NOTIF_STORAGE_KEY);
      if (saved) {
        this.scheduledList = JSON.parse(saved);
      }
    } catch {
      // ignore
    }
  }

  public subscribeBanner(fn: NotificationBannerCallback): () => void {
    this.bannerListeners.add(fn);
    return () => this.bannerListeners.delete(fn);
  }

  public async scheduleMedicineReminder(
    medicineName: string,
    timeSlot: 'morning' | 'afternoon' | 'night',
    timeString: string,
    prescriptionId: string
  ): Promise<ScheduledNotification> {
    const notif: ScheduledNotification = {
      id: `notif-${Date.now()}-${Math.random().toString(36).substring(7)}`,
      title: `💊 Time for ${medicineName}`,
      body: `Scheduled for ${timeSlot.toUpperCase()} (${timeString}). Tap to log your dose.`,
      timeSlot,
      scheduledTime: timeString,
      medicineName,
      prescriptionId,
    };

    this.scheduledList.push(notif);
    await AsyncStorage.setItem(NOTIF_STORAGE_KEY, JSON.stringify(this.scheduledList));

    // Also register in reminder service
    await reminderService.createReminder({
      title: `Medicine Alert: ${medicineName}`,
      description: `Daily ${timeSlot} dose (${timeString})`,
      date: new Date().toISOString().split('T')[0],
      time: timeString,
      priority: 'high',
      category: 'Health',
      repeat: 'daily',
    });

    return notif;
  }

  /**
   * Simulate a notification trigger right now (for testing / demo)
   */
  public triggerTestNotification(medicineName = 'Telmisartan 40mg', timeSlot: 'morning' | 'afternoon' | 'night' = 'morning') {
    const notif: ScheduledNotification = {
      id: `notif-test-${Date.now()}`,
      title: `🔔 Medicine Reminder: ${medicineName}`,
      body: `It's time for your ${timeSlot} dose. Maintain regular adherence for optimal health.`,
      timeSlot,
      scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      medicineName,
      prescriptionId: 'rx-hyd-101',
    };

    this.bannerListeners.forEach((listener) => listener(notif));
  }

  public getScheduled(): ScheduledNotification[] {
    return [...this.scheduledList];
  }
}

export const notificationService = new NotificationService();
