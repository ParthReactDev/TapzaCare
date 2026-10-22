import { useState, useEffect, useRef } from 'react';
import { Animated } from 'react-native';

export interface SplashViewModelState {
  progress: number;
  statusText: string;
  isReady: boolean;
  fadeAnim: Animated.Value;
  scaleAnim: Animated.Value;
  pulseAnim: Animated.Value;
}

export function useSplashViewModel(onFinish?: () => void) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Initializing Tapza core...');
  const [isReady, setIsReady] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    // 1. Entrance animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();

    // Pulse animation
    const pulseLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    );
    pulseLoop.start();

    // 2. Simulated boot sequence
    const timers: ReturnType<typeof setTimeout>[] = [];

    timers.push(
      setTimeout(() => {
        setProgress(0.35);
        setStatusText('Loading smart schedules & reminders...');
      }, 700)
    );

    timers.push(
      setTimeout(() => {
        setProgress(0.75);
        setStatusText('Syncing verified services...');
      }, 1500)
    );

    timers.push(
      setTimeout(() => {
        setProgress(1);
        setStatusText('Welcome to Tapza!');
        setIsReady(true);
      }, 2200)
    );

    timers.push(
      setTimeout(() => {
        pulseLoop.stop();
        if (onFinish) {
          onFinish();
        }
      }, 2700)
    );

    return () => {
      pulseLoop.stop();
      timers.forEach(clearTimeout);
    };
  }, [fadeAnim, scaleAnim, pulseAnim, onFinish]);

  return {
    progress,
    statusText,
    isReady,
    fadeAnim,
    scaleAnim,
    pulseAnim,
  };
}
