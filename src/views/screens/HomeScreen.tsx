import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  StatusBar,
  Alert,
} from 'react-native';
import { useHomeViewModel } from '../../viewmodels/useHomeViewModel';
import { SectionRenderer } from '../sections/SectionRenderer';
import { HomeSkeleton } from '../components/SkeletonLoader';
import { BookingBottomSheet } from '../components/BookingBottomSheet';
import { ResilienceControlsModal } from '../components/ResilienceControlsModal';
import { EmptyState } from '../components/EmptyState';
import { useTranslation, SupportedLocale } from '../../i18n';
import { offlineQueueService, QueuedBooking } from '../../services/OfflineQueueService';
import { notificationService, ScheduledNotification } from '../../services/NotificationService';
import { Haptics } from '../../utils/haptics';

interface HomeScreenProps {
  navigation?: any;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const {
    config,
    isLoading,
    isRefreshing,
    errorNotice,
    scrollY,
    loadConfig,

    bookingTarget,
    isBookingSheetVisible,
    handleBookDoctor,
    handleBookService,
    closeBookingSheet,

    isResilienceModalVisible,
    openResilienceModal,
    closeResilienceModal,
    toggleConfigMode,
    navigateToRoute,
  } = useHomeViewModel(navigation);

  const { locale, setLocale, t } = useTranslation();
  const [offlineQueue, setOfflineQueue] = useState<QueuedBooking[]>([]);
  const [isOffline, setIsOffline] = useState(false);
  const [activeBannerNotif, setActiveBannerNotif] = useState<ScheduledNotification | null>(null);

  // Subscribe to offline queue & notifications
  useEffect(() => {
    const unsubQueue = offlineQueueService.subscribe((q, offline) => {
      setOfflineQueue(q);
      setIsOffline(offline);
    });

    const unsubNotif = notificationService.subscribeBanner((notif) => {
      Haptics.medium();
      setActiveBannerNotif(notif);
      setTimeout(() => setActiveBannerNotif(null), 5000);
    });

    return () => {
      unsubQueue();
      unsubNotif();
    };
  }, []);

  const theme = config.theme;
  const isFestival = !!config.theme?.festival;

