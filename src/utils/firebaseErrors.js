const MESSAGES = {
  'app/not-configured':
    'Configure o Firebase em src/services/firebaseConfig.js antes de continuar.',
  'auth/invalid-email': 'Informe um e-mail válido.',
  'auth/user-disabled': 'Esta conta foi desativada.',
  'auth/user-not-found': 'Não encontramos uma conta com esse e-mail.',
  'auth/wrong-password': 'Senha incorreta.',
  'auth/invalid-credential': 'E-mail ou senha incorretos.',
  'auth/email-already-in-use': 'Este e-mail já está cadastrado.',
  'auth/weak-password': 'A senha precisa ter pelo menos 6 caracteres.',
  'auth/too-many-requests': 'Muitas tentativas. Aguarde um momento e tente de novo.',
  'auth/network-request-failed': 'Sem conexão com o Firebase. Verifique sua internet.',
  'auth/missing-password': 'Informe a senha.',
  'auth/invalid-api-key': 'A chave do Firebase é inválida. Revise firebaseConfig.js.',
  'auth/operation-not-allowed':
    'Ative o provedor E-mail/Senha no Firebase Authentication.',
  'auth/invalid-login-credentials': 'E-mail ou senha incorretos.',
  'permission-denied':
    'Sem permissão para acessar estas tarefas. Publique as regras do arquivo firestore.rules.',
  unavailable: 'O Firestore está indisponível. Verifique sua conexão.',
  unauthenticated: 'Sua sessão expirou. Entre novamente.',
  'not-found': 'Esta tarefa não existe mais.',
  'failed-precondition': 'Não foi possível consultar as tarefas no Firestore.',
};

export function getFirebaseErrorMessage(error, fallback) {
  const code = error?.code;
  if (code && MESSAGES[code]) {
    return MESSAGES[code];
  }
  return fallback;
}
