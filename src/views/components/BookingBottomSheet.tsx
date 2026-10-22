import React, { useState, useMemo, useRef, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ScrollView,
  Animated,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Colors } from '../../theme/colors';
import { BookingResponse, Slot } from '../../models/BackendApi';
import { api } from '../../services/api/client';
import { bookingService } from '../../services/BookingService';

import { CelebrationAnimation } from './CelebrationAnimation';
import { Haptics } from '../../utils/haptics';
import { offlineQueueService } from '../../services/OfflineQueueService';

export interface BookingTarget {
  type: 'doctor' | 'service';
  id: string;
  name: string;
  subtitle: string;
  fee: number;
  photo?: string;
  category?: string;
}

interface BookingBottomSheetProps {
  visible: boolean;
  target: BookingTarget | null;
  onClose: () => void;
  onBookingConfirmed?: (booking: any) => void;
}

export const BookingBottomSheet: React.FC<BookingBottomSheetProps> = ({
  visible,
  target,
  onClose,
  onBookingConfirmed,
}) => {
  // Generate next 7 days
  const dateOptions = useMemo(() => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName =
        i === 0 ? 'Today' : i === 1 ? 'Tmrw' : d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNumber = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      dates.push({ iso, dayName, dayNumber, monthName });
    }
    return dates;
  }, []);

  const [selectedDate, setSelectedDate] = useState(dateOptions[0].iso);
  const [slots, setSlots] = useState<Slot[]>([]);
  const [selectedSlotId, setSelectedSlotId] = useState<string>('');
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isOfflineQueued, setIsOfflineQueued] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<BookingResponse | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Fetch slots from GET /slots?doctorId=&date=YYYY-MM-DD
  const fetchSlots = useCallback(async (doctorId: string, date: string) => {
    setIsLoadingSlots(true);
    setErrorMessage(null);
    try {
      const result: Slot[] = await api.get('/slots', {
        params: { doctorId, date },
      });
      setSlots(result);
      const firstAvailable = result.find((s) => s.available);
      if (firstAvailable) {
        setSelectedSlotId(firstAvailable.id);
      } else {
        setSelectedSlotId('');
      }
    } catch (err: any) {
      setErrorMessage('Could not load slots: ' + err.message);
    } finally {
      setIsLoadingSlots(false);
    }
  }, []);

  useEffect(() => {
    if (visible && target) {
      setIsSuccess(false);
      setIsOfflineQueued(false);
      setErrorMessage(null);
      setIsSubmitting(false);
      setSelectedDate(dateOptions[0].iso);
      fetchSlots(target.id, dateOptions[0].iso);
    }
  }, [visible, target, dateOptions, fetchSlots]);

  const handleDateChange = (iso: string) => {
    Haptics.selection();
    setSelectedDate(iso);
    if (target) {
      fetchSlots(target.id, iso);
    }
  };

  const handleSlotSelect = (slotId: string) => {
    Haptics.selection();
    setSelectedSlotId(slotId);
  };

  const handleConfirm = async () => {
    if (!target || !selectedSlotId) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const chosenSlot = slots.find((s) => s.id === selectedSlotId);
    const slotTimeStr = chosenSlot?.startsAt || '10:30 AM';

    // CHECK OFFLINE QUEUE REQUIREMENT:
    if (offlineQueueService.isOffline()) {
      await offlineQueueService.enqueueBooking({
        doctorId: target.id,
        slotId: selectedSlotId,
        patientName: 'Alex Morgan',
        doctorName: target.name,
        date: selectedDate,
        time: slotTimeStr,
        fee: target.fee,
      });

      Haptics.success();
      setIsOfflineQueued(true);
      setIsSuccess(true);
      setIsSubmitting(false);
      return;
    }

    try {
      // 1. Optimistic insertion to local reactive booking service
      bookingService.createBooking({
        title: target.name,
        serviceCategory: (target.category as any) || 'Consultation',
        providerName: target.name,
        date: selectedDate,
        time: slotTimeStr,
        durationMinutes: 45,
        price: target.fee,
        location: 'Apollo / KIMS / Manipal Network Clinic',
        notes: `Confirmed via Tapza Indian Care Flow for ${selectedDate}`,
      });

      // 2. Call POST /bookings {doctorId, slotId} -> 201 or 409 if slot taken!
      const response = await api.post('/bookings', {
        doctorId: target.id,
        slotId: selectedSlotId,
        patientName: 'Alex Morgan',
      });

      if (response.status === 201) {
        Haptics.success();
        setConfirmedBooking(response.data);
        setIsSuccess(true);

        if (onBookingConfirmed) {
          onBookingConfirmed(response.data);
        }
      }
    } catch (err: any) {
      Haptics.error();
      if (err.status === 409 || err.message?.includes('409')) {
        setErrorMessage('⚠️ 409 Conflict: This slot was just taken by another patient. Please pick another slot.');
        if (target) fetchSlots(target.id, selectedDate);
      } else {
        setErrorMessage(err.message || 'Booking failed. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!target) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheetContainer}>
          <View style={styles.handleBar} />

          {/* SUCCESS ANIMATION VIEW (Custom Particle Celebration) */}
          {isSuccess ? (
            <View style={styles.successContainer}>
              <CelebrationAnimation size={100} />

              <Text style={styles.successTitle}>
                {isOfflineQueued
                  ? 'Booking Saved to Offline Queue! 💾'
                  : 'Booking Confirmed! (201 Created) 🎉'}
              </Text>
              <Text style={styles.successSubtitle}>
                {isOfflineQueued
                  ? 'Your appointment has been queued locally and will automatically sync when connection restores.'
                  : `Your appointment at ${confirmedBooking?.doctor?.clinicName || 'Clinic'} has been scheduled.`}
              </Text>

              {/* Receipt card */}
              <View style={styles.receiptCard}>
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Doctor</Text>
                  <Text style={styles.receiptValue}>{target.name}</Text>
                </View>
                <View style={styles.receiptDivider} />
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Slot Time</Text>
                  <Text style={styles.receiptValue}>
                    {slots.find((s) => s.id === selectedSlotId)?.startsAt || '10:30 AM'}
                  </Text>
                </View>
                <View style={styles.receiptDivider} />
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Consultation Fee</Text>
                  <Text style={styles.receiptFee}>₹{target.fee}</Text>
                </View>
                <View style={styles.receiptDivider} />
                <View style={styles.receiptRow}>
                  <Text style={styles.receiptLabel}>Sync Status</Text>
                  <Text style={[styles.receiptId, isOfflineQueued && { color: Colors.warning }]}>
                    {isOfflineQueued ? 'Pending Offline Sync' : 'Synced (HTTP 201)'}
                  </Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.doneBtn}
                onPress={onClose}
                activeOpacity={0.85}
              >
                <Text style={styles.doneBtnText}>Back to Home</Text>
              </TouchableOpacity>
            </View>
          ) : (
            /* SELECTION VIEW */
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.sheetScroll}>
              <View style={styles.headerRow}>
                <View style={styles.headerInfo}>
                  <Text style={styles.sheetTitle}>Schedule Appointment</Text>
                  <Text style={styles.targetName} numberOfLines={1}>
                    {target.name}
                  </Text>
                  <Text style={styles.targetSubtitle}>
                    {target.subtitle} • ₹{target.fee}
                  </Text>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                  <Text style={styles.closeIcon}>✕</Text>
                </TouchableOpacity>
              </View>

              {/* Error / 409 Banner */}
              {errorMessage && (
                <View style={styles.errorBanner}>
                  <Text style={styles.errorText}>{errorMessage}</Text>
                </View>
              )}

              {/* 1. Pick Date */}
              <Text style={styles.sectionHeading}>1. Select Date</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.datesRow}>
                {dateOptions.map((item) => {
                  const isSelected = selectedDate === item.iso;
                  return (
                    <TouchableOpacity
                      key={item.iso}
                      style={[styles.dateChip, isSelected && styles.dateChipSelected]}
                      onPress={() => handleDateChange(item.iso)}
                      activeOpacity={0.7}
                    >
                      <Text style={[styles.dayNameText, isSelected && styles.dateTextSelected]}>
                        {item.dayName}
                      </Text>
                      <Text style={[styles.dayNumberText, isSelected && styles.dateTextSelected]}>
                        {item.dayNumber}
                      </Text>
                      <Text style={[styles.monthText, isSelected && styles.dateTextSelected]}>
                        {item.monthName}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>

              {/* 2. Pick Time Slot (GET /slots) */}
              <View style={styles.slotsHeaderRow}>
                <Text style={styles.sectionHeading}>2. Pick Available Slot (GET /slots)</Text>
                {isLoadingSlots && <ActivityIndicator size="small" color={Colors.primary} />}
              </View>

              <View style={styles.slotsGrid}>
                {slots.map((slot) => {
                  const isSelected = selectedSlotId === slot.id;
                  const timeLabel = slot.startsAt.split(' ').slice(1).join(' ') || slot.startsAt;
                  return (
                    <TouchableOpacity
                      key={slot.id}
                      disabled={!slot.available}
                      style={[
                        styles.slotChip,
                        !slot.available && styles.slotDisabled,
                        isSelected && styles.slotSelected,
                      ]}
                      onPress={() => handleSlotSelect(slot.id)}
                      activeOpacity={0.8}
                    >
                      <Text
                        style={[
                          styles.slotTimeText,
                          !slot.available && styles.slotTextDisabled,
                          isSelected && styles.slotTextSelected,
                        ]}
                      >
                        {timeLabel}
                      </Text>
                      <Text
                        style={[
                          styles.slotStatusText,
                          isSelected && styles.slotTextSelected,
                        ]}
                      >
                        {slot.available ? 'Available' : 'Taken (409)'}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* Price & Confirm Button */}
              <View style={styles.footerRow}>
                <View>
                  <Text style={styles.totalLabel}>Fee in ₹ (Rupees)</Text>
                  <Text style={styles.totalPrice}>₹{target.fee}</Text>
                </View>

                <TouchableOpacity
                  style={[
                    styles.confirmBtn,
                    (!selectedSlotId || isSubmitting) && styles.btnDisabled,
                  ]}
                  onPress={handleConfirm}
                  disabled={!selectedSlotId || isSubmitting}
                  activeOpacity={0.85}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" />
                  ) : (
                    <Text style={styles.confirmBtnText}>Confirm (POST /bookings)</Text>
                  )}
                </TouchableOpacity>
              </View>
            </ScrollView>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: '85%',
    paddingBottom: Platform.OS === 'ios' ? 36 : 24,
    paddingTop: 12,
  },
  handleBar: {
    width: 44,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#CBD5E1',
    alignSelf: 'center',
    marginBottom: 12,
  },
  sheetScroll: {
    paddingHorizontal: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingBottom: 14,
  },
  headerInfo: {
    flex: 1,
  },
  sheetTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  targetName: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  targetSubtitle: {
    fontSize: 13,
    color: Colors.primary,
    fontWeight: '600',
    marginTop: 2,
  },
  closeBtn: {
    padding: 6,
    borderRadius: 12,
    backgroundColor: '#F1F5F9',
    marginLeft: 10,
  },
  closeIcon: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '700',
  },
  errorBanner: {
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 17,
  },
  sectionHeading: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginVertical: 10,
  },
  datesRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 16,
  },
  dateChip: {
    width: 62,
    height: 72,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateChipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayNameText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  dayNumberText: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginVertical: 1,
  },
  monthText: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  dateTextSelected: {
    color: '#FFFFFF',
  },
  slotsHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 20,
  },
  slotChip: {
    width: '31%',
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  slotSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  slotDisabled: {
    backgroundColor: '#F1F5F9',
    borderColor: '#E2E8F0',
    opacity: 0.5,
  },
  slotTimeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  slotStatusText: {
    fontSize: 9,
    color: Colors.textSecondary,
    marginTop: 2,
    fontWeight: '600',
  },
  slotTextSelected: {
    color: '#FFFFFF',
  },
  slotTextDisabled: {
    color: '#94A3B8',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  totalLabel: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  totalPrice: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  confirmBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 14,
    minWidth: 170,
    alignItems: 'center',
  },
  btnDisabled: {
    opacity: 0.5,
  },
  confirmBtnText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 13,
  },

  // Success Screen
  successContainer: {
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 30,
  },
  successCheckCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: Colors.success,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  successCheckIcon: {
    color: '#FFFFFF',
    fontSize: 42,
    fontWeight: '900',
  },
  successTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 6,
    textAlign: 'center',
  },
  successSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 20,
  },
  receiptCard: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 24,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  receiptLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  receiptValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  receiptId: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.primary,
  },
  receiptFee: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primary,
  },
  receiptDivider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },
  doneBtn: {
    width: '100%',
    backgroundColor: Colors.primary,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
  },
  doneBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
