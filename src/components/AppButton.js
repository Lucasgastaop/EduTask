import { ActivityIndicator, Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';

export function AppButton({ label, onPress, loading = false, variant = 'primary' }) {
  const lightLabel = variant === 'primary' || variant === 'danger';

  return (
    <Pressable
      accessibilityRole="button"
      disabled={loading}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        pressed && styles.pressed,
        loading && styles.disabled,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={lightLabel ? colors.white : colors.teal} />
      ) : (
        <Text style={[styles.label, lightLabel ? styles.labelLight : styles.labelDark]}>
          {label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 18,
  },
  primary: {
    backgroundColor: colors.teal,
  },
  secondary: {
    backgroundColor: colors.sand,
  },
  danger: {
    backgroundColor: colors.danger,
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  pressed: {
    opacity: 0.86,
  },
  disabled: {
    opacity: 0.7,
  },
  label: {
    fontFamily: fonts.bold,
    fontSize: 16,
  },
  labelLight: {
    color: colors.white,
  },
  labelDark: {
    color: colors.ink,
  },
});
