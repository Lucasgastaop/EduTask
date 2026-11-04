import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { AuthLayout } from '../components/AuthLayout';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { Banner } from '../components/Banner';
import { useAuth } from '../context/AuthContext';
import { signUp } from '../services/auth';
import { colors, fonts } from '../theme';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';
import { validateAuth } from '../utils/validation';

export function RegisterScreen({ navigation }) {
  const { configured, refreshUser } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function clearError() {
    setError('');
  }

  async function handleRegister() {
    const message = validateAuth({
      name,
      email,
      password,
      confirmPassword,
      isRegister: true,
    });

    if (message) {
      setError(message);
      Alert.alert(message === 'Preencha todos os campos.' ? 'Campos obrigatórios' : 'Dados inválidos', message);
      return;
    }

    setError('');
    setLoading(true);
    try {
      await signUp({ name, email, password });
      await refreshUser();
    } catch (caught) {
      const friendly = getFirebaseErrorMessage(
        caught,
        'Não foi possível criar a conta. Tente novamente.'
      );
      setError(friendly);
      Alert.alert('Falha no cadastro', friendly);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Criar conta"
      subtitle="O cadastro usa e-mail e senha do Firebase Authentication."
      footer={
        <Pressable accessibilityRole="button" onPress={() => navigation.goBack()}>
          <Text style={styles.footer}>
            Já tem conta? <Text style={styles.footerStrong}>Entrar</Text>
          </Text>
        </Pressable>
      }
    >
      {!configured ? (
        <Banner message="Cole as credenciais do Firebase em src/services/firebaseConfig.js para concluir o cadastro." />
      ) : null}
      <Banner message={error} />
      <AppInput
        label="Nome"
        value={name}
        onChangeText={(text) => {
          setName(text);
          clearError();
        }}
        placeholder="Como devemos te chamar"
        autoCapitalize="words"
        autoComplete="name"
        textContentType="name"
      />
      <AppInput
        label="E-mail"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          clearError();
        }}
        placeholder="nome@fiap.com.br"
        keyboardType="email-address"
        autoComplete="email"
        textContentType="emailAddress"
      />
      <AppInput
        label="Senha"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          clearError();
        }}
        placeholder="Mínimo de 6 caracteres"
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <AppInput
        label="Confirmar senha"
        value={confirmPassword}
        onChangeText={(text) => {
          setConfirmPassword(text);
          clearError();
        }}
        placeholder="Repita a senha"
        secureTextEntry
        autoComplete="new-password"
        textContentType="newPassword"
      />
      <AppButton label="Cadastrar" onPress={handleRegister} loading={loading} />
    </AuthLayout>
  );
}

const styles = StyleSheet.create({
  footer: {
    textAlign: 'center',
    fontFamily: fonts.regular,
    color: colors.muted,
    fontSize: 15,
  },
  footerStrong: {
    fontFamily: fonts.bold,
    color: colors.tealDark,
  },
});
