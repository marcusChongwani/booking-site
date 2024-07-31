// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyD_JPPjYWdccTCucn9lMyjy804IUIauqlw",
  authDomain: "instay-ff5e2.firebaseapp.com",
  projectId: "instay-ff5e2",
  storageBucket: "instay-ff5e2.appspot.com",
  messagingSenderId: "121610435628",
  appId: "1:121610435628:web:af41f7cd17863bc937a589"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Function to fetch the current user's role
export const getCurrentUserRole = async () => {
  const user = auth.currentUser;

  if (user) {
    try {
      const userDoc = await getDoc(doc(db, 'Users', user.uid)); // Adjust collection name as needed
      if (userDoc.exists()) {
        return userDoc.data().role; // Assuming the role is stored in the Firestore document
      } else {
        console.error("User document does not exist.");
      }
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  } else {
    console.error("No user is currently authenticated.");
  }
  
  return null; // No user or role found
};
