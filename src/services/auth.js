import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth, configured } from './firebase';

function assertConfigured() {
  if (!configured || !auth) {
    const error = new Error('Firebase não configurado');
    error.code = 'app/not-configured';
    throw error;
  }
}

export async function signIn(email, password) {
  assertConfigured();
  const credential = await signInWithEmailAndPassword(auth, email.trim().toLowerCase(), password);
  return credential.user;
}

export async function signUp({ name, email, password }) {
  assertConfigured();
  const credential = await createUserWithEmailAndPassword(
    auth,
    email.trim().toLowerCase(),
    password
  );
  await updateProfile(credential.user, { displayName: name.trim() });
  return credential.user;
}
