// components/dialog.tsx
import React from 'react';
import { Modal, View, StyleSheet, TouchableWithoutFeedback, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';

interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

export const Dialog: React.FC<DialogProps> = ({
  open,
  onOpenChange,
  children,
}) => {
  if (!open) return null;

  return (
    <Modal
      transparent
      visible={open}
      animationType="fade"
      onRequestClose={() => onOpenChange(false)}
    >
      <View style={styles.overlayRoot}>
        <TouchableWithoutFeedback onPress={() => onOpenChange(false)}>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>

        <View style={styles.centered}>
          <View style={styles.contentWrapper}>{children}</View>
        </View>
      </View>
    </Modal>
  );
};

interface DialogContentProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const DialogContent: React.FC<DialogContentProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.content, style]}>{children}</View>;
};

interface DialogHeaderProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const DialogHeader: React.FC<DialogHeaderProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.header, style]}>{children}</View>;
};

interface DialogFooterProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const DialogFooter: React.FC<DialogFooterProps> = ({
  children,
  style,
}) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

interface DialogTitleProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const DialogTitle: React.FC<DialogTitleProps> = ({
  children,
  style,
}) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

interface DialogDescriptionProps {
  children: React.ReactNode;
  style?: StyleProp<TextStyle>;
}

export const DialogDescription: React.FC<DialogDescriptionProps> = ({
  children,
  style,
}) => {
  return <Text style={[styles.description, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  overlayRoot: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentWrapper: {
    width: '90%',
    maxWidth: 400,
  },
  content: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
  },
  header: {
    marginBottom: 8,
  },
  footer: {
    marginTop: 12,
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
