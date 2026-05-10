import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth, db } from "./client";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  role: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAdmin: false,
  role: null,
  loading: true,
  loginWithGoogle: async () => {},
  loginWithEmail: async () => {},
  registerWithEmail: async () => {},
  logout: async () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const data = docSnap.data();
            const userRole = data.role || 'user';
            setRole(userRole);
            
            // Hardcode kalaazim@gmail.com as admin
            if (currentUser.email === 'kalaazim@gmail.com') {
              setIsAdmin(true);
              setRole('super_admin');
            } else {
              // Consider any role matching these as 'admin' for dashboard access
              setIsAdmin(['admin', 'super_admin', 'product_manager', 'order_manager', 'inventory_manager', 'customer_support', 'content_manager'].includes(userRole));
            }
          } else {
            try {
              await setDoc(docRef, {
                uid: currentUser.uid,
                email: currentUser.email || '',
                role: 'super_admin', 
                createdAt: Date.now()
              });
              setIsAdmin(true);
              setRole('super_admin');
            } catch (e) {
              console.error("Error creating user doc", e);
              setIsAdmin(true); 
              setRole('super_admin'); 
            }
          }
        } catch(e) {
          console.error("Failed to check admin status", e);
          setIsAdmin(true); 
          setRole('super_admin');
        }
      } else {
        setIsAdmin(false);
        setRole(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      if (error?.code !== 'auth/popup-closed-by-user' && error?.code !== 'auth/cancelled-popup-request') {
        console.error("Error signing in with Google", error);
      }
      throw error;
    }
  };

  const loginWithEmail = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error?.code !== 'auth/invalid-credential') {
        console.error("Error signing in with email", error);
      }
      throw error;
    }
  }

  const registerWithEmail = async (email: string, password: string) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      if (error?.code !== 'auth/email-already-in-use') {
        console.error("Error registering with email", error);
      }
      throw error;
    }
  }

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, role, loading, loginWithGoogle, loginWithEmail, registerWithEmail, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
