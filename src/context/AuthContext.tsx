/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import {
  auth,
  googleProvider,
  storage,
} from "../firebase";
import {
  type User,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  OAuthProvider,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { ref, uploadString, getDownloadURL } from "firebase/storage";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithApple: () => Promise<void>;
  signInWithEmail: (email: string, password: string) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName?: string, profilePicBase64?: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => {},
  signInWithApple: async () => {},
  signInWithEmail: async () => {},
  signUpWithEmail: async () => {},
  resetPassword: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const signInWithApple = async () => {
    const provider = new OAuthProvider("apple.com");
    await signInWithPopup(auth, provider);
  };

  const signInWithEmail = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const signUpWithEmail = async (email: string, password: string, fullName?: string, profilePicBase64?: string) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    let photoURL: string | undefined;
    if (profilePicBase64) {
      try {
        const storageRef = ref(storage, `profile-pictures/${cred.user.uid}`);
        await uploadString(storageRef, profilePicBase64, "data_url");
        photoURL = await getDownloadURL(storageRef);
      } catch {
        // profile pic upload failed, continue without it
      }
    }
    if (fullName || photoURL) {
      await updateProfile(cred.user, { displayName: fullName || null, photoURL: photoURL || null });
    }
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, signInWithGoogle, signInWithApple, signInWithEmail, signUpWithEmail, resetPassword, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
