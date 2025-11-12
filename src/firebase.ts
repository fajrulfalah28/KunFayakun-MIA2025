// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA77Vj756RzAmb2COA15ilkncInVYq5TT8",
  authDomain: "project-1a63cadb-87d8-4908-9ea.firebaseapp.com",
  projectId: "project-1a63cadb-87d8-4908-9ea",
  storageBucket: "project-1a63cadb-87d8-4908-9ea.firebasestorage.app",
  messagingSenderId: "1065696454497",
  appId: "1:1065696454497:web:3df8a216b98beaa1518720",
  measurementId: "G-8J2MSZWT0E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
getAnalytics(app);

// Initialize Firestore
export const db = getFirestore(app);

// Google Maps API key
export const googleMapsApiKey = 'AIzaSyBxBx2TdYzqW_o2eelXa3XVw8VtF7UlMsQ';