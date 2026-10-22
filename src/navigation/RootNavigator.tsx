import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { SplashScreen } from '../views/screens/SplashScreen';
import { BottomTabNavigator } from './BottomTabNavigator';
import { AdminConfigEditorScreen } from '../views/screens/AdminConfigEditorScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Splash"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="Splash" component={SplashScreen} />
      <Stack.Screen
        name="MainTabs"
        component={BottomTabNavigator}
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen
        name="AdminEditor"
        component={AdminConfigEditorScreen}
        options={{
          animation: 'slide_from_bottom',
          presentation: 'modal',
        }}
      />
    </Stack.Navigator>
  );
};
