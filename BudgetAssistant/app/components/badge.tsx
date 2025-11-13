// ui/badge.tsx
import React from 'react';
import { View, Text, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

export type BadgeVariant = 'default' | 'secondary' | 'destructive' | 'outline';

interface BadgeProps {
  variant?: BadgeVariant;
  label?: string;
  children?: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'default',
  label,
  children,
  style,
  textStyle,
}) => {
  const content = label ?? children;

  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      {typeof content === 'string' ? (
        <Text style={[styles.text, textVariantStyles[variant], textStyle]}>
          {content}
        </Text>
      ) : (
        content
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 12,
    fontWeight: '500',
  },
});

const variantStyles: Record<BadgeVariant, StyleProp<ViewStyle>> = {
  default: {
    backgroundColor: '#FACC15',
    borderColor: '#F59E0B',
  },
  secondary: {
    backgroundColor: '#E5E7EB',
    borderColor: '#D1D5DB',
  },
  destructive: {
    backgroundColor: '#DC2626',
    borderColor: '#B91C1C',
  },
  outline: {
    backgroundColor: 'transparent',
    borderColor: '#6B7280',
  },
};

const textVariantStyles: Record<BadgeVariant, StyleProp<TextStyle>> = {
  default: {
    color: '#78350F',
  },
  secondary: {
    color: '#111827',
  },
  destructive: {
    color: '#FFFFFF',
  },
  outline: {
    color: '#111827',
  },
};
