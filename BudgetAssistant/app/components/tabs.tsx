// components/tabs.tsx
import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StyleProp, ViewStyle, TextStyle } from 'react-native';

type TabsContextValue = {
  value: string | undefined;
  setValue: (value: string) => void;
};

const TabsContext = createContext<TabsContextValue | undefined>(undefined);

function useTabsContext() {
  const ctx = useContext(TabsContext);
  if (!ctx) {
    throw new Error('Tabs components must be used within <Tabs>');
  }
  return ctx;
}

interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const Tabs: React.FC<TabsProps> = ({
  value,
  defaultValue,
  onValueChange,
  children,
  style,
}) => {
  const [internalValue, setInternalValue] = useState<string | undefined>(
    defaultValue,
  );

  const currentValue = value !== undefined ? value : internalValue;

  const setValue = (next: string) => {
    if (value === undefined) {
      setInternalValue(next);
    }
    onValueChange?.(next);
  };

  const ctxValue = useMemo(
    () => ({ value: currentValue, setValue }),
    [currentValue],
  );

  return (
    <TabsContext.Provider value={ctxValue}>
      <View style={[styles.tabsRoot, style]}>{children}</View>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const TabsList: React.FC<TabsListProps> = ({ children, style }) => {
  return <View style={[styles.tabsList, style]}>{children}</View>;
};

interface TabsTriggerProps {
  value: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  style,
  textStyle,
}) => {
  const { value: activeValue, setValue } = useTabsContext();
  const isActive = activeValue === value;

  return (
    <TouchableOpacity
      onPress={() => setValue(value)}
      style={[
        styles.tabsTrigger,
        isActive && styles.tabsTriggerActive,
        style,
      ]}
      activeOpacity={0.8}
    >
      <Text
        style={[
          styles.tabsTriggerText,
          isActive && styles.tabsTriggerTextActive,
          textStyle,
        ]}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  style,
}) => {
  const { value: activeValue } = useTabsContext();
  if (activeValue !== value) return null;

  return <View style={[styles.tabsContent, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  tabsRoot: {
    flexDirection: 'column',
    gap: 8,
  },
  tabsList: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: '#E5E7EB', // muted
    borderRadius: 999,
    padding: 3,
  },
  tabsTrigger: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabsTriggerActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
  },
  tabsTriggerText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#4B5563',
  },
  tabsTriggerTextActive: {
    color: '#111827',
  },
  tabsContent: {
    flex: 1,
  },
});
