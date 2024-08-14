import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage } from 'firebase/storage';
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAWBQA7Ex826TbnJR62cLBZMCaLGn2AmvA",
  authDomain: "instay-db4cd.firebaseapp.com",
  projectId: "instay-db4cd",
  storageBucket: "instay-db4cd.appspot.com",
  messagingSenderId: "889307305159",
  appId: "1:889307305159:web:957f656ee25fa7d58cdae2"
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
