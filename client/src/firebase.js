import { initializeApp } from "firebase/app";
import {
  signInWithPopup,
  GoogleAuthProvider,
  getAuth,
  signOut,
} from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "ignitionhack-6521f.firebaseapp.com",
  projectId: "ignitionhack-6521f",
  storageBucket: "ignitionhack-6521f.appspot.com",
  messagingSenderId: "68629320149",
  appId: "1:68629320149:web:002853245a519410f9ed5c",
  measurementId: "G-5JSLMVMC8H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export async function GoogleLogin() {
  const auth = getAuth(app);
  const provider = new GoogleAuthProvider();

  try {
    const result = await signInWithPopup(auth, provider);

    return result;
  } catch (error) {

    throw error;
  }
}

export async function GoogleLogout() {
  const auth = getAuth(app);
  try {
    await auth.signOut();
    //console.log("Google Logout Successful");
  } catch (error) {
    //console.log("Google Logout Failed");
    //console.log(error);
    throw error;
  }
}
