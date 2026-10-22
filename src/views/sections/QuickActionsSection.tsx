import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SectionBackground } from '../../models/BackendApi';
import { SectionWrapper } from './SectionWrapper';
import { Colors } from '../../theme/colors';

export interface QuickActionItem {
  id: string;
  title: string;
  icon: string;
  badge?: string;
  screen: 'home' | 'bookings' | 'prescriptions' | 'profile';
  tintColor: string;
}

interface QuickActionsSectionProps {
  items: QuickActionItem[];
  background: SectionBackground;
  title?: string;
  onNavigate: (route: string) => void;
}

export const QuickActionsSection: React.FC<QuickActionsSectionProps> = ({
  items,
  background,
  title,
  onNavigate,
}) => {
  const mapScreenToTab = (screen: string) => {
    switch (screen) {
      case 'bookings':
        return 'BookingsTab';
      case 'prescriptions':
        return 'PrescriptionsTab';
      case 'profile':
        return 'RemindersTab';
      default:
        return 'HomeTab';
    }
  };

  return (
    <SectionWrapper background={background}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      <View style={styles.grid}>
        {(items || []).map((tile) => (
          <TouchableOpacity
            key={tile.id}
            style={styles.tile}
            onPress={() => onNavigate(mapScreenToTab(tile.screen))}
            activeOpacity={0.8}
          >
            <View
              style={[
                styles.iconWrap,
                { backgroundColor: `${tile.tintColor}15` },
              ]}
            >
              <Text style={styles.tileIcon}>{tile.icon}</Text>
              {tile.badge && (
                <View
                  style={[
                    styles.badgePill,
                    { backgroundColor: tile.tintColor },
                  ]}
                >
                  <Text style={styles.badgeText}>{tile.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.tileTitle} numberOfLines={1}>
              {tile.title}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SectionWrapper>
  );
};

const styles = StyleSheet.create({
  header: {
    marginBottom: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 8,
  },
  tile: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 2,
  },
  iconWrap: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginBottom: 8,
  },
  tileIcon: {
    fontSize: 22,
  },
  badgePill: {
    position: 'absolute',
    top: -4,
    right: -6,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
  },
  tileTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
});
