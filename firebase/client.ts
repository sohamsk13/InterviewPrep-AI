// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCGJPc4OFGdQHszvokmIpiASXFkenVv3DI",
  authDomain: "ai-mock-interview-669fb.firebaseapp.com",
  projectId: "ai-mock-interview-669fb",
  storageBucket: "ai-mock-interview-669fb.firebasestorage.app",
  messagingSenderId: "264274409936",
  appId: "1:264274409936:web:fb6a18ee3c74f982dfe1d5",
  measurementId: "G-VRQ2KWCWE3"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app); 