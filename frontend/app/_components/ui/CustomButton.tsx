import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, StyleProp, ViewStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void | Promise<void>;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
}

export default function CustomButton({ 
  title, 
  onPress, 
  variant = 'primary',
  disabled = false,
  loading = false,
  style,
}: CustomButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        isDisabled && styles.disabled,
        // allow caller to override layout (kept last so overrides apply)
        style,
      ]} 
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'primary' ? '#fff' : '#007AFF'} />
      ) : (
        <Text style={[
          styles.text,
          variant === 'primary' ? styles.primaryText : styles.secondaryText,
          isDisabled && styles.disabledText
        ]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
    minHeight: 50,
    justifyContent: 'center',
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  disabled: {
    backgroundColor: '#CCCCCC',
    borderColor: '#CCCCCC',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
  },
  primaryText: {
    color: 'white',
  },
  secondaryText: {
    color: '#007AFF',
  },
  disabledText: {
    color: '#666666',
  },
});