import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './api/client';
import { bookingService } from './BookingService';

const QUEUE_STORAGE_KEY = '@tapza_offline_bookings_queue';
const OFFLINE_MODE_KEY = '@tapza_is_offline_simulation';

export interface QueuedBooking {
  id: string;
  doctorId: string;
  slotId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  fee: number;
  queuedAt: string;
  status: 'pending' | 'syncing' | 'synced' | 'failed';
  errorReason?: string;
}

type QueueListener = (queue: QueuedBooking[], isOffline: boolean) => void;

class OfflineQueueService {
  private queue: QueuedBooking[] = [];
  private isOfflineMode: boolean = false;
  private listeners: Set<QueueListener> = new Set();

  constructor() {
    this.init();
  }

  private async init() {
    try {
      const savedOffline = await AsyncStorage.getItem(OFFLINE_MODE_KEY);
      if (savedOffline !== null) {
        this.isOfflineMode = JSON.parse(savedOffline);
      }
      const savedQueue = await AsyncStorage.getItem(QUEUE_STORAGE_KEY);
      if (savedQueue) {
        this.queue = JSON.parse(savedQueue);
      }
    } catch {
      // ignore
    } finally {
      this.notify();
    }
  }

  public subscribe(listener: QueueListener): () => void {
    this.listeners.add(listener);
    listener([...this.queue], this.isOfflineMode);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    const copy = [...this.queue];
    this.listeners.forEach((fn) => fn(copy, this.isOfflineMode));
  }

  public isOffline(): boolean {
    return this.isOfflineMode;
  }

  public async setOfflineMode(offline: boolean) {
    this.isOfflineMode = offline;
    await AsyncStorage.setItem(OFFLINE_MODE_KEY, JSON.stringify(offline));
    this.notify();

    // Auto-sync if turned back online
    if (!offline && this.queue.length > 0) {
      await this.syncQueue();
    }
  }

  public async enqueueBooking(item: Omit<QueuedBooking, 'id' | 'queuedAt' | 'status'>): Promise<QueuedBooking> {
    const queuedItem: QueuedBooking = {
      ...item,
      id: `queue-${Date.now()}`,
      queuedAt: new Date().toISOString(),
      status: 'pending',
    };

    this.queue = [queuedItem, ...this.queue];
    await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    this.notify();
    return queuedItem;
  }

  public async syncQueue(): Promise<{ synced: number; failed: number }> {
    if (this.isOfflineMode || this.queue.length === 0) {
      return { synced: 0, failed: 0 };
    }

    let synced = 0;
    let failed = 0;
    const remaining: QueuedBooking[] = [];

    for (const item of this.queue) {
      try {
        await api.post('/bookings', {
          doctorId: item.doctorId,
          slotId: item.slotId,
          patientName: item.patientName,
        });

        // Add confirmed booking to local reactive service
        await bookingService.createBooking({
          title: item.doctorName,
          serviceCategory: 'Consultation',
          providerName: item.doctorName,
          date: item.date,
          time: item.time,
          durationMinutes: 45,
          price: item.fee,
          location: 'Hyderabad / Vijayawada Clinic Network (Synced Offline)',
          notes: `Synced from offline queue at ${new Date().toLocaleTimeString()}`,
        });

        synced++;
      } catch (err: any) {
        failed++;
        remaining.push({
          ...item,
          status: 'failed',
          errorReason: err.message || 'Sync failed',
        });
      }
    }

    this.queue = remaining;
    await AsyncStorage.setItem(QUEUE_STORAGE_KEY, JSON.stringify(this.queue));
    this.notify();

    return { synced, failed };
  }

  public getQueue(): QueuedBooking[] {
    return [...this.queue];
  }
}

export const offlineQueueService = new OfflineQueueService();
