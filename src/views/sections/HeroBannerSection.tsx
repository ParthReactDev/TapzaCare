import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import { SectionBackground } from '../../models/BackendApi';

interface HeroBannerItem {
  greeting: string;
  headline: string;
  subtext: string;
  badge?: string;
  ctaText?: string;
  accentColor?: string;
}

interface HeroBannerSectionProps {
  data: HeroBannerItem;
  background: SectionBackground;
  scrollY?: Animated.Value;
  onCtaPress?: () => void;
}

export const HeroBannerSection: React.FC<HeroBannerSectionProps> = ({
  data,
  background,
  scrollY,
  onCtaPress,
}) => {
  const translateY = scrollY
    ? scrollY.interpolate({
        inputRange: [-100, 0, 100],
        outputRange: [50, 0, -25],
        extrapolate: 'clamp',
      })
    : 0;

  const colors =
    background.kind === 'gradient'
      ? background.value.split(',').map((c) => c.trim())
      : [data?.accentColor || '#0D9488', '#042F2E'];

  return (
    <View style={[styles.outerContainer, { backgroundColor: colors[0] }]}>
      <Animated.View
        style={[
          styles.innerCard,
          {
            backgroundColor: colors[1] || colors[0],
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.glowCircle} />

        <View style={styles.topRow}>
          <Text style={styles.greetingText}>{data?.greeting}</Text>
          {data?.badge && (
            <View style={styles.badgePill}>
              <Text style={styles.badgeText}>{data.badge}</Text>
            </View>
          )}
        </View>

        <Text style={styles.headline}>{data?.headline}</Text>
        <Text style={styles.subtext}>{data?.subtext}</Text>

        {data?.ctaText && (
          <TouchableOpacity
            style={[
              styles.ctaBtn,
              { backgroundColor: data.accentColor || '#2DD4BF' },
            ]}
            onPress={onCtaPress}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>{data.ctaText} →</Text>
          </TouchableOpacity>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    width: '100%',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 16,
  },
  innerCard: {
    borderRadius: 24,
    padding: 22,
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 6,
  },
  glowCircle: {
    position: 'absolute',
    top: -40,
    right: -40,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  greetingText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#A7F3D0',
    letterSpacing: 0.2,
  },
  badgePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  headline: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
    lineHeight: 28,
    letterSpacing: -0.4,
    marginBottom: 8,
  },
  subtext: {
    fontSize: 13,
    color: '#E2E8F0',
    lineHeight: 18,
    marginBottom: 18,
    maxWidth: '90%',
  },
  ctaBtn: {
    alignSelf: 'flex-start',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 12,
  },
  ctaBtnText: {
    color: '#0F172A',
    fontWeight: '800',
    fontSize: 13,
  },
});
