/**
 * Tapza React Native App
 * MVVM Architecture: Splash, Home, Booking, Prescriptions, and Reminders
 * Bonus: i18n (EN/TE/HI), Offline Queue, Deep Linking, Config Admin
 */

import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { linking } from './src/navigation/linking';
import { I18nProvider } from './src/i18n';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <I18nProvider>
        <NavigationContainer linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </I18nProvider>
    </SafeAreaProvider>
  );
}

export default App;
