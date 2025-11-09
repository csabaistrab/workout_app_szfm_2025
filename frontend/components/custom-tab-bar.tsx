import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
} from 'react-native';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { IconSymbol } from './ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const colorScheme = useColorScheme();
  const inactiveColor = Colors[colorScheme ?? 'light'].tabIconDefault;
  const { width } = Dimensions.get('window');
  const tabCount = state.routes.length;
  const tabWidth = width / tabCount;
  // indicator dimensions: base factor 0.6 of tabWidth, but enlarge by 4px total (2px each side)
  const indicatorBaseFactor = 0.6;
  const indicatorExtra = 12; // increased: +6px each side -> total +12 width, +12 height (adds another 2px/side)
  const indicatorWidth = tabWidth * indicatorBaseFactor + indicatorExtra;
  const indicatorHeight = 44 + indicatorExtra; // base 44 -> increase by 4
  const indicatorOffset = (tabWidth - indicatorWidth) / 2;
  // move contents up by 10px
  const contentShiftY = -10;

  const translateX = useRef(new Animated.Value(state.index * tabWidth)).current;

  useEffect(() => {
    Animated.spring(translateX, {
      toValue: state.index * tabWidth,
      useNativeDriver: true,
      mass: 0.5,
    }).start();
  }, [state.index, tabWidth, translateX]);

  return (
    <View style={styles.container}>
      {/* sliding indicator */}
      <Animated.View
        style={[
          styles.indicator,
          {
            width: indicatorWidth,
            height: indicatorHeight,
            bottom: 28, // moved up additional 10px as requested (indicator sits higher)
            transform: [{ translateX: Animated.add(translateX, new Animated.Value(indicatorOffset)) }],
          },
        ]}
      />

      <View style={styles.row}>
        {state.routes.map((route, idx) => {
          const focused = state.index === idx;
          const descriptor = descriptors[route.key];
          const label = descriptor.options.title ?? route.name;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({ type: 'tabLongPress', target: route.key });
          };

          const color = focused ? '#FFFFFF' : inactiveColor;

          // Render icon: prefer descriptor-provided tabBarIcon if available
          let icon = null as any;
          if (descriptor.options.tabBarIcon) {
            try {
              icon = descriptor.options.tabBarIcon({ color, focused, size: focused ? 34 : 28 } as any);
            } catch (e) {
              // fallback
              icon = <IconSymbol name="circle" size={focused ? 34 : 28} color={color} />;
            }
          }

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={focused ? { selected: true } : {}}
              accessibilityLabel={descriptor.options.tabBarAccessibilityLabel}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              activeOpacity={0.8}
            >
              <View style={[styles.contentShift, { transform: [{ translateY: contentShiftY }] }]}>
                {icon}
                <Text style={[styles.label, { color }]}>{label}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.light.background,
  },
  row: {
    flexDirection: 'row',
    height: 92, // increased further so the bar doesn't interfere with gesture area
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingBottom: 6,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
  indicator: {
    position: 'absolute',
    backgroundColor: '#111111',
    borderRadius: 8,
    zIndex: 0,
    opacity: 1,
  },
  contentShift: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
