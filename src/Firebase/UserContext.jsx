import React, { createContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './Firebase';
import { signOut as firebaseSignOut } from 'firebase/auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = async () => {
    await firebaseSignOut(auth);
    setUser(null); // Reset user state
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        const docRef = doc(db, 'Users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userData = docSnap.data();
          setUser({
            ...userData,
            email: currentUser.email,
            profilePic: userData.profilePic || null, // Fetch profile picture URL or set to null
          });
        } else {
          setUser({
            uid: currentUser.uid,
            email: currentUser.email,
            profilePic: null, // Set to null if no document exists
          });
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, isLoading, setUser, signOut }}>
      {children}
    </UserContext.Provider>
  );
};
