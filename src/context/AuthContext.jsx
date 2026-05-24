// Import initialized Firebase auth instance
import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, sendEmailVerification, onAuthStateChanged, signOut } from '../services/firebase';

// Define admin emails (replace with real admin emails)
const ADMIN_EMAILS = ['admin@example.com'];

// Google provider (no new app initialization)
const googleProvider = new GoogleAuthProvider();

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = async (email, password) => {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    if (!credential.user.emailVerified) {
      await sendEmailVerification(credential.user);
      await signOut(auth);
      throw new Error('Email not verified. Verification email sent. Please verify before logging in.');
    }
    return credential.user;
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    loginWithEmail,
    logout,
    isAdmin: user && ADMIN_EMAILS.includes(user.email),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Define admin emails here (replace with real admin emails)
// ADMIN_EMAILS moved above
