import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { SectionBackground } from '../../models/BackendApi';

export interface OfferStripItem {
  icon?: string;
  message: string;
  code?: string;
  actionText?: string;
  textColor?: string;
}

interface OfferStripSectionProps {
  data: OfferStripItem;
  background: SectionBackground;
  onPressAction?: () => void;
}

export const OfferStripSection: React.FC<OfferStripSectionProps> = ({
  data,
  background,
  onPressAction,
}) => {
  const bgColor =
    background.kind === 'color'
      ? background.value
      : background.kind === 'gradient'
      ? background.value.split(',')[0].trim()
      : '#CCFBF1';

  const textColor = data?.textColor || '#0F766E';

  return (
    <View style={[styles.container, { backgroundColor: bgColor }]}>
      <View style={styles.contentRow}>
        {data?.icon && <Text style={styles.icon}>{data.icon}</Text>}
        <Text style={[styles.message, { color: textColor }]} numberOfLines={1}>
          {data?.message}
        </Text>
      </View>

      <View style={styles.actionRow}>
        {data?.code && (
          <View style={styles.codePill}>
            <Text style={styles.codeText}>{data.code}</Text>
          </View>
        )}
        {data?.actionText && (
          <TouchableOpacity
            style={styles.actionBtn}
            onPress={onPressAction}
            activeOpacity={0.7}
          >
            <Text style={[styles.actionText, { color: textColor }]}>
              {data.actionText} →
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  icon: {
    fontSize: 16,
    marginRight: 6,
  },
  message: {
    fontSize: 12,
    fontWeight: '700',
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  codePill: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.1)',
  },
  codeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#0F172A',
  },
  actionBtn: {
    paddingVertical: 2,
  },
  actionText: {
    fontSize: 11,
    fontWeight: '800',
  },
});
