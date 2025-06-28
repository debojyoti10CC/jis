// src/firebase.js
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

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

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database };
