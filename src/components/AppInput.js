import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

export function AppInput({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  autoComplete,
  textContentType,
  multiline = false,
}) {
  const [hidden, setHidden] = useState(secureTextEntry);

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, multiline && styles.fieldMultiline]}>
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={colors.muted}
          secureTextEntry={Boolean(secureTextEntry && hidden)}
          keyboardType={keyboardType}
          autoCapitalize={multiline ? 'sentences' : autoCapitalize}
          autoCorrect={multiline}
          autoComplete={autoComplete}
          textContentType={textContentType}
          multiline={multiline}
          style={[styles.input, multiline && styles.inputMultiline]}
        />
        {secureTextEntry ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={hidden ? 'Mostrar senha' : 'Ocultar senha'}
            hitSlop={8}
            onPress={() => setHidden((current) => !current)}
          >
            <Ionicons
              name={hidden ? 'eye-outline' : 'eye-off-outline'}
              size={20}
              color={colors.muted}
            />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    gap: 8,
  },
  label: {
    fontFamily: fonts.semibold,
    color: colors.ink,
    fontSize: 14,
  },
  field: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: colors.white,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  fieldMultiline: {
    alignItems: 'flex-start',
    paddingVertical: 12,
  },
  input: {
    flex: 1,
    fontFamily: fonts.regular,
    color: colors.ink,
    fontSize: 16,
    paddingVertical: 0,
    outlineStyle: 'none',
  },
  inputMultiline: {
    minHeight: 110,
    textAlignVertical: 'top',
  },
});
