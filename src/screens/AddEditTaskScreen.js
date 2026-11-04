import { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { Banner } from '../components/Banner';
import { ChoiceChip } from '../components/ChoiceChip';
import { CATEGORIES, STATUSES } from '../constants';
import { useAuth } from '../context/AuthContext';
import { createTask, updateTask } from '../services/tasks';
import { colors, fonts } from '../theme';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';
import { validateTask } from '../utils/validation';

export function AddEditTaskScreen({ navigation, route }) {
  const existing = route.params?.task;
  const isEditing = Boolean(existing?.id);
  const { user } = useAuth();

  const [title, setTitle] = useState(existing?.title ?? '');
  const [description, setDescription] = useState(existing?.description ?? '');
  const [category, setCategory] = useState(existing?.category ?? 'Tarefa');
  const [status, setStatus] = useState(existing?.status ?? 'pendente');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSave() {
    const message = validateTask({ title, description, category, status });
    if (message) {
      setError(message);
      Alert.alert(
        message === 'Preencha todos os campos.' ? 'Campos obrigatórios' : 'Dados inválidos',
        message
      );
      return;
    }

    setError('');
    setLoading(true);
    try {
      const payload = { title, description, category, status };
      if (isEditing) {
        await updateTask(existing.id, payload);
      } else {
        await createTask(user.uid, payload);
      }

      Alert.alert(
        isEditing ? 'Tarefa atualizada' : 'Tarefa criada',
        isEditing
          ? 'As alterações já estão no seu painel.'
          : 'A atividade já aparece no seu painel.'
      );
      navigation.goBack();
    } catch (caught) {
      const friendly = getFirebaseErrorMessage(
        caught,
        'Não foi possível salvar a tarefa.'
      );
      setError(friendly);
      Alert.alert('Falha ao salvar', friendly);
    } finally {
      setLoading(false);
    }
  }

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
            <View style={styles.header}>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel="Voltar"
                onPress={() => navigation.goBack()}
                style={styles.back}
              >
                <Ionicons name="arrow-back" size={20} color={colors.ink} />
              </Pressable>
              <View style={styles.headerText}>
                <Text style={styles.kicker}>{isEditing ? 'Edição' : 'Nova atividade'}</Text>
                <Text style={styles.title}>{isEditing ? 'Editar atividade' : 'Adicionar atividade'}</Text>
              </View>
            </View>

            <View style={styles.card}>
              <Banner message={error} />
              <AppInput
                label="Título"
                value={title}
                onChangeText={(text) => {
                  setTitle(text);
                  setError('');
                }}
                placeholder="Ex.: Entregar o checkpoint"
                autoCapitalize="sentences"
              />
              <AppInput
                label="Descrição"
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  setError('');
                }}
                placeholder="Descreva a demanda, o prazo ou o pedido de suporte"
                multiline
                autoCapitalize="sentences"
              />

              <View style={styles.group}>
                <Text style={styles.groupLabel}>Categoria</Text>
                <View style={styles.chips}>
                  {CATEGORIES.map((item) => (
                    <ChoiceChip
                      key={item.id}
                      label={item.label}
                      selected={category === item.id}
                      onPress={() => setCategory(item.id)}
                    />
                  ))}
                </View>
              </View>

              <View style={styles.group}>
                <Text style={styles.groupLabel}>Status</Text>
                <View style={styles.chips}>
                  {STATUSES.map((item) => (
                    <ChoiceChip
                      key={item.id}
                      label={item.label}
                      selected={status === item.id}
                      onPress={() => setStatus(item.id)}
                    />
                  ))}
                </View>
              </View>

              <AppButton
                label={isEditing ? 'Salvar alterações' : 'Adicionar tarefa'}
                onPress={handleSave}
                loading={loading}
              />
            </View>
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
    padding: 20,
  },
  frame: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  back: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.line,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    flex: 1,
    gap: 2,
  },
  kicker: {
    fontFamily: fonts.semibold,
    color: colors.teal,
    fontSize: 13,
  },
  title: {
    fontFamily: fonts.displayMedium,
    color: colors.ink,
    fontSize: 26,
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.line,
    padding: 18,
    gap: 16,
  },
  group: {
    gap: 8,
  },
  groupLabel: {
    fontFamily: fonts.semibold,
    color: colors.ink,
    fontSize: 14,
  },
  chips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
});
