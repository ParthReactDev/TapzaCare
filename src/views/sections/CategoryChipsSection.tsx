import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SectionBackground } from '../../models/BackendApi';
import { SectionWrapper } from './SectionWrapper';
import { Colors } from '../../theme/colors';

export interface CategoryChipItem {
  id: string;
  label: string;
  icon: string;
  badge?: string;
}

interface CategoryChipsSectionProps {
  items: CategoryChipItem[];
  background: SectionBackground;
  title?: string;
  onSelectCategory?: (id: string) => void;
}

export const CategoryChipsSection: React.FC<CategoryChipsSectionProps> = ({
  items,
  background,
  title,
  onSelectCategory,
}) => {
  const [activeId, setActiveId] = useState(items?.[0]?.id || '');

  const handleSelect = (id: string) => {
    setActiveId(id);
    if (onSelectCategory) {
      onSelectCategory(id);
    }
  };

  return (
    <SectionWrapper background={background}>
      {title && (
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
        </View>
      )}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {(items || []).map((item) => {
          const isSelected = activeId === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.chip, isSelected && styles.chipSelected]}
              onPress={() => handleSelect(item.id)}
              activeOpacity={0.75}
            >
              <Text style={styles.chipIcon}>{item.icon}</Text>
              <Text
                style={[
                  styles.chipLabel,
                  isSelected && styles.chipLabelSelected,
                ]}
              >
                {item.label}
              </Text>
              {item.badge && (
                <View style={styles.badgeWrap}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
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
  scrollContent: {
    gap: 8,
    paddingVertical: 2,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipIcon: {
    fontSize: 14,
    marginRight: 6,
  },
  chipLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  chipLabelSelected: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  badgeWrap: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 6,
    marginLeft: 6,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
});
