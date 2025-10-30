// Firebase configuration and initialization
import { initializeApp } from "firebase/app";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyArupUba23UsfNXcVYYBvtL0eKxpNWmD8Q",
  authDomain: "fireapp-82c88.firebaseapp.com",
  databaseURL: "https://fireapp-82c88-default-rtdb.firebaseio.com",
  projectId: "fireapp-82c88",
  storageBucket: "fireapp-82c88.firebasestorage.app",
  messagingSenderId: "69604234606",
  appId: "1:69604234606:web:871d2ccf0942ed8c431d7f",
  measurementId: "G-5FGDRX59BR"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);

// Initialize Analytics (only in browser)
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;

// Development emulators (optional - for local testing)
if (process.env.NODE_ENV === 'development' && typeof window !== 'undefined') {
  // Uncomment these lines if you want to use Firebase emulators locally
  // connectFirestoreEmulator(db, 'localhost', 8080);
  // connectAuthEmulator(auth, 'http://localhost:9099');
}

export default app;
