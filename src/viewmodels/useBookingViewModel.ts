import { useState, useEffect, useMemo, useCallback } from 'react';
import { Booking, BookingCategory, BookingStatus, CreateBookingDTO } from '../models/Booking';
import { bookingService } from '../services/BookingService';
import { reminderService } from '../services/ReminderService';

export type BookingFilterTab = 'all' | 'upcoming' | 'completed' | 'cancelled';

export const CATEGORIES: BookingCategory[] = [
  'Consultation',
  'Health & Wellness',
  'Home Services',
  'Creative & Design',
  'Technical Support',
  'Legal & Finance',
];

interface BookingFormState {
  title: string;
  serviceCategory: BookingCategory;
  providerName: string;
  date: string;
  time: string;
  durationMinutes: string;
  price: string;
  location: string;
  notes: string;
  createReminder: boolean;
}

const initialFormState: BookingFormState = {
  title: '',
  serviceCategory: 'Consultation',
  providerName: '',
  date: '2026-10-30',
  time: '10:00 AM',
  durationMinutes: '60',
  price: '99',
  location: 'Online Meeting',
  notes: '',
  createReminder: true,
};

export function useBookingViewModel() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [activeTab, setActiveTab] = useState<BookingFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<BookingCategory | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Create Modal State
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [formData, setFormData] = useState<BookingFormState>(initialFormState);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = bookingService.subscribe((list) => {
      setBookings(list);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  // Filtered bookings
  const filteredBookings = useMemo(() => {
    return bookings.filter((item) => {
      // 1. Status Filter
      if (activeTab !== 'all' && item.status !== activeTab) {
        return false;
      }
      // 2. Category Filter
      if (selectedCategory !== 'All' && item.serviceCategory !== selectedCategory) {
        return false;
      }
      // 3. Search Query
      if (searchQuery.trim().length > 0) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesProvider = item.providerName.toLowerCase().includes(query);
        const matchesLocation = item.location.toLowerCase().includes(query);
        if (!matchesTitle && !matchesProvider && !matchesLocation) {
          return false;
        }
      }
      return true;
    });
  }, [bookings, activeTab, selectedCategory, searchQuery]);

  // Tab count pills
  const counts = useMemo(() => {
    return {
      all: bookings.length,
      upcoming: bookings.filter((b) => b.status === 'upcoming').length,
      completed: bookings.filter((b) => b.status === 'completed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    };
  }, [bookings]);

  const refreshBookings = useCallback(async () => {
    setIsRefreshing(true);
    await bookingService.getBookings();
    setIsRefreshing(false);
  }, []);

  const openCreateModal = useCallback(() => {
    setFormData(initialFormState);
    setFormErrors({});
    setIsCreateModalVisible(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalVisible(false);
  }, []);

  const updateFormField = useCallback((field: keyof BookingFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.providerName.trim()) errors.providerName = 'Provider name is required';
    if (!formData.date.trim()) errors.date = 'Date is required';
    if (!formData.time.trim()) errors.time = 'Time is required';
    if (!formData.location.trim()) errors.location = 'Location is required';

    const numPrice = Number(formData.price);
    if (isNaN(numPrice) || numPrice < 0) errors.price = 'Enter a valid price';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitCreateBooking = useCallback(async () => {
    if (!validateForm()) return false;

    setIsSubmitting(true);
    try {
      const dto: CreateBookingDTO = {
        title: formData.title.trim(),
        serviceCategory: formData.serviceCategory,
        providerName: formData.providerName.trim(),
        date: formData.date.trim(),
        time: formData.time.trim(),
        durationMinutes: Number(formData.durationMinutes) || 60,
        price: Number(formData.price) || 0,
        location: formData.location.trim(),
        notes: formData.notes.trim() || undefined,
      };

      const newBooking = await bookingService.createBooking(dto);

      // Optionally auto-create a reminder for this booking
      if (formData.createReminder) {
        await reminderService.createReminder({
          title: `Booking: ${dto.title}`,
          description: `With ${dto.providerName} at ${dto.location}`,
          date: dto.date,
          time: dto.time,
          priority: 'high',
          category: 'Appointment',
          linkedBookingId: newBooking.id,
        });
      }

      setIsCreateModalVisible(false);
      return true;
    } catch {
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const updateBookingStatus = useCallback(async (id: string, status: BookingStatus) => {
    await bookingService.updateStatus(id, status);
  }, []);

  const deleteBooking = useCallback(async (id: string) => {
    await bookingService.deleteBooking(id);
  }, []);

  return {
    bookings: filteredBookings,
    totalCount: bookings.length,
    counts,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories: ['All', ...CATEGORIES] as (BookingCategory | 'All')[],
    isLoading,
    isRefreshing,
    refreshBookings,

    // Form
    isCreateModalVisible,
    openCreateModal,
    closeCreateModal,
    formData,
    formErrors,
    updateFormField,
    submitCreateBooking,
    isSubmitting,

    // Actions
    updateBookingStatus,
    deleteBooking,
  };
}
