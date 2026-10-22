import { useState, useEffect, useMemo, useCallback } from 'react';
import { CreateReminderDTO, Reminder, ReminderCategory, ReminderPriority, ReminderRepeat } from '../models/Reminder';
import { reminderService } from '../services/ReminderService';

export type ReminderFilterTab = 'all' | 'pending' | 'completed' | 'high_priority';

export const REMINDER_CATEGORIES: ReminderCategory[] = [
  'Appointment',
  'Payment',
  'Follow-up',
  'Task',
  'Health',
];

interface ReminderFormState {
  title: string;
  description: string;
  date: string;
  time: string;
  priority: ReminderPriority;
  category: ReminderCategory;
  repeat: ReminderRepeat;
}

const initialReminderForm: ReminderFormState = {
  title: '',
  description: '',
  date: '2026-10-25',
  time: '09:30 AM',
  priority: 'high',
  category: 'Task',
  repeat: 'none',
};

export function useReminderViewModel() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [activeTab, setActiveTab] = useState<ReminderFilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ReminderCategory | 'All'>('All');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Modal & Form
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [formData, setFormData] = useState<ReminderFormState>(initialReminderForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const unsub = reminderService.subscribe((list) => {
      setReminders(list);
      setIsLoading(false);
    });
    return unsub;
  }, []);

  const filteredReminders = useMemo(() => {
    return reminders.filter((item) => {
      // Tab filter
      if (activeTab === 'pending' && item.isCompleted) return false;
      if (activeTab === 'completed' && !item.isCompleted) return false;
      if (activeTab === 'high_priority' && item.priority !== 'high') return false;

      // Category filter
      if (selectedCategory !== 'All' && item.category !== selectedCategory) {
        return false;
      }

      // Search query
      if (searchQuery.trim().length > 0) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(q);
        const matchesDesc = item.description?.toLowerCase().includes(q);
        if (!matchesTitle && !matchesDesc) return false;
      }

      return true;
    });
  }, [reminders, activeTab, selectedCategory, searchQuery]);

  const counts = useMemo(() => {
    return {
      all: reminders.length,
      pending: reminders.filter((r) => !r.isCompleted).length,
      completed: reminders.filter((r) => r.isCompleted).length,
      highPriority: reminders.filter((r) => r.priority === 'high' && !r.isCompleted).length,
    };
  }, [reminders]);

  const refreshReminders = useCallback(async () => {
    setIsRefreshing(true);
    await reminderService.getReminders();
    setIsRefreshing(false);
  }, []);

  const openCreateModal = useCallback(() => {
    setFormData(initialReminderForm);
    setFormErrors({});
    setIsCreateModalVisible(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setIsCreateModalVisible(false);
  }, []);

  const updateFormField = useCallback((field: keyof ReminderFormState, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
  }, []);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!formData.title.trim()) errors.title = 'Title is required';
    if (!formData.date.trim()) errors.date = 'Date is required';
    if (!formData.time.trim()) errors.time = 'Time is required';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const submitCreateReminder = useCallback(async () => {
    if (!validateForm()) return false;

    setIsSubmitting(true);
    try {
      const dto: CreateReminderDTO = {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        date: formData.date.trim(),
        time: formData.time.trim(),
        priority: formData.priority,
        category: formData.category,
        repeat: formData.repeat,
      };

      await reminderService.createReminder(dto);
      setIsCreateModalVisible(false);
      return true;
    } catch {
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  const toggleComplete = useCallback(async (id: string) => {
    await reminderService.toggleComplete(id);
  }, []);

  const snoozeReminder = useCallback(async (id: string, minutes = 15) => {
    await reminderService.snoozeReminder(id, minutes);
  }, []);

  const deleteReminder = useCallback(async (id: string) => {
    await reminderService.deleteReminder(id);
  }, []);

  return {
    reminders: filteredReminders,
    totalCount: reminders.length,
    counts,
    activeTab,
    setActiveTab,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories: ['All', ...REMINDER_CATEGORIES] as (ReminderCategory | 'All')[],
    isLoading,
    isRefreshing,
    refreshReminders,

    // Form
    isCreateModalVisible,
    openCreateModal,
    closeCreateModal,
    formData,
    formErrors,
    updateFormField,
    submitCreateReminder,
    isSubmitting,

    // Actions
    toggleComplete,
    snoozeReminder,
    deleteReminder,
  };
}
