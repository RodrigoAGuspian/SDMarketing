// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";




const firebaseConfig = {
  apiKey: "AIzaSyBT9PDlnAEyTxDo9BOQW98V3p50uvCUKQk",
  authDomain: "sdmarketing-df796.firebaseapp.com",
  projectId: "sdmarketing-df796",
  storageBucket: "sdmarketing-df796.appspot.com",
  messagingSenderId: "522381134246",
  appId: "1:522381134246:web:481f4f7fd501c0ef522767",
  measurementId: "G-RWSQ4SVZ5X"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);


export {auth, db};