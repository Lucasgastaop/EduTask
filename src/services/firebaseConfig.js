// Cole aqui os dados do app Web criado no Firebase Console:
// Configurações do projeto > Seus apps > SDK do Firebase.
// A apiKey do app cliente não protege os dados. A proteção fica nas regras
// do Firestore (arquivo firestore.rules na raiz do projeto).

export const firebaseConfig = {
  apiKey: 'AIzaSyCEIC0vMCzqqcEFwBzudJu1nqNnDWgwDUo',
  authDomain: 'edutask-9db85.firebaseapp.com',
  projectId: 'edutask-9db85',
  storageBucket: 'edutask-9db85.firebasestorage.app',
  messagingSenderId: '412066190786',
  appId: '1:412066190786:web:4ff5191ba1784e5024325b',
};

export function isFirebaseConfigured() {
  const { apiKey, projectId, appId } = firebaseConfig;
  return [apiKey, projectId, appId].every(
    (value) => Boolean(value) && !String(value).includes('COLE_AQUI')
  );
}
