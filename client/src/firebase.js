import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "genwebai-bb86a.firebaseapp.com",
  projectId: "genwebai-bb86a",
  storageBucket: "genwebai-bb86a.firebasestorage.app",
  messagingSenderId: "305892586585",
  appId: "1:305892586585:web:110f8986be9cf383bbad48"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { auth, provider };