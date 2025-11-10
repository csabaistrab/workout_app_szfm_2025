import { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import * as Haptics from 'expo-haptics';
import { ViewStyle } from 'react-native';

export function HapticTab(props: BottomTabBarButtonProps) {
  const selected = !!props.accessibilityState?.selected;

  const focusedStyle: ViewStyle = selected
    ? {
        backgroundColor: '#333333', // dark gray square when focused
        paddingHorizontal: 12,
        paddingVertical: 8,
        borderRadius: 8,
      }
    : {};

  return (
    <PlatformPressable
      {...props}
      // merge the focused style so the tab shows a dark square when selected
      style={[focusedStyle, props.style as any]}
      onPressIn={(ev) => {
        if (process.env.EXPO_OS === 'ios') {
          // Add a soft haptic feedback when pressing down on the tabs.
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        }
        props.onPressIn?.(ev);
      }}
    />
  );
}
