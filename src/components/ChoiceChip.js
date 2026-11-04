import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, fonts } from '../theme';

export function ChoiceChip({ label, selected, onPress }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      style={[styles.chip, selected && styles.chipSelected]}
    >
      <Text style={[styles.label, selected && styles.labelSelected]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: colors.teal,
    borderColor: colors.teal,
  },
  label: {
    fontFamily: fonts.semibold,
    color: colors.ink,
    fontSize: 14,
  },
  labelSelected: {
    color: colors.white,
  },
});
