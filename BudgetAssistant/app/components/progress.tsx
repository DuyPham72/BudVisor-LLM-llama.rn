// components/progress.tsx
import React from 'react';
import { View, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface ProgressProps {
  value?: number; // 0–100
  style?: StyleProp<ViewStyle>;
  trackStyle?: StyleProp<ViewStyle>;
  indicatorStyle?: StyleProp<ViewStyle>;
}

export const Progress: React.FC<ProgressProps> = ({
  value = 0,
  style,
  trackStyle,
  indicatorStyle,
}) => {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <View style={[styles.track, style, trackStyle]}>
      <View
        style={[
          styles.indicator,
          indicatorStyle,
          { width: `${clamped}%` },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  track: {
    height: 8,
    borderRadius: 999,
    overflow: 'hidden',
    backgroundColor: 'rgba(79,70,229,0.2)', // primary/20-ish
  },
  indicator: {
    height: '100%',
    backgroundColor: '#4F46E5', // primary
  },
});
