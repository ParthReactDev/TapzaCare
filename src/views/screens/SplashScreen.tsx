import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSplashViewModel } from '../../viewmodels/useSplashViewModel';
import { Colors } from '../../theme/colors';

interface SplashScreenProps {
  navigation?: any;
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({
  navigation,
  onFinish,
}) => {
  const handleTransition = () => {
    if (onFinish) {
      onFinish();
    } else if (navigation?.replace) {
      navigation.replace('MainTabs');
    }
  };

  const { progress, statusText, fadeAnim, scaleAnim, pulseAnim } =
    useSplashViewModel(handleTransition);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Background Decorative Circles */}
      <View style={styles.circleTopRight} />
      <View style={styles.circleBottomLeft} />

      {/* Main Animated Branding Content */}
      <Animated.View
        style={[
          styles.contentBox,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Glowing Logo Icon */}
        <Animated.View
          style={[
            styles.logoContainer,
            {
              transform: [{ scale: pulseAnim }],
            },
          ]}
        >
          <View style={styles.logoInner}>
            <Text style={styles.logoSymbol}>⚡</Text>
          </View>
        </Animated.View>

        {/* Brand Name & Tagline */}
        <Text style={styles.brandTitle}>TAPZA</Text>
        <View style={styles.taglineBadge}>
          <Text style={styles.taglineText}>SMART BOOKINGS • REMINDERS</Text>
        </View>
        <Text style={styles.brandSubtitle}>
          Effortless scheduling, intelligent reminders, and seamless service booking in one place.
        </Text>
      </Animated.View>

      {/* Bottom Progress Bar & Loading Status */}
      <Animated.View style={[styles.bottomContainer, { opacity: fadeAnim }]}>
        <View style={styles.progressBarTrack}>
          <View
            style={[
              styles.progressBarFill,
              { width: `${Math.round(progress * 100)}%` },
            ]}
          />
        </View>

        <View style={styles.statusRow}>
          <Text style={styles.statusText}>{statusText}</Text>
          <Text style={styles.percentText}>{Math.round(progress * 100)}%</Text>
        </View>

        {/* Skip Button */}
        <TouchableOpacity
          style={styles.skipButton}
          onPress={handleTransition}
          activeOpacity={0.7}
        >
          <Text style={styles.skipButtonText}>Get Started →</Text>
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F111A',
    justifyContent: 'space-between',
    paddingHorizontal: 28,
    paddingVertical: 50,
  },
  circleTopRight: {
    position: 'absolute',
    top: -80,
    right: -80,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(108, 92, 231, 0.15)',
  },
  circleBottomLeft: {
    position: 'absolute',
    bottom: -100,
    left: -100,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(0, 206, 201, 0.12)',
  },
  contentBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 104,
    height: 104,
    borderRadius: 32,
    backgroundColor: 'rgba(108, 92, 231, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(162, 155, 254, 0.4)',
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  logoInner: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoSymbol: {
    fontSize: 42,
  },
  brandTitle: {
    fontSize: 38,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 4,
    marginBottom: 8,
  },
  taglineBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  taglineText: {
    color: '#00CEC9',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
  },
  brandSubtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 22,
    maxWidth: 290,
  },
  bottomContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBarTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.secondary,
    borderRadius: 3,
  },
  statusRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusText: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  percentText: {
    fontSize: 13,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  skipButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  skipButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
