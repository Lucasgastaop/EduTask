import { Platform } from 'react-native';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { browserLocalPersistence, getAuth, initializeAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { firebaseConfig, isFirebaseConfigured } from './firebaseConfig';

function createAuth(app) {
  try {
    if (Platform.OS === 'web') {
      return initializeAuth(app, { persistence: browserLocalPersistence });
    }

    const { getReactNativePersistence } = require('firebase/auth');
    if (typeof getReactNativePersistence === 'function') {
      return initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage),
      });
    }

    return initializeAuth(app);
  } catch {
    // O Fast Refresh do Expo pode inicializar o Auth mais de uma vez.
    return getAuth(app);
  }
}

export let configured = isFirebaseConfigured();
export let auth = null;
export let db = null;

if (configured) {
  try {
    const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
    auth = createAuth(app);
    db = getFirestore(app);
  } catch {
    configured = false;
    auth = null;
    db = null;
  }
}
