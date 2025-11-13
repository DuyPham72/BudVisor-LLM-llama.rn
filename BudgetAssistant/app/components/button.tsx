// ui/button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, GestureResponderEvent, StyleProp, ViewStyle, TextStyle } from 'react-native';

export type ButtonVariant =
  | 'default'
  | 'destructive'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'link';

export type ButtonSize = 'default' | 'sm' | 'lg' | 'icon';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  title?: string;
  children?: React.ReactNode;
  onPress?: (event: GestureResponderEvent) => void;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const Button: React.FC<ButtonProps> = (props) => {
  const {
    variant = 'default',
    size = 'default',
    title,
    children,
    style,
    textStyle,
    disabled,
    ...touchableProps
  } = props;

  const content = title ?? children;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      disabled={disabled}
      style={[
        styles.base,
        sizeStyles[size],
        variantStyles[variant],
        disabled && styles.disabled,
        style,
      ]}
      {...touchableProps}
    >
      {typeof content === 'string' ? (
        <Text
          style={[
            styles.text,
            textVariantStyles[variant],
            disabled && styles.textDisabled,
            textStyle,
          ]}
        >
          {content}
        </Text>
      ) : (
        content
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 36,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
  },
  disabled: {
    opacity: 0.5,
  },
  textDisabled: {
    // optional, keep same color but reduced opacity via parent
  },
});

const variantStyles: Record<ButtonVariant, StyleProp<ViewStyle>> = {
  default: {
    backgroundColor: '#4F46E5', // indigo-600
  },
  destructive: {
    backgroundColor: '#DC2626',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  secondary: {
    backgroundColor: '#E5E7EB',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  link: {
    backgroundColor: 'transparent',
  },
};

const textVariantStyles: Record<ButtonVariant, StyleProp<TextStyle>> = {
  default: {
    color: '#FFFFFF',
  },
  destructive: {
    color: '#FFFFFF',
  },
  outline: {
    color: '#111827',
  },
  secondary: {
    color: '#111827',
  },
  ghost: {
    color: '#111827',
  },
  link: {
    color: '#4F46E5',
    textDecorationLine: 'underline',
  },
};

const sizeStyles: Record<ButtonSize, StyleProp<ViewStyle>> = {
  default: {
    height: 36,
    paddingHorizontal: 16,
  },
  sm: {
    height: 32,
    paddingHorizontal: 12,
  },
  lg: {
    height: 44,
    paddingHorizontal: 20,
  },
  icon: {
    height: 36,
    width: 36,
    paddingHorizontal: 0,
  },
};
