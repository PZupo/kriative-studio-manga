import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

interface UserData {
  uid: string;
  email: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  credits: number;
  role?: string;
  tier?: string;
  activeApps: string[]; // Chave para o ecossistema
  billing?: {
    plan?: string;
    status?: string;
    currentPeriodEnd?: any;
  };
}

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        const unsubscribeSnapshot = onSnapshot(userRef, (docSnap) => {
          if (docSnap.exists()) {
            const data = docSnap.data();
            setUserData({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: data.name || currentUser.displayName,
              photoURL: data.photoUrl || currentUser.photoURL,
              credits: data.credits || 0,
              activeApps: data.activeApps || [], // Garantia de array vazio se não houver
              billing: {
                plan: data.subscription?.plan || 'Free',
                status: data.subscription?.status || 'active',
                currentPeriodEnd: data.subscription?.currentPeriodEnd
              }
            });
          } else {
            setUserData({
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              credits: 0,
              activeApps: [],
              billing: { plan: 'Free', status: 'active' }
            });
          }
          setLoading(false);
        }, (error) => { console.error(error); setLoading(false); });
        return () => unsubscribeSnapshot();
      } else {
        setUserData(null);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, userData, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de AuthProvider");
  return ctx;
};