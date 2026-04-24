// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDnjgwIeegXwIQXV8WRh-xpsUanb649_Qo",
  authDomain: "webforgex-6a504.firebaseapp.com",
  projectId: "webforgex-6a504",
  storageBucket: "webforgex-6a504.firebasestorage.app",
  messagingSenderId: "296590904747",
  appId: "1:296590904747:web:1db96dc6021da9034956ee"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
