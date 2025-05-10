import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from 'firebase/firestore';
import { onSnapshot } from 'firebase/firestore';

// Import the functions you need from the SDKs you need
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYU4fVAN5pnfG9tS2Xhs8QfCMAy_X_yBw",
  authDomain: "merlins-dopamine-box.firebaseapp.com",
  projectId: "merlins-dopamine-box",
  storageBucket: "merlins-dopamine-box.firebasestorage.app",
  messagingSenderId: "792864153607",
  appId: "1:792864153607:web:b50bf51ba4a388beb98aa2",
  measurementId: "G-D5Q0DKH24L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase

const db = getFirestore(app);

export { db, collection, addDoc, getDocs, query, orderBy, onSnapshot };