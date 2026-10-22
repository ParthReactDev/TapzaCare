import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

const PARTICLES = [
  { id: 1, angle: 0, color: '#FBBF24', symbol: '✨' },
  { id: 2, angle: 45, color: '#10B981', symbol: '🎉' },
  { id: 3, angle: 90, color: '#6366F1', symbol: '🌟' },
  { id: 4, angle: 135, color: '#EC4899', symbol: '💫' },
  { id: 5, angle: 180, color: '#00CEC9', symbol: '✨' },
  { id: 6, angle: 225, color: '#F59E0B', symbol: '🎊' },
  { id: 7, angle: 270, color: '#8B5CF6', symbol: '⭐' },
  { id: 8, angle: 315, color: '#10B981', symbol: '✨' },
];

export const CelebrationAnimation: React.FC<{ size?: number }> = ({ size = 110 }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const haloAnim = useRef(new Animated.Value(0)).current;
  const particlesAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        tension: 50,
        useNativeDriver: true,
      }),
      Animated.timing(haloAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(particlesAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, haloAnim, particlesAnim]);

  const haloScale = haloAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.8],
  });

  const haloOpacity = haloAnim.interpolate({
    inputRange: [0, 0.7, 1],
    outputRange: [0.8, 0.4, 0],
  });

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {/* Expanding shockwave halo */}
      <Animated.View
        style={[
          styles.halo,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            transform: [{ scale: haloScale }],
            opacity: haloOpacity,
          },
        ]}
      />

      {/* 8 Radial Exploding Particles */}
      {PARTICLES.map((p) => {
        const rad = (p.angle * Math.PI) / 180;
        const distance = size * 0.95;
        const translateX = particlesAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.cos(rad) * distance],
        });
        const translateY = particlesAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, Math.sin(rad) * distance],
        });
        const particleOpacity = particlesAnim.interpolate({
          inputRange: [0, 0.7, 1],
          outputRange: [1, 0.9, 0],
        });
        const particleScale = particlesAnim.interpolate({
          inputRange: [0, 0.4, 1],
          outputRange: [0.3, 1.3, 0.9],
        });

        return (
          <Animated.View
            key={p.id}
            style={[
              styles.particle,
              {
                opacity: particleOpacity,
                transform: [{ translateX }, { translateY }, { scale: particleScale }],
              },
            ]}
          >
            <Text style={styles.particleText}>{p.symbol}</Text>
          </Animated.View>
        );
      })}

      {/* Main Checkmark Badge */}
      <Animated.View
        style={[
          styles.badge,
          {
            width: size * 0.8,
            height: size * 0.8,
            borderRadius: (size * 0.8) / 2,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={[styles.checkText, { fontSize: size * 0.42 }]}>✓</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 12,
  },
  halo: {
    position: 'absolute',
    backgroundColor: 'rgba(16, 185, 129, 0.35)',
    borderWidth: 2,
    borderColor: '#10B981',
  },
  badge: {
    backgroundColor: '#10B981',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  checkText: {
    color: '#FFFFFF',
    fontWeight: '900',
  },
  particle: {
    position: 'absolute',
  },
  particleText: {
    fontSize: 20,
  },
});
