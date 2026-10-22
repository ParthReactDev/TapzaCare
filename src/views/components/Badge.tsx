import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../theme/colors';

interface BadgeProps {
  label: string;
  variant?: 'primary' | 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  size?: 'small' | 'medium';
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'small',
}) => {
  const getColors = () => {
    switch (variant) {
      case 'success':
        return { bg: Colors.successSubtle, text: Colors.success };
      case 'warning':
        return { bg: Colors.warningSubtle, text: Colors.warning };
      case 'danger':
        return { bg: Colors.dangerSubtle, text: Colors.danger };
      case 'info':
        return { bg: Colors.infoSubtle, text: Colors.info };
      case 'neutral':
        return { bg: '#F1F5F9', text: Colors.textSecondary };
      case 'primary':
      default:
        return { bg: Colors.primarySubtle, text: Colors.primary };
    }
  };

  const colors = getColors();

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: colors.bg },
        size === 'small' ? styles.badgeSmall : styles.badgeMedium,
      ]}
    >
      <Text
        style={[
          styles.text,
          { color: colors.text },
          size === 'small' ? styles.textSmall : styles.textMedium,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    alignSelf: 'flex-start',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeMedium: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  text: {
    fontWeight: '700',
    textTransform: 'capitalize',
  },
  textSmall: {
    fontSize: 11,
  },
  textMedium: {
    fontSize: 12,
  },
});
