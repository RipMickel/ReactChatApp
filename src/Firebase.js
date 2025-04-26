import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp, query, orderBy, onSnapshot, doc, setDoc, getDocs } from 'firebase/firestore';  // Import doc and setDoc
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

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
const auth = getAuth(app);
const db = getFirestore(app);
const realtimeDb = getDatabase(app);

// Function to add user data to Firestore
const addUserToFirestore = async (user) => {
  try {
    const userRef = doc(db, 'users', user.uid);
    await setDoc(userRef, {
      uid: user.uid,
      displayName: user.displayName,
      photoURL: user.photoURL || '',
    });
    console.log('User added to Firestore:', user.uid);
  } catch (error) {
    console.error('Error adding user to Firestore:', error);
  }
};

// Firebase Auth listener
onAuthStateChanged(auth, (user) => {
  if (user) {
    addUserToFirestore(user);
  }
});

// ✅ Export what is needed for other files
export {
  auth,
  db,
  addUserToFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  setDoc,
  getDatabase,
  realtimeDb,
};
