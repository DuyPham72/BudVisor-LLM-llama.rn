// components/Sheet.tsx
import React, { useEffect, useRef } from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Text, StyleProp, ViewStyle, TextStyle, Animated, Dimensions } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Sheet: React.FC<SheetProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  const translateX = useRef(new Animated.Value(SCREEN_WIDTH)).current;

  useEffect(() => {
    if (open) {
      // When opening, animate from right (off-screen) to 0
      translateX.setValue(SCREEN_WIDTH);
      Animated.timing(translateX, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    }
    // When closing, we just let the parent hide the Modal immediately.
    // (If you want a close animation too, we can add an internal visible state.)
  }, [open, translateX]);

  if (!open) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={open}
      animationType="none" // disable bottom slide
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={styles.modalRoot}>
        {/* Tap outside to close */}
        <TouchableWithoutFeedback onPress={() => onOpenChange(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        {/* Right-side container */}
        <View style={styles.container}>
          <Animated.View
            style={[styles.content, { transform: [{ translateX }] }]}
          >
            <View style={styles.innerContent}>{children}</View>
          </Animated.View>
        </View>
      </View>
    </Modal>
  );
};

interface SheetContentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  side?: 'right' | 'left' | 'top' | 'bottom'; // kept for API compatibility
}

export const SheetContent: React.FC<SheetContentProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.slot, style]}>{children}</View>;
};

interface SheetHeaderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SheetHeader: React.FC<SheetHeaderProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.header, style]}>{children}</View>;
};

interface SheetFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SheetFooter: React.FC<SheetFooterProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

interface SheetTitleProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const SheetTitle: React.FC<SheetTitleProps> = ({
  children,
  style,
}) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

interface SheetDescriptionProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const SheetDescription: React.FC<SheetDescriptionProps> = ({
  children,
  style,
}) => {
  return <Text style={[styles.description, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  container: {
    flex: 1,
    alignItems: 'flex-end', // stick panel to the right
    justifyContent: 'flex-start',
  },
  content: {
    width: '40%',
    height: '100%',
  },
  innerContent: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: -2, height: 0 },
    elevation: 4,
  },
  slot: {
    flex: 1,
  },
  header: {
    paddingVertical: 12,
  },
  footer: {
    marginTop: 'auto',
    paddingVertical: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 4,
  },
});
