import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Reminder, ReminderPriority } from '../../models/Reminder';
import { Colors } from '../../theme/colors';
import { Badge } from './Badge';

interface ReminderCardProps {
  reminder: Reminder;
  onToggleComplete: (id: string) => void;
  onSnooze?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ReminderCard: React.FC<ReminderCardProps> = ({
  reminder,
  onToggleComplete,
  onSnooze,
  onDelete,
}) => {
  const getPriorityVariant = (priority: ReminderPriority) => {
    switch (priority) {
      case 'high':
        return 'danger';
      case 'medium':
        return 'warning';
      case 'low':
      default:
        return 'info';
    }
  };

  return (
    <View
      style={[
        styles.cardContainer,
        reminder.isCompleted && styles.completedCard,
      ]}
    >
      <View style={styles.contentRow}>
        {/* Checkbox */}
        <TouchableOpacity
          style={[
            styles.checkbox,
            reminder.isCompleted && styles.checkboxCompleted,
          ]}
          onPress={() => onToggleComplete(reminder.id)}
          activeOpacity={0.7}
        >
          {reminder.isCompleted && <Text style={styles.checkmark}>✓</Text>}
        </TouchableOpacity>

        {/* Text Info */}
        <View style={styles.textWrapper}>
          <View style={styles.badgeRow}>
            <View style={styles.categoryPill}>
              <Text style={styles.categoryText}>{reminder.category}</Text>
            </View>
            <Badge
              label={`${reminder.priority} priority`}
              variant={getPriorityVariant(reminder.priority)}
              size="small"
            />
            {reminder.snoozedUntil && (
              <Badge
                label={`Snoozed ${reminder.snoozedUntil}`}
                variant="warning"
                size="small"
              />
            )}
          </View>

          <Text
            style={[
              styles.title,
              reminder.isCompleted && styles.titleCompleted,
            ]}
          >
            {reminder.title}
          </Text>

          {reminder.description && (
            <Text
              style={[
                styles.description,
                reminder.isCompleted && styles.descCompleted,
              ]}
              numberOfLines={2}
            >
              {reminder.description}
            </Text>
          )}

          {/* Time & Date bar */}
          <View style={styles.metaRow}>
            <Text style={styles.metaText}>
              ⏰ {reminder.time} • 🗓️ {reminder.date}
            </Text>
            {reminder.repeat !== 'none' && (
              <Text style={styles.repeatBadge}>↻ {reminder.repeat}</Text>
            )}
          </View>
        </View>
      </View>

      {/* Footer controls: Snooze & Delete */}
      <View style={styles.footerRow}>
        {!reminder.isCompleted && onSnooze && (
          <TouchableOpacity
            style={styles.snoozeBtn}
            onPress={() => onSnooze(reminder.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.snoozeText}>💤 Snooze +15m</Text>
          </TouchableOpacity>
        )}

        {onDelete && (
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => onDelete(reminder.id)}
            activeOpacity={0.7}
          >
            <Text style={styles.deleteIcon}>🗑️</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 14,
    marginVertical: 6,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  completedCard: {
    backgroundColor: '#F8FAFC',
    opacity: 0.75,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
    marginRight: 12,
  },
  checkboxCompleted: {
    backgroundColor: Colors.success,
    borderColor: Colors.success,
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  textWrapper: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 6,
  },
  categoryPill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 20,
    marginBottom: 4,
  },
  titleCompleted: {
    textDecorationLine: 'line-through',
    color: Colors.textMuted,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: 6,
  },
  descCompleted: {
    color: Colors.textMuted,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  metaText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  repeatBadge: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primary,
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    textTransform: 'capitalize',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  snoozeBtn: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
    backgroundColor: Colors.warningSubtle,
  },
  snoozeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.warning,
  },
  deleteBtn: {
    padding: 5,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  deleteIcon: {
    fontSize: 12,
  },
});
