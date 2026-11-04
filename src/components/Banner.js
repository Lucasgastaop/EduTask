import { StyleSheet, Text, View } from 'react-native';
import { colors, fonts } from '../theme';

export function Banner({ message, type = 'error' }) {
  if (!message) {
    return null;
  }

  const isError = type === 'error';

  return (
    <View style={[styles.banner, isError ? styles.error : styles.success]}>
      <Text style={[styles.text, isError ? styles.errorText : styles.successText]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  error: {
    backgroundColor: colors.dangerSoft,
  },
  success: {
    backgroundColor: colors.successSoft,
  },
  text: {
    fontFamily: fonts.medium,
    fontSize: 14,
    lineHeight: 20,
  },
  errorText: {
    color: colors.danger,
  },
  successText: {
    color: colors.success,
  },
});
