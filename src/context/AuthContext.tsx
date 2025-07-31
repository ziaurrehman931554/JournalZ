/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../firebase";
import { type User } from "firebase/auth";
import { useNavigate } from "react-router-dom";

type AuthContextType = {
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setLoading(false);

      // Only navigate after initial load
      if (!loading) {
        if (!firebaseUser) navigate("/join");
        else if (window.location.pathname === "/join") navigate("/");
      }
    });

    return unsubscribe;
  }, [navigate, loading]); // Add loading to dependencies

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {!loading && children} {/* Only render children after auth check */}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
