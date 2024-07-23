// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";
import { doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCIse7vRCCZBXkI8hW4ImDdqUdphGgsDw0",
  authDomain: "vistra-fcb0f.firebaseapp.com",
  projectId: "vistra-fcb0f",
  storageBucket: "vistra-fcb0f.appspot.com",
  messagingSenderId: "628121407924",
  appId: "1:628121407924:web:c1be775dca937ed71da2e1"
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
