import { useState } from 'react';
import { Alert, Pressable, StyleSheet, Text } from 'react-native';
import { AuthLayout } from '../components/AuthLayout';
import { AppButton } from '../components/AppButton';
import { AppInput } from '../components/AppInput';
import { Banner } from '../components/Banner';
import { useAuth } from '../context/AuthContext';
import { signIn } from '../services/auth';
import { colors, fonts } from '../theme';
import { getFirebaseErrorMessage } from '../utils/firebaseErrors';
import { validateAuth } from '../utils/validation';

export function LoginScreen({ navigation }) {
  const { configured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    const message = validateAuth({ email, password, isRegister: false });
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
      await signIn(email, password);
    } catch (caught) {
      const friendly = getFirebaseErrorMessage(
        caught,
        'Não foi possível entrar. Tente novamente.'
      );
      setError(friendly);
      Alert.alert('Falha no acesso', friendly);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      title="Entrar"
      subtitle="Acesse o painel para acompanhar tarefas, prazos e pedidos de suporte."
      footer={
        <Pressable accessibilityRole="button" onPress={() => navigation.navigate('Register')}>
          <Text style={styles.footer}>
            Não tem conta? <Text style={styles.footerStrong}>Cadastre-se</Text>
          </Text>
        </Pressable>
      }
    >
      {!configured ? (
        <Banner message="Cole as credenciais do Firebase em src/services/firebaseConfig.js para ativar o login." />
      ) : null}
      <Banner message={error} />
      <AppInput
        label="E-mail"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError('');
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
          setError('');
        }}
        placeholder="Sua senha"
        secureTextEntry
        autoComplete="password"
        textContentType="password"
      />
      <AppButton label="Entrar" onPress={handleLogin} loading={loading} />
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
