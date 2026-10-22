import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';

export const ShimmerBox: React.FC<{
  width: number | string;
  height: number;
  borderRadius?: number;
  style?: any;
}> = ({ width, height, borderRadius = 8, style }) => {
  const shimmerAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 0.85,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    loop.start();
    return () => loop.stop();
  }, [shimmerAnim]);

  return (
    <Animated.View
      style={[
        styles.shimmerDefault,
        {
          width: width as any,
          height,
          borderRadius,
          opacity: shimmerAnim,
        },
        style,
      ]}
    />
  );
};

export const HomeSkeleton: React.FC = () => {
  return (
    <View style={styles.container}>
      {/* Hero Banner Skeleton */}
      <View style={styles.heroSkeleton}>
        <ShimmerBox width={90} height={18} borderRadius={10} style={{ marginBottom: 12 }} />
        <ShimmerBox width="85%" height={26} borderRadius={6} style={{ marginBottom: 8 }} />
        <ShimmerBox width="60%" height={16} borderRadius={6} style={{ marginBottom: 20 }} />
        <View style={styles.rowBetween}>
          <ShimmerBox width={120} height={36} borderRadius={18} />
          <ShimmerBox width={80} height={36} borderRadius={18} />
        </View>
      </View>

      {/* Offer Strip Skeleton */}
      <ShimmerBox width="100%" height={44} borderRadius={12} style={{ marginVertical: 12 }} />

      {/* Quick Actions 4 Tiles Skeleton */}
      <View style={styles.quickActionsRow}>
        {[1, 2, 3, 4].map((i) => (
          <View key={i} style={styles.quickActionTile}>
            <ShimmerBox width={46} height={46} borderRadius={16} style={{ marginBottom: 8 }} />
            <ShimmerBox width={50} height={12} borderRadius={4} />
          </View>
        ))}
      </View>

      {/* Category Chips Skeleton */}
      <View style={styles.chipsRow}>
        {[80, 90, 70, 100, 85].map((w, i) => (
          <ShimmerBox key={i} width={w} height={32} borderRadius={16} style={{ marginRight: 8 }} />
        ))}
      </View>

      {/* Doctor Carousel Skeleton */}
      <View style={styles.sectionHeaderSkeleton}>
        <ShimmerBox width={180} height={20} borderRadius={6} style={{ marginBottom: 6 }} />
        <ShimmerBox width={240} height={14} borderRadius={4} />
      </View>
      <View style={styles.doctorCarouselRow}>
        {[1, 2].map((i) => (
          <View key={i} style={styles.doctorCardSkeleton}>
            <ShimmerBox width={64} height={64} borderRadius={32} style={{ marginBottom: 10 }} />
            <ShimmerBox width={120} height={16} borderRadius={4} style={{ marginBottom: 6 }} />
            <ShimmerBox width={100} height={12} borderRadius={4} style={{ marginBottom: 12 }} />
            <ShimmerBox width={130} height={28} borderRadius={8} />
          </View>
        ))}
      </View>

      {/* Service Grid Skeleton */}
      <View style={styles.sectionHeaderSkeleton}>
        <ShimmerBox width={160} height={20} borderRadius={6} style={{ marginBottom: 6 }} />
      </View>
      <View style={styles.gridRow}>
        {[1, 2].map((i) => (
          <View key={i} style={styles.gridCardSkeleton}>
            <ShimmerBox width="100%" height={100} borderRadius={12} style={{ marginBottom: 8 }} />
            <ShimmerBox width="80%" height={14} borderRadius={4} style={{ marginBottom: 6 }} />
            <ShimmerBox width="40%" height={16} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  shimmerDefault: {
    backgroundColor: '#E2E8F0',
  },
  heroSkeleton: {
    backgroundColor: '#EEF2F6',
    borderRadius: 22,
    padding: 20,
    marginBottom: 8,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  quickActionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 14,
  },
  quickActionTile: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 4,
  },
  chipsRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  sectionHeaderSkeleton: {
    marginVertical: 12,
  },
  doctorCarouselRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  doctorCardSkeleton: {
    width: 220,
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    gap: 12,
  },
  gridCardSkeleton: {
    flex: 1,
    padding: 12,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
});
