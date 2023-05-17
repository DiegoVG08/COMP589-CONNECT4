import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged, setPersistence, browserLocalPersistence } from 'firebase/auth';
import { getDoc, doc, setDoc } from 'firebase/firestore';
import { auth, db } from './Firebase';

// Create the AuthContext
export const AuthContext = createContext();

// Create the AuthContextProvider component
const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Enable local persistence
    setPersistence(auth, browserLocalPersistence)
      .then(() => {
        // Auth state persistence enabled
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          setUser(user);
          setIsLoading(false);
          if (user) {
            // Store user data in Firestore
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, {
              email: user.email,
              username: user.displayName
            });
          }
        });

        return () => unsubscribe(); // Cleanup function to unsubscribe from the onAuthStateChanged event
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });

    // Check if user data exists in Firestore
    const checkUserData = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        if (userDoc.exists()) {
          setUser({
            uid: user.uid,
            email: user.email,
            username: userDoc.data().username
          });
        }
      }
    };

    checkUserData();
  }, []);

  const handleLogin = (user) => {
    setUser(user);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, handleLogin }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContextProvider;
