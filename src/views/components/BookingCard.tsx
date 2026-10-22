import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Booking, BookingStatus } from '../../models/Booking';
import { Colors } from '../../theme/colors';
import { Badge } from './Badge';

interface BookingCardProps {
  booking: Booking;
  onStatusChange?: (id: string, status: BookingStatus) => void;
  onDelete?: (id: string) => void;
  onPress?: (booking: Booking) => void;
}

export const BookingCard: React.FC<BookingCardProps> = ({
  booking,
  onStatusChange,
  onDelete,
  onPress,
}) => {
  const getStatusVariant = (status: BookingStatus) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'danger';
      case 'upcoming':
      default:
        return 'primary';
    }
  };

  const formattedDate = new Date(booking.date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    weekday: 'short',
  });

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress && onPress(booking)}
      style={styles.cardContainer}
    >
      {/* Header Row: Category & Status */}
      <View style={styles.topRow}>
        <View style={styles.categoryPill}>
          <Text style={styles.categoryText}>{booking.serviceCategory}</Text>
        </View>
        <Badge
          label={booking.status}
          variant={getStatusVariant(booking.status)}
          size="small"
        />
      </View>

      {/* Main Title & Provider */}
      <Text style={styles.title} numberOfLines={2}>
        {booking.title}
      </Text>

      <View style={styles.providerRow}>
        <View style={styles.avatarPlaceholder}>
          <Text style={styles.avatarInitial}>
            {booking.providerName.charAt(0)}
          </Text>
        </View>
        <View style={styles.providerInfo}>
          <Text style={styles.providerName}>{booking.providerName}</Text>
          <Text style={styles.locationText} numberOfLines={1}>
            📍 {booking.location}
          </Text>
        </View>
      </View>

      {/* Schedule Info Box */}
      <View style={styles.scheduleRow}>
        <View style={styles.scheduleItem}>
          <Text style={styles.scheduleLabel}>Date</Text>
          <Text style={styles.scheduleValue}>🗓️ {formattedDate}</Text>
        </View>
        <View style={styles.scheduleDivider} />
        <View style={styles.scheduleItem}>
          <Text style={styles.scheduleLabel}>Time & Duration</Text>
          <Text style={styles.scheduleValue}>
            ⏰ {booking.time} ({booking.durationMinutes}m)
          </Text>
        </View>
        <View style={styles.scheduleDivider} />
        <View style={styles.scheduleItem}>
          <Text style={styles.scheduleLabel}>Price</Text>
          <Text style={styles.priceValue}>${booking.price}</Text>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionsRow}>
        {booking.status === 'upcoming' && onStatusChange && (
          <>
            <TouchableOpacity
              style={[styles.btn, styles.btnSuccess]}
              onPress={() => onStatusChange(booking.id, 'completed')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnSuccessText}>✓ Mark Completed</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.btnDanger]}
              onPress={() => onStatusChange(booking.id, 'cancelled')}
              activeOpacity={0.8}
            >
              <Text style={styles.btnDangerText}>Cancel</Text>
            </TouchableOpacity>
          </>
        )}

        {(booking.status === 'completed' || booking.status === 'cancelled') && onStatusChange && (
          <TouchableOpacity
            style={[styles.btn, styles.btnPrimaryOutline]}
            onPress={() => onStatusChange(booking.id, 'upcoming')}
            activeOpacity={0.8}
          >
            <Text style={styles.btnPrimaryOutlineText}>↻ Re-schedule</Text>
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity
            style={[styles.iconButton]}
            onPress={() => onDelete(booking.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.card,
    borderRadius: 18,
    padding: 16,
    marginVertical: 7,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },
  title: {
    fontSize: 17,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 22,
    marginBottom: 12,
  },
  providerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  avatarPlaceholder: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarInitial: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.primary,
  },
  providerInfo: {
    flex: 1,
  },
  providerName: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  scheduleRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 10,
    marginBottom: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#EEF2F6',
  },
  scheduleItem: {
    flex: 1,
    alignItems: 'center',
  },
  scheduleDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#E2E8F0',
  },
  scheduleLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  scheduleValue: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  priceValue: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primary,
  },
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  btn: {
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnSuccess: {
    backgroundColor: Colors.successSubtle,
  },
  btnSuccessText: {
    color: Colors.success,
    fontSize: 12,
    fontWeight: '700',
  },
  btnDanger: {
    backgroundColor: Colors.dangerSubtle,
  },
  btnDangerText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  btnPrimaryOutline: {
    backgroundColor: Colors.primarySubtle,
  },
  btnPrimaryOutlineText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
  iconButton: {
    padding: 6,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  deleteIcon: {
    fontSize: 14,
  },
});
