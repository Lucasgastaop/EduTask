import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { CATEGORY_COLORS } from '../constants';
import { formatDate } from '../utils/format';
import { colors, fonts } from '../theme';

export function TaskCard({ task, busy, onToggle, onEdit, onDelete }) {
  const palette = CATEGORY_COLORS[task.category] ?? CATEGORY_COLORS.Tarefa;
  const done = task.status === 'concluido';

  return (
    <View style={styles.card}>
      <View style={[styles.rail, { backgroundColor: palette.text }]} />
      <View style={styles.body}>
        <View style={styles.topRow}>
          <View style={[styles.badge, { backgroundColor: palette.background }]}>
            <Text style={[styles.badgeText, { color: palette.text }]}>{task.category}</Text>
          </View>
          <Text style={styles.date}>{formatDate(task.createdAt)}</Text>
        </View>

        <Text style={[styles.title, done && styles.titleDone]}>{task.title}</Text>
        <Text style={styles.description}>{task.description}</Text>

        <View style={styles.statusRow}>
          <View style={[styles.status, done ? styles.statusDone : styles.statusPending]}>
            <Text style={[styles.statusText, done ? styles.statusTextDone : styles.statusTextPending]}>
              {done ? 'Concluído' : 'Pendente'}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <Pressable
            accessibilityRole="button"
            disabled={busy}
            onPress={onToggle}
            style={styles.action}
          >
            {busy ? (
              <ActivityIndicator color={colors.teal} size="small" />
            ) : (
              <Text style={styles.actionPrimary}>{done ? 'Reabrir' : 'Concluir'}</Text>
            )}
          </Pressable>
          <Pressable accessibilityRole="button" disabled={busy} onPress={onEdit} style={styles.action}>
            <Text style={styles.actionText}>Editar</Text>
          </Pressable>
          <Pressable accessibilityRole="button" disabled={busy} onPress={onDelete} style={styles.action}>
            <Text style={styles.actionDanger}>Excluir</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.line,
    overflow: 'hidden',
  },
  rail: {
    width: 6,
  },
  body: {
    flex: 1,
    padding: 16,
    gap: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 12,
  },
  badge: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  date: {
    fontFamily: fonts.medium,
    color: colors.muted,
    fontSize: 12,
  },
  title: {
    fontFamily: fonts.bold,
    color: colors.ink,
    fontSize: 17,
  },
  titleDone: {
    textDecorationLine: 'line-through',
    color: colors.muted,
  },
  description: {
    fontFamily: fonts.regular,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  statusRow: {
    flexDirection: 'row',
  },
  status: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  statusPending: {
    backgroundColor: colors.amberSoft,
  },
  statusDone: {
    backgroundColor: colors.successSoft,
  },
  statusText: {
    fontFamily: fonts.semibold,
    fontSize: 12,
  },
  statusTextPending: {
    color: colors.amber,
  },
  statusTextDone: {
    color: colors.success,
  },
  actions: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  action: {
    flex: 1,
    minHeight: 40,
    borderRadius: 10,
    backgroundColor: colors.paper,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionPrimary: {
    fontFamily: fonts.bold,
    color: colors.tealDark,
    fontSize: 13,
  },
  actionText: {
    fontFamily: fonts.semibold,
    color: colors.ink,
    fontSize: 13,
  },
  actionDanger: {
    fontFamily: fonts.semibold,
    color: colors.danger,
    fontSize: 13,
  },
});
