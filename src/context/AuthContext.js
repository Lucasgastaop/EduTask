import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, configured } from '../services/firebase';

const AuthContext = createContext(null);

function toSession(firebaseUser) {
  if (!firebaseUser) {
    return null;
  }

  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? '',
    displayName: firebaseUser.displayName ?? '',
  };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(configured);

  useEffect(() => {
    if (!configured || !auth) {
      setUser(null);
      setInitializing(false);
      return undefined;
    }

    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      setUser(toSession(nextUser));
      setInitializing(false);
    });

    return unsubscribe;
  }, []);

  const refreshUser = useCallback(async () => {
    if (!auth?.currentUser) {
      setUser(null);
      return;
    }

    await auth.currentUser.reload();
    setUser(toSession(auth.currentUser));
  }, []);

  const logout = useCallback(async () => {
    if (auth) {
      await signOut(auth);
    }
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      initializing,
      configured,
      refreshUser,
      logout,
    }),
    [user, initializing, configured, refreshUser, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider.');
  }
  return context;
}
