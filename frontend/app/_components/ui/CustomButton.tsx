import { TouchableOpacity, Text, StyleSheet, StyleProp, ViewStyle } from 'react-native';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
  style?: StyleProp<ViewStyle>;
}

export default function CustomButton({ title, onPress, variant = 'primary', style }: CustomButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.button,
        variant === 'primary' ? styles.primary : styles.secondary,
        style,
      ]} 
      onPress={onPress}
    >
      <Text style={[
        styles.text,
        variant === 'primary' ? styles.primaryText : styles.secondaryText
      ]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 8,
  },
  primary: {
    backgroundColor: '#007AFF',
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#007AFF',
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
});