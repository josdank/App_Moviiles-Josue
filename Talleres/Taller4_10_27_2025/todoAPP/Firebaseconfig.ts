// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getFirestore} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAtDL8Bt4_Ap-T5fHg3tuJj_nPnJffCQ2w",
  authDomain: "epn-proyecto.firebaseapp.com",
  projectId: "epn-proyecto",
  storageBucket: "epn-proyecto.firebasestorage.app",
  messagingSenderId: "369873874809",
  appId: "1:369873874809:web:d6d70d5cc75b26c54409a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);