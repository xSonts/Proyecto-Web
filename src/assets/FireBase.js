import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBHiVuMkLEjoJZNpGWa5KRrn4m-AcgF71I",
  authDomain: "proyecto-web-baa77.firebaseapp.com",
  projectId: "proyecto-web-baa77",
  storageBucket: "proyecto-web-baa77.appspot.com",
  messagingSenderId: "32006128247",
  appId: "1:32006128247:web:12fb7c48e1ebf8e1097c72"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
