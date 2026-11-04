import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Banner } from '../components/Banner';
import { ChoiceChip } from '../components/ChoiceChip';
import { TaskCard } from '../components/TaskCard';
import { useAuth } from '../context/AuthContext';
import { removeTask, setTaskStatus, subscribeToUserTasks } from '../services/tasks';
import { colors, fonts } from '../theme';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';
import { displayNameOf } from '../utils/format';

const FILTERS = [
  { id: 'todas', label: 'Todas' },
  { id: 'pendente', label: 'Pendentes' },
  { id: 'concluido', label: 'Concluídas' },
];

export function HomeScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('todas');
  const [error, setError] = useState('');
  const [feedback, setFeedback] = useState('');
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToUserTasks(
      user.uid,
      (items) => {
        setTasks(items);
        setLoading(false);
        setError('');
      },
      (caught) => {
        setLoading(false);
        const message = getFirebaseErrorMessage(
          caught,
          'Não foi possível carregar as tarefas.'
        );
        setError(message);
        Alert.alert('Falha ao carregar', message);
      }
    );

    return unsubscribe;
  }, [user.uid]);

  useEffect(() => {
    if (!feedback) {
      return undefined;
    }

    const timeout = setTimeout(() => setFeedback(''), 2800);
    return () => clearTimeout(timeout);
  }, [feedback]);

  const filtered = useMemo(() => {
    if (filter === 'todas') {
      return tasks;
    }
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  const pendingCount = tasks.filter((task) => task.status === 'pendente').length;
  const doneCount = tasks.length - pendingCount;

  function confirmLogout() {
    Alert.alert('Sair', 'Deseja encerrar a sessão?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Sair',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (caught) {
            const message = getFirebaseErrorMessage(caught, 'Não foi possível sair da conta.');
            Alert.alert('Falha ao sair', message);
          }
        },
      },
    ]);
  }

  function confirmDelete(task) {
    Alert.alert('Excluir tarefa', `Remover "${task.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Excluir',
        style: 'destructive',
        onPress: () => handleDelete(task),
      },
    ]);
  }

  async function handleDelete(task) {
    setBusyId(task.id);
    try {
      await removeTask(task.id);
      setFeedback('Tarefa excluída.');
    } catch (caught) {
      const message = getFirebaseErrorMessage(caught, 'Não foi possível excluir a tarefa.');
      setError(message);
      Alert.alert('Falha ao excluir', message);
    } finally {
      setBusyId(null);
    }
  }

  async function handleToggle(task) {
    const nextStatus = task.status === 'concluido' ? 'pendente' : 'concluido';
    setBusyId(task.id);
    try {
      await setTaskStatus(task.id, nextStatus);
      setFeedback(nextStatus === 'concluido' ? 'Tarefa concluída.' : 'Tarefa reaberta.');
    } catch (caught) {
      const message = getFirebaseErrorMessage(caught, 'Não foi possível atualizar a tarefa.');
      setError(message);
      Alert.alert('Falha ao atualizar', message);
    } finally {
      setBusyId(null);
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.frame}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.kicker}>EduTask</Text>
            <Text style={styles.greeting}>Olá, {displayNameOf(user)}</Text>
            <Text style={styles.summary}>
              {pendingCount} pendente{pendingCount === 1 ? '' : 's'} · {doneCount} concluída
              {doneCount === 1 ? '' : 's'}
            </Text>
          </View>
          <Pressable accessibilityRole="button" onPress={confirmLogout} style={styles.logout}>
            <Ionicons name="log-out-outline" size={18} color={colors.tealDark} />
            <Text style={styles.logoutLabel}>Sair</Text>
          </Pressable>
        </View>

        <View style={styles.filters}>
          {FILTERS.map((item) => (
            <ChoiceChip
              key={item.id}
              label={item.label}
              selected={filter === item.id}
              onPress={() => setFilter(item.id)}
            />
          ))}
        </View>

        <Banner message={error} />
        <Banner message={feedback} type="success" />

        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <TaskCard
              task={item}
              busy={busyId === item.id}
              onToggle={() => handleToggle(item)}
              onEdit={() =>
                navigation.navigate('AddEditTask', {
                  task: {
                    id: item.id,
                    title: item.title,
                    description: item.description,
                    category: item.category,
                    status: item.status,
                  },
                })
              }
              onDelete={() => confirmDelete(item)}
            />
          )}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons
                name={loading ? 'hourglass-outline' : 'file-tray-outline'}
                size={28}
                color={colors.teal}
              />
              <Text style={styles.emptyTitle}>
                {loading ? 'Carregando atividades...' : 'Nenhuma atividade por aqui'}
              </Text>
              <Text style={styles.emptyText}>
                {loading
                  ? 'Buscando as tarefas da sua conta.'
                  : 'Adicione uma tarefa, um aviso ou um pedido de suporte.'}
              </Text>
            </View>
          }
        />

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Adicionar tarefa"
          onPress={() => navigation.navigate('AddEditTask')}
          style={styles.fab}
        >
          <Ionicons name="add" size={28} color={colors.white} />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.paper,
  },
  frame: {
    flex: 1,
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: 20,
    paddingTop: 8,
    gap: 14,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  kicker: {
    fontFamily: fonts.semibold,
    color: colors.teal,
    fontSize: 13,
    letterSpacing: 0.4,
  },
  greeting: {
    fontFamily: fonts.display,
    color: colors.ink,
    fontSize: 30,
  },
  summary: {
    fontFamily: fonts.regular,
    color: colors.muted,
    fontSize: 14,
  },
  logout: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: colors.tealSoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  logoutLabel: {
    fontFamily: fonts.bold,
    color: colors.tealDark,
    fontSize: 14,
  },
  filters: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  list: {
    gap: 12,
    paddingBottom: 96,
    flexGrow: 1,
  },
  empty: {
    marginTop: 36,
    alignItems: 'flex-start',
    gap: 6,
    padding: 18,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
  },
  emptyTitle: {
    fontFamily: fonts.bold,
    color: colors.ink,
    fontSize: 16,
  },
  emptyText: {
    fontFamily: fonts.regular,
    color: colors.muted,
    fontSize: 14,
    lineHeight: 20,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 20,
    backgroundColor: colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: colors.ink,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
});
