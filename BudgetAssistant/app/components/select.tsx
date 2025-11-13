// components/select.tsx
import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type SelectContextValue = {
  value?: string;
  setValue: (value: string) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
  placeholder?: string;
};

const SelectContext = createContext<SelectContextValue | undefined>(undefined);

function useSelectContext() {
  const ctx = useContext(SelectContext);
  if (!ctx) {
    throw new Error('Select components must be used within <Select>');
  }
  return ctx;
}

interface SelectProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  placeholder?: string;
}

export const Select: React.FC<SelectProps> = ({
  value,
  defaultValue,
  onValueChange,
  children,
  placeholder,
}) => {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue,
  );
  const [open, setOpen] = useState(false);

  const currentValue = value !== undefined ? value : internalValue;

  const setValue = (v: string) => {
    if (value === undefined) {
      setInternalValue(v);
    }
    onValueChange?.(v);
  };

  const ctxValue = useMemo(
    () => ({ value: currentValue, setValue, open, setOpen, placeholder }),
    [currentValue, open, placeholder],
  );

  return (
    <SelectContext.Provider value={ctxValue}>
      {children}
    </SelectContext.Provider>
  );
};

interface SelectTriggerProps {
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const SelectTrigger: React.FC<SelectTriggerProps> = ({
  style,
  textStyle,
}) => {
  const { open, setOpen, value, placeholder } = useSelectContext();

  return (
    <TouchableOpacity
      style={[styles.trigger, style]}
      onPress={() => setOpen(!open)}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.triggerText,
          !value && styles.placeholderText,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {value || placeholder || 'Select'}
      </Text>
      <Ionicons name="chevron-down" size={18} color="#6B7280" />
    </TouchableOpacity>
  );
};

interface SelectContentProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SelectContent: React.FC<SelectContentProps> = ({
  children,
  style,
}) => {
  const { open, setOpen } = useSelectContext();

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={() => setOpen(false)}
    >
      <TouchableOpacity
        style={styles.overlay}
        activeOpacity={1}
        onPress={() => setOpen(false)}
      >
        <View style={[styles.contentContainer, style]}>
          <ScrollView>{children}</ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

interface SelectItemProps {
  value: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const SelectItem: React.FC<SelectItemProps> = ({
  value,
  children,
  style,
  textStyle,
}) => {
  const { value: selected, setValue, setOpen } = useSelectContext();
  const isSelected = selected === value;

  const handlePress = () => {
    setValue(value);
    setOpen(false);
  };

  return (
    <TouchableOpacity
      style={[styles.item, isSelected && styles.itemSelected, style]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.itemText,
          isSelected && styles.itemTextSelected,
          textStyle,
        ]}
        numberOfLines={1}
      >
        {children}
      </Text>
      {isSelected && (
        <Ionicons name="checkmark" size={18} color="#4F46E5" />
      )}
    </TouchableOpacity>
  );
};

interface SelectLabelProps {
  children: ReactNode;
  style?: StyleProp<TextStyle>;
}

export const SelectLabel: React.FC<SelectLabelProps> = ({
  children,
  style,
}) => {
  return <Text style={[styles.label, style]}>{children}</Text>;
};

interface SelectSeparatorProps {
  style?: StyleProp<ViewStyle>;
}

export const SelectSeparator: React.FC<SelectSeparatorProps> = ({
  style,
}) => {
  return <View style={[styles.separator, style]} />;
};

interface SelectGroupProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const SelectGroup: React.FC<SelectGroupProps> = ({
  children,
  style,
}) => {
  return <View style={style}>{children}</View>;
};

// Simple value component (optional, for API parity)
interface SelectValueProps {
  style?: StyleProp<TextStyle>;
}

export const SelectValue: React.FC<SelectValueProps> = () => {
  // For RN, value is shown in Trigger instead, so this is a no-op placeholder
  return null;
};

const styles = StyleSheet.create({
  trigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#F9FAFB',
  },
  triggerText: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
    marginRight: 8,
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  contentContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    maxHeight: '70%',
    paddingVertical: 8,
    paddingHorizontal: 4,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    justifyContent: 'space-between',
  },
  itemSelected: {
    backgroundColor: '#EEF2FF',
  },
  itemText: {
    fontSize: 14,
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  itemTextSelected: {
    fontWeight: '600',
  },
  label: {
    fontSize: 12,
    color: '#6B7280',
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
    marginHorizontal: 8,
  },
});