  // Header animation: shrinks and changes background as user scrolls
  const headerHeight = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [72, 54],
    extrapolate: 'clamp',
  });

  const headerTitleScale = scrollY.interpolate({
    inputRange: [0, 80],
    outputRange: [1, 0.9],
    extrapolate: 'clamp',
  });

  const headerBgColor = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [theme.background, theme.surface],
    extrapolate: 'clamp',
  });

  const headerShadowOpacity = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [0, 0.08],
    extrapolate: 'clamp',
  });

  const cycleLocale = async () => {
    Haptics.selection();
    const next: SupportedLocale = locale === 'en' ? 'te' : locale === 'te' ? 'hi' : 'en';
    await setLocale(next);
  };

  const handleSyncOfflineQueue = async () => {
    Haptics.selection();
    const res = await offlineQueueService.syncQueue();
    Alert.alert(
      'Sync Complete',
      `Synced ${res.synced} offline bookings successfully to the mock backend.`
    );
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="dark-content" />

      {/* ACTIVE NOTIFICATION TOAST (Local Medicine Reminder Simulation) */}
      {activeBannerNotif && (
        <TouchableOpacity
          style={styles.notifBanner}
          onPress={() => {
            setActiveBannerNotif(null);
            navigateToRoute('PrescriptionsTab');
          }}
          activeOpacity={0.9}
        >
          <View style={styles.notifContent}>
            <Text style={styles.notifTitle}>{activeBannerNotif.title}</Text>
            <Text style={styles.notifBody}>{activeBannerNotif.body}</Text>
          </View>
          <Text style={styles.notifAction}>Open Rx →</Text>
        </TouchableOpacity>
      )}

      {/* OFFLINE QUEUE STATUS BANNER */}
      {(isOffline || offlineQueue.length > 0) && (
        <View style={styles.offlineBar}>
          <Text style={styles.offlineText}>
            {isOffline
              ? '📶 Offline Mode Active'
              : `💾 ${offlineQueue.length} Bookings Pending Sync`}
          </Text>
          {!isOffline && offlineQueue.length > 0 && (
            <TouchableOpacity onPress={handleSyncOfflineQueue} style={styles.syncBtn}>
              <Text style={styles.syncBtnText}>Sync Now</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* COLLAPSIBLE / SHRINKING ANIMATED HEADER */}
      <Animated.View
        style={[
          styles.animatedHeader,
          {
            height: headerHeight,
            backgroundColor: headerBgColor,
            shadowOpacity: headerShadowOpacity,
            borderBottomColor: '#E2E8F0',
          },
        ]}
      >
        <Animated.View
          style={[
            styles.headerTitleWrap,
            { transform: [{ scale: headerTitleScale }] },
          ]}
        >
          <Text style={[styles.brandName, { color: theme.primary }]}>
            TAPZA
          </Text>
          <Text style={[styles.brandMode, { color: theme.textSecondary }]}>
            {isFestival ? `🪔 ${config.theme.festival?.name}` : `🌿 ${t('standard_care')}`}
          </Text>
        </Animated.View>

        {/* Runtime Config Switcher, Locale Switcher, & Admin Controls */}
        <View style={styles.headerRightActions}>
          {/* Language Switcher Pill (EN / తెలుగు / हिन्दी) */}
          <TouchableOpacity
            style={styles.localePill}
            onPress={cycleLocale}
            activeOpacity={0.7}
          >
            <Text style={styles.localePillText}>
              🌐 {locale.toUpperCase()}
            </Text>
          </TouchableOpacity>

          {/* Normal vs Festival Switcher */}
          <TouchableOpacity
            style={[
              styles.configSwitchPill,
              { backgroundColor: `${theme.primary}18` },
            ]}
            onPress={() => {
              Haptics.selection();
              toggleConfigMode();
            }}
            activeOpacity={0.8}
          >
            <Text style={[styles.configSwitchText, { color: theme.primary }]}>
              {isFestival ? t('switch_to_normal') : t('switch_to_diwali')}
            </Text>
          </TouchableOpacity>

          {/* Admin Live Config Editor Screen */}
          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={() => {
              Haptics.selection();
              navigation?.navigate?.('AdminEditor');
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.iconSymbol}>🛠️</Text>
          </TouchableOpacity>

          {/* Resilience / Latency Debug Modal */}
          <TouchableOpacity
            style={styles.actionIconBtn}
            onPress={() => {
              Haptics.selection();
              openResilienceModal();
            }}
            activeOpacity={0.7}
          >
            <Text style={styles.iconSymbol}>⚙️</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Network Failure / Cache Notice */}
      {errorNotice && (
        <View style={styles.noticeBar}>
          <Text style={styles.noticeText}>⚠️ {errorNotice}</Text>
          <TouchableOpacity onPress={() => loadConfig(true)}>
            <Text style={styles.noticeRetryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* MAIN CONFIG-DRIVEN SECTIONS STREAM */}
      {isLoading ? (
        <HomeSkeleton />
      ) : (
        <Animated.ScrollView
          style={[styles.scrollContainer, { backgroundColor: theme.background }]}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          scrollEventThrottle={16}
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { y: scrollY } } }],
            { useNativeDriver: false }
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={() => loadConfig(true)}
              colors={[theme.primary]}
            />
          }
        >
          {config.sections.length === 0 ? (
            <EmptyState
              icon="📭"
              title="No Sections in Config"
              description="The current GET /config returned an empty section list. You can switch config mode or reset simulation."
              actionText="Switch to Normal Mode"
              onActionPress={toggleConfigMode}
            />
          ) : (
            config.sections.map((section) => (
              <SectionRenderer
                key={section.id}
                section={section}
                scrollY={scrollY}
                onNavigate={navigateToRoute}
                onBookDoctor={handleBookDoctor}
                onBookService={handleBookService}
              />
            ))
          )}
        </Animated.ScrollView>
      )}

      {/* Gesture-driven Booking Bottom Sheet */}
      <BookingBottomSheet
        visible={isBookingSheetVisible}
        target={bookingTarget}
        onClose={closeBookingSheet}
      />

      {/* Resilience & Runtime Config Switcher Modal */}
      <ResilienceControlsModal
        visible={isResilienceModalVisible}
        onClose={closeResilienceModal}
        onReloadConfig={() => loadConfig(true)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  notifBanner: {
    backgroundColor: '#0F766E',
    marginHorizontal: 16,
    marginTop: 8,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
    zIndex: 99,
  },
  notifContent: {
    flex: 1,
    marginRight: 8,
  },
  notifTitle: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  notifBody: {
    color: '#CCFBF1',
    fontSize: 11,
    marginTop: 2,
  },
  notifAction: {
    color: '#FDE047',
    fontSize: 12,
    fontWeight: '800',
  },
  offlineBar: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 16,
    paddingVertical: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  offlineText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  syncBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  syncBtnText: {
    color: '#B45309',
    fontSize: 11,
    fontWeight: '800',
  },
  animatedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    zIndex: 10,
  },
  headerTitleWrap: {
    flexDirection: 'column',
  },
  brandName: {
    fontSize: 20,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  brandMode: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  localePill: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  localePillText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#334155',
  },
  configSwitchPill: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  configSwitchText: {
    fontSize: 10,
    fontWeight: '800',
  },
  actionIconBtn: {
    padding: 6,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
  },
  iconSymbol: {
    fontSize: 14,
  },
  noticeBar: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 14,
    paddingVertical: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#FDE68A',
  },
  noticeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#92400E',
    flex: 1,
    marginRight: 8,
  },
  noticeRetryText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#B45309',
    textDecorationLine: 'underline',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 40,
  },
});
