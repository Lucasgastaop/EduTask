// Cole aqui os dados do app Web criado no Firebase Console:
// Configurações do projeto > Seus apps > SDK do Firebase.
// A apiKey do app cliente não protege os dados. A proteção fica nas regras
// do Firestore (arquivo firestore.rules na raiz do projeto).

export const firebaseConfig = {
  apiKey: 'COLE_AQUI_API_KEY',
  authDomain: 'COLE_AQUI_PROJECT_ID.firebaseapp.com',
  projectId: 'COLE_AQUI_PROJECT_ID',
  storageBucket: 'COLE_AQUI_PROJECT_ID.appspot.com',
  messagingSenderId: 'COLE_AQUI_SENDER_ID',
  appId: 'COLE_AQUI_APP_ID',
};

export function isFirebaseConfigured() {
  const { apiKey, projectId, appId } = firebaseConfig;
  return [apiKey, projectId, appId].every(
    (value) => Boolean(value) && !String(value).includes('COLE_AQUI')
  );
}
