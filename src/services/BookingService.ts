import { Booking, BookingStatus, CreateBookingDTO } from '../models/Booking';
import { INITIAL_BOOKINGS } from './MockDataService';

type BookingListener = (bookings: Booking[]) => void;

class BookingService {
  private bookings: Booking[] = [...INITIAL_BOOKINGS];
  private listeners: Set<BookingListener> = new Set();

  public subscribe(listener: BookingListener): () => void {
    this.listeners.add(listener);
    // Notify immediately with current state
    listener([...this.bookings]);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify() {
    const copy = [...this.bookings];
    this.listeners.forEach((listener) => listener(copy));
  }

  public async getBookings(): Promise<Booking[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([...this.bookings]);
      }, 150);
    });
  }

  public async getBookingById(id: string): Promise<Booking | undefined> {
    return this.bookings.find((b) => b.id === id);
  }

  public async createBooking(dto: CreateBookingDTO): Promise<Booking> {
    const newBooking: Booking = {
      id: `bkg-${Date.now()}`,
      title: dto.title,
      serviceCategory: dto.serviceCategory,
      providerName: dto.providerName,
      date: dto.date,
      time: dto.time,
      durationMinutes: dto.durationMinutes,
      price: dto.price,
      currency: 'INR',
      location: dto.location,
      status: 'upcoming',
      notes: dto.notes,
      createdAt: new Date().toISOString(),
    };

    this.bookings = [newBooking, ...this.bookings];
    this.notify();
    return newBooking;
  }

  /**
   * Optimistic booking method that adds booking immediately,
   * simulates server round-trip latency, and reconciles or rolls back on error.
   */
  public async bookSlotOptimistic(dto: CreateBookingDTO, shouldSimulateFail = false, latency = 600): Promise<Booking> {
    const tempId = `bkg-opt-${Date.now()}`;
    const optimisticBooking: Booking = {
      id: tempId,
      title: dto.title,
      serviceCategory: dto.serviceCategory,
      providerName: dto.providerName,
      date: dto.date,
      time: dto.time,
      durationMinutes: dto.durationMinutes,
      price: dto.price,
      currency: 'INR',
      location: dto.location,
      status: 'upcoming',
      notes: dto.notes,
      createdAt: new Date().toISOString(),
    };

    // 1. Optimistic insertion - feels instantaneous to the user!
    this.bookings = [optimisticBooking, ...this.bookings];
    this.notify();

    // 2. Simulate server reconciliation
    if (latency > 0) {
      await new Promise((res) => setTimeout(() => res(null), latency));
    }

    // 3. Simulated failure check
    if (shouldSimulateFail) {
      // Rollback optimistic update
      this.bookings = this.bookings.filter((b) => b.id !== tempId);
      this.notify();
      throw new Error('Booking could not be confirmed: Slot was taken by another user');
    }

    // 4. Reconciliation: finalize booking ID
    const finalizedBooking: Booking = {
      ...optimisticBooking,
      id: `bkg-confirmed-${Date.now()}`,
    };
    const idx = this.bookings.findIndex((b) => b.id === tempId);
    if (idx !== -1) {
      this.bookings[idx] = finalizedBooking;
      this.notify();
    }

    return finalizedBooking;
  }

  public async updateStatus(id: string, status: BookingStatus): Promise<boolean> {
    const index = this.bookings.findIndex((b) => b.id === id);
    if (index === -1) return false;

    this.bookings[index] = {
      ...this.bookings[index],
      status,
    };
    this.bookings = [...this.bookings];
    this.notify();
    return true;
  }

  public async deleteBooking(id: string): Promise<boolean> {
    const prevLen = this.bookings.length;
    this.bookings = this.bookings.filter((b) => b.id !== id);
    if (this.bookings.length !== prevLen) {
      this.notify();
      return true;
    }
    return false;
  }
}

export const bookingService = new BookingService();
