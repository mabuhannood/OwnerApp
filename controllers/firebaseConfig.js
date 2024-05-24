// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyBnvGHOvYVVMMCX2K1AwEoVyhjO8iJg0ug",

  authDomain: "t440-de434.firebaseapp.com",

  projectId: "t440-de434",

  storageBucket: "t440-de434.appspot.com",

  messagingSenderId: "593921092546",

  appId: "1:593921092546:web:4c5cff70a6f31cc0b5045b",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Services (database, auth, etc)
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
