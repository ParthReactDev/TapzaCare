import React from 'react';
import { View, StyleSheet } from 'react-native';
import { SectionBackground } from '../../models/BackendApi';

interface SectionWrapperProps {
  background: SectionBackground;
  children: React.ReactNode;
  style?: any;
}

export const SectionWrapper: React.FC<SectionWrapperProps> = ({
  background,
  children,
  style,
}) => {
  let bgStyle: any = {};

  if (background.kind === 'color') {
    bgStyle = { backgroundColor: background.value };
  } else if (background.kind === 'gradient') {
    const firstColor = background.value.split(',')[0].trim();
    bgStyle = { backgroundColor: firstColor };
  } else if (background.kind === 'image') {
    bgStyle = { backgroundColor: '#0F172A' };
  }

  return (
    <View style={[styles.sectionContainer, bgStyle, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 16,
  },
});
