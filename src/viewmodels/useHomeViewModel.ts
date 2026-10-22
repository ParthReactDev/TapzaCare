import { useState, useEffect, useRef, useCallback } from 'react';
import { Animated } from 'react-native';
import { Doctor, LayoutConfig } from '../models/BackendApi';
import { api } from '../services/api/client';
import { mockBackendApi, NORMAL_LAYOUT_CONFIG } from '../services/api/MockBackendApi';
import { BookingTarget } from '../views/components/BookingBottomSheet';

export function useHomeViewModel(navigation?: any) {
  const [config, setConfig] = useState<LayoutConfig>(NORMAL_LAYOUT_CONFIG);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorNotice, setErrorNotice] = useState<string | null>(null);

  // Animated scroll binding for collapsible header & parallax
  const scrollY = useRef(new Animated.Value(0)).current;

  // Booking Flow bottom sheet target
  const [bookingTarget, setBookingTarget] = useState<BookingTarget | null>(null);
  const [isBookingSheetVisible, setIsBookingSheetVisible] = useState(false);

  // Resilience & Config Switcher modal
  const [isResilienceModalVisible, setIsResilienceModalVisible] = useState(false);

  const loadConfig = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setIsRefreshing(true);
    } else {
      setIsLoading(true);
    }
    setErrorNotice(null);

    try {
      // Calls exact endpoint: GET /config -> LayoutConfig
      const fetchedConfig: LayoutConfig = await api.get('/config');
      setConfig(fetchedConfig);
    } catch (err: any) {
      setErrorNotice(err.message || 'Could not reach server. Displaying cached version.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadConfig(false);
  }, [loadConfig]);

  const handleBookDoctor = useCallback((doctor: Doctor) => {
    setBookingTarget({
      type: 'doctor',
      id: doctor.id,
      name: doctor.name,
      subtitle: `${doctor.specialty} • ${doctor.clinicName || 'Clinic'}`,
      fee: doctor.feeInr,
      photo: doctor.photoUrl,
      category: 'Consultation',
    });
    setIsBookingSheetVisible(true);
  }, []);

  const handleBookService = useCallback((service: any) => {
    setBookingTarget({
      type: 'service',
      id: service.id,
      name: service.name,
      subtitle: `${service.category || 'Service'} • ${service.duration || 'Clinic'}`,
      fee: service.price,
      photo: service.image,
      category: service.category,
    });
    setIsBookingSheetVisible(true);
  }, []);

  const closeBookingSheet = useCallback(() => {
    setIsBookingSheetVisible(false);
    setBookingTarget(null);
  }, []);

  const toggleConfigMode = useCallback(async () => {
    const current = mockBackendApi.getSettings();
    const nextMode = current.activeConfigMode === 'normal' ? 'festival_diwali' : 'normal';
    await mockBackendApi.updateSettings({ activeConfigMode: nextMode });
    await loadConfig(false);
  }, [loadConfig]);

  const navigateToRoute = useCallback(
    (route: string) => {
      if (navigation?.navigate) {
        if (route === 'BookingsTab') {
          navigation.navigate('BookingsTab');
        } else if (route === 'PrescriptionsTab') {
          navigation.navigate('PrescriptionsTab');
        } else if (route === 'RemindersTab') {
          navigation.navigate('RemindersTab');
        } else {
          navigation.navigate('BookingsTab');
        }
      }
    },
    [navigation]
  );

  return {
    config,
    isLoading,
    isRefreshing,
    errorNotice,
    scrollY,
    loadConfig,

    // Booking Flow
    bookingTarget,
    isBookingSheetVisible,
    handleBookDoctor,
    handleBookService,
    closeBookingSheet,

    // Config & Resilience Modals
    isResilienceModalVisible,
    openResilienceModal: () => setIsResilienceModalVisible(true),
    closeResilienceModal: () => setIsResilienceModalVisible(false),
    toggleConfigMode,

    // Navigation
    navigateToRoute,
  };
}
