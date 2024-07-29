// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore } from "firebase/firestore";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1CoC_UrZTTeJfmTeZAeRH6-cH-USFn6k",
  authDomain: "daily-log-94f4e.firebaseapp.com",
  projectId: "daily-log-94f4e",
  storageBucket: "daily-log-94f4e.appspot.com",
  messagingSenderId: "962781855656",
  appId: "1:962781855656:web:062c294b5b77de91d7a79d",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// Google authentication
export const signInWithGoogle = async function () {
  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: "select_account",
    });
    const auth = getAuth();
    const result = await signInWithPopup(auth, provider);
    console.log(result.user.email);
  } catch (err) {
    console.log(err.message);
  }
};

export const signOutWithGoogle = async function () {
  try {
    const auth = getAuth();
    const signOutRef = await signOut(auth);
    console.log(signOutRef);
  } catch (err) {
    console.log(err.message);
  }
};
