import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Replace with your actual Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBXZQfl5nVd9peZ0dTYGflKG8u8k3F9WcI",
  authDomain: "interviewflow-dbf83.firebaseapp.com",
  projectId: "interviewflow-dbf83",
  storageBucket: "interviewflow-dbf83.firebasestorage.app",
  messagingSenderId: "837877323884",
  appId: "1:837877323884:web:5d681ba4b9b925d7662049",
  measurementId: "G-1BP7TQL9C2"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
