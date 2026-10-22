import { Platform, Vibration } from 'react-native';

export const Haptics = {
  selection: () => {
    try {
      if (Platform.OS === 'android') {
        Vibration.vibrate(8);
      } else {
        Vibration.vibrate(10);
      }
    } catch {
      // ignore
    }
  },

  medium: () => {
    try {
      Vibration.vibrate(20);
    } catch {
      // ignore
    }
  },

  success: () => {
    try {
      // Double rhythmic bounce pulse
      Vibration.vibrate([0, 15, 40, 25]);
    } catch {
      // ignore
    }
  },

  error: () => {
    try {
      // Triple pulse warning
      Vibration.vibrate([0, 20, 30, 20, 30, 20]);
    } catch {
      // ignore
    }
  },
};
