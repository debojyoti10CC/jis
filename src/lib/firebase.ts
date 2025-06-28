
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBHBaABMr7AvuU_ih0E4_2nL5z_KkEzB50",
  authDomain: "xencruit.firebaseapp.com",
  databaseURL: "https://xencruit-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "xencruit",
  storageBucket: "xencruit.firebasestorage.app",
  messagingSenderId: "591441296948",
  appId: "1:591441296948:web:bf8b1697b7bff2b8291461",
  measurementId: "G-5WP89DEV3W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

// Configure Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({
  prompt: 'select_account'
});

export default app;
