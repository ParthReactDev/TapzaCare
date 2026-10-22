import { LinkingOptions } from '@react-navigation/native';
import { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: ['tapza://', 'https://tapza.io', 'https://*.tapza.io'],
  config: {
    screens: {
      Splash: 'splash',
      MainTabs: {
        screens: {
          HomeTab: 'home',
          BookingsTab: 'bookings',
          PrescriptionsTab: 'prescription/:prescriptionId?',
          RemindersTab: 'reminders',
        },
      },
      AdminEditor: 'admin',
    },
  },
};
