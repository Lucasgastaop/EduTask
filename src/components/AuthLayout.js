import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, fonts } from '../theme';

export function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.frame}>
            <View style={styles.brandBlock}>
              <View style={styles.mark}>
                <Ionicons name="school" size={22} color={colors.white} />
              </View>
              <Text style={styles.brand}>EduTask</Text>
              <Text style={styles.kicker}>Portal de tarefas acadêmicas</Text>
            </View>

            <View style={styles.card}>
              <Text style={styles.title}>{title}</Text>
              <Text style={styles.subtitle}>{subtitle}</Text>
              <View style={styles.form}>{children}</View>
            </View>

            {footer}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  flex: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  frame: {
    width: '100%',
    maxWidth: 460,
    alignSelf: 'center',
    gap: 18,
  },
  brandBlock: {
    gap: 6,
  },
  mark: {
    width: 46,
    height: 46,
    borderRadius: 14,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  brand: {
    fontFamily: fonts.display,
    fontSize: 36,
    color: colors.ink,
  },
  kicker: {
    fontFamily: fonts.medium,
    color: colors.muted,
    fontSize: 15,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 20,
    gap: 8,
  },
  title: {
    fontFamily: fonts.displayMedium,
    fontSize: 28,
    color: colors.ink,
  },
  subtitle: {
    fontFamily: fonts.regular,
    color: colors.muted,
    fontSize: 15,
    lineHeight: 22,
  },
  form: {
    marginTop: 10,
    gap: 14,
  },
});
