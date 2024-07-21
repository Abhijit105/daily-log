import React from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, getDocs } from "firebase/firestore";
import Display from "./components/Display";
import Forms from "./components/Forms";

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
const db = getFirestore(app);

function App() {
  return (
    <main className="main">
      <Forms db={db} />
      <Display db={db} />
    </main>
  );
}

export default App;
