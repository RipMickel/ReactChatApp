import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, collection, getDocs, addDoc } from "firebase/firestore"; // Added missing Firestore imports
import { getAuth, onAuthStateChanged } from "firebase/auth"; // Auth imports

// Firebase configuration object
const firebaseConfig = {
    apiKey: "AIzaSyA0RO5INjD4xD3xjiHSdAzg8MbV3e9k44A",
    authDomain: "messengerchatapp-789f1.firebaseapp.com",
    projectId: "messengerchatapp-789f1",
    storageBucket: "messengerchatapp-789f1.firebasestorage.app",
    messagingSenderId: "672159984202",
    appId: "1:672159984202:web:674d3ef364c6409835d4b3"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Get Firebase services
const auth = getAuth(app);  // Firebase Authentication
const db = getFirestore(app); // Firestore

// Function to add user data to Firestore
const addUserToFirestore = async (user) => {
  try {
    const userRef = doc(db, "users", user.uid);  // Get the Firestore document reference for this user
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL || "",  // Use default if photoURL is null
    });
    console.log("User added to Firestore:", user.uid);
  } catch (error) {
    console.error("Error adding user to Firestore:", error);
  }
};

// Firebase Auth listener to add user to Firestore on login
onAuthStateChanged(auth, (user) => {
  if (user) {
    // Add user to Firestore if logged in
    addUserToFirestore(user);
  }
});

// Export necessary Firebase services and functions
export { auth, db, addUserToFirestore, collection, getDocs, addDoc }; // Exporting additional functions
