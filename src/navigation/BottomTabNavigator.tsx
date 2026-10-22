import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MainTabParamList } from './types';
import { HomeScreen } from '../views/screens/HomeScreen';
import { BookingScreen } from '../views/screens/BookingScreen';
import { RemindersScreen } from '../views/screens/RemindersScreen';
import { PrescriptionsScreen } from '../views/screens/PrescriptionsScreen';
import { Colors } from '../theme/colors';
import { reminderService } from '../services/ReminderService';

const Tab = createBottomTabNavigator<MainTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  const [pendingRemindersCount, setPendingRemindersCount] = useState(0);

  useEffect(() => {
    const unsub = reminderService.subscribe((list) => {
      setPendingRemindersCount(list.filter((r) => !r.isCompleted).length);
    });
    return unsub;
  }, []);

  return (
    <Tab.Navigator
      initialRouteName="HomeTab"
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
              <Text style={styles.tabIcon}>🏠</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="BookingsTab"
        component={BookingScreen}
        options={{
          tabBarLabel: 'Bookings',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
              <Text style={styles.tabIcon}>📅</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="PrescriptionsTab"
        component={PrescriptionsScreen}
        options={{
          tabBarLabel: 'Medicines',
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
              <Text style={styles.tabIcon}>💊</Text>
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="RemindersTab"
        component={RemindersScreen}
        options={{
          tabBarLabel: 'Reminders',
          tabBarBadge: pendingRemindersCount > 0 ? pendingRemindersCount : undefined,
          tabBarBadgeStyle: styles.badgeStyle,
          tabBarIcon: ({ focused }) => (
            <View style={[styles.iconWrap, focused && styles.activeIconWrap]}>
              <Text style={styles.tabIcon}>🔔</Text>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    height: Platform.OS === 'ios' ? 88 : 68,
    paddingTop: 8,
    paddingBottom: Platform.OS === 'ios' ? 28 : 10,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  iconWrap: {
    width: 38,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 15,
  },
  activeIconWrap: {
    backgroundColor: Colors.primarySubtle,
  },
  tabIcon: {
    fontSize: 18,
  },
  badgeStyle: {
    backgroundColor: Colors.danger,
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    top: -2,
  },
});
