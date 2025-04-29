// Firebase Initialization
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCexIUB6EvfNarSy2PxUVHbKO76q79jiZY",
  authDomain: "bitgame-49ea4.firebaseapp.com",
  projectId: "bitgame-49ea4",
  storageBucket: "bitgame-49ea4.firebasestorage.app",
  messagingSenderId: "1092386376018",
  appId: "1:1092386376018:web:79af3385a809b81c16928b",
  measurementId: "G-HYZ9HGJM6L"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
