import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyBCfTIRMP9zm7542DLNIxvi1dEOHKTAs58",
    authDomain: "chromabase-web-883a.firebaseapp.com",
    projectId: "chromabase-web-883a",
    storageBucket: "chromabase-web-883a.firebasestorage.app",
    messagingSenderId: "1044046740781",
    appId: "1:1044046740781:web:c83e5dae990f41bcea67a4"
};

// Initialize Firebase only if it hasn't been initialized already
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);

