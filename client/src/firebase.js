// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAdjshXUvts0X47iDK9RLnb9otvWVUmLRc",
  authDomain: "ignitionhack-6521f.firebaseapp.com",
  projectId: "ignitionhack-6521f",
  storageBucket: "ignitionhack-6521f.appspot.com",
  messagingSenderId: "68629320149",
  appId: "1:68629320149:web:002853245a519410f9ed5c",
  measurementId: "G-5JSLMVMC8H"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);