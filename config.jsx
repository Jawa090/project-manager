import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyCx1iybHHhzE54bjB9_qY7DTLfqO8HK3ec", // Ensure this matches the one from Firebase
  authDomain: "login1-48c5f.firebaseapp.com",
  projectId: "login1-48c5f",
  storageBucket: "login1-48c5f.appspot.com",
  messagingSenderId: "803867727581",
  appId: "1:803867727581:web:41e94a0b5c54e24cbbed34",
  measurementId: "G-R922PDDKG2",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Create a GoogleAuthProvider instance
const provider = new GoogleAuthProvider(); // Use 'provider' here

// Correctly export the auth and provider
export { auth, provider }; // Changed googleProvider to provider
