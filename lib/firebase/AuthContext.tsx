import React, { createContext, useContext, useEffect, useState } from "react";
import { User, onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, setPersistence, browserLocalPersistence, sendPasswordResetEmail } from "firebase/auth";
import { auth, db } from "./client";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  role: string | null;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (e: string, p: string) => Promise<void>;
  registerWithEmail: (e: string, p: string) => Promise<void>;
  registerCustomer: (data: any) => Promise<any>;
  resetPassword: (email: string) => Promise<void>;
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
  registerCustomer: async () => {},
  resetPassword: async () => {},
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
            let userRole = data.role || 'customer';
            
            // Hardcode kalaazim@gmail.com as super_admin
            if (currentUser.email === 'kalaazim@gmail.com') {
              userRole = 'super_admin';
              
              // Seed super admin to admins collection if they are missing
              const superAdminRef = doc(db, "admins", currentUser.email);
              const saSnap = await getDoc(superAdminRef);
              if (!saSnap.exists()) {
                await setDoc(superAdminRef, {
                  email: currentUser.email,
                  uid: currentUser.uid,
                  fullName: 'Super Admin',
                  role: 'super_admin',
                  status: 'active',
                  createdAt: Date.now(),
                  lastLogin: Date.now(),
                  addedBy: 'system'
                });
              } else {
                await updateDoc(superAdminRef, { lastLogin: Date.now(), uid: currentUser.uid });
              }
            } else if (userRole === 'customer') {
              // check if it was authorized later
              if (currentUser.email) {
                const authAdminRef = doc(db, "admins", currentUser.email);
                const authAdminSnap = await getDoc(authAdminRef);
                if (authAdminSnap.exists()) {
                  const adminData = authAdminSnap.data();
                  if (adminData.status !== 'suspended') {
                    userRole = adminData.role;
                    // update user doc
                    await updateDoc(docRef, { role: userRole });
                    // update lastLogin and uid
                    await updateDoc(authAdminRef, { lastLogin: Date.now(), uid: currentUser.uid });
                  } else {
                    userRole = 'customer'; // Suspended admins become customers on login
                  }
                }
              }
            }
            
            setRole(userRole);
            const adminRoles = ['admin', 'super_admin', 'product_manager', 'order_manager', 'inventory_manager', 'customer_support', 'content_manager'];
            setIsAdmin(adminRoles.includes(userRole));
          } else {
            try {
              const isAdminEmail = currentUser.email === 'kalaazim@gmail.com';
              let finalRole = isAdminEmail ? 'super_admin' : 'customer';
              
              if (isAdminEmail) {
                const superAdminRef = doc(db, "admins", currentUser.email);
                const saSnap = await getDoc(superAdminRef);
                if (!saSnap.exists()) {
                  await setDoc(superAdminRef, {
                    email: currentUser.email,
                    uid: currentUser.uid,
                    fullName: 'Super Admin',
                    role: 'super_admin',
                    status: 'active',
                    createdAt: Date.now(),
                    lastLogin: Date.now(),
                    addedBy: 'system'
                  });
                } else {
                  await updateDoc(superAdminRef, { lastLogin: Date.now(), uid: currentUser.uid });
                }
              }

              if (currentUser.email && !isAdminEmail) {
                const authAdminRef = doc(db, "admins", currentUser.email);
                const authAdminSnap = await getDoc(authAdminRef);
                if (authAdminSnap.exists()) {
                  const adminData = authAdminSnap.data();
                  if (adminData.status !== 'suspended') {
                    finalRole = adminData.role;
                    await updateDoc(authAdminRef, { lastLogin: Date.now(), uid: currentUser.uid });
                  }
                }
              }

              await setDoc(docRef, {
                uid: currentUser.uid,
                email: currentUser.email || '',
                role: finalRole, 
                createdAt: Date.now()
              });
              
              setRole(finalRole);
              const adminRoles = ['admin', 'super_admin', 'product_manager', 'order_manager', 'inventory_manager', 'customer_support', 'content_manager'];
              setIsAdmin(adminRoles.includes(finalRole));
            } catch (e) {
              console.error("Error creating user doc", e);
              setIsAdmin(false); 
              setRole('customer'); 
            }
          }
        } catch(e) {
          console.error("Failed to check admin status", e);
          setIsAdmin(false); 
          setRole('customer');
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

  const registerCustomer = async (data: { email: string; password: string; fullName: string; phone: string; country: string; city: string; profilePicUrl?: string }) => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password);
      
      const docRef = doc(db, "users", userCredential.user.uid);
      await setDoc(docRef, {
        uid: userCredential.user.uid,
        email: data.email,
        fullName: data.fullName,
        phone: data.phone,
        country: data.country,
        city: data.city,
        profilePicUrl: data.profilePicUrl || "",
        role: "customer",
        createdAt: Date.now()
      });
      
      return userCredential.user;
    } catch (error: any) {
      console.error("Error registering customer", error);
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error: any) {
      console.error("Error resetting password", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Error signing out", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAdmin, role, loading, loginWithGoogle, loginWithEmail, registerWithEmail, registerCustomer, resetPassword, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
