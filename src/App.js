import { useState } from "react";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB1CoC_UrZTTeJfmTeZAeRH6-cH-USFn6k",
  authDomain: "daily-log-94f4e.firebaseapp.com",
  projectId: "daily-log-94f4e",
  storageBucket: "daily-log-94f4e.appspot.com",
  messagingSenderId: "962781855656",
  appId: "1:962781855656:web:062c294b5b77de91d7a79d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app)

async function getLogs(db)  {
  const logsCol = collection(db, 'daily-log')
  const logsSnapshot = await getDocs(logsCol)
  const logsList = logsSnapshot.docs.map(doc => doc.data)
  return logsList
}

(async function()  {
  const result = await getLogs(db)
  console.log(result)
})()

function App({db}) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  const submitData = async function(event) {
    event.preventDefault()
    const newLog = {
      title,
      description
    }
    const newLogRef = await addDoc(collection(db, 'daily-log'), newLog)
    console.log(`Document written with id ${newLogRef.id}`)
  }

  return (
    <main>
    <div>Hello daily-log</div>
    <form onSubmit={event => submitData(event)}>
      <div>
      <label>Title: </label>
      <input value={title} onChange={event => setTitle(event.target.value)} />
      </div>
      <div>
      <label>Description: </label>
      <input value={description} onChange={event => setDescription(event.target.value)} />
      </div>
      <div>
        <button type="submit">Submit</button>
      </div>
    </form>
    </main>
  );
}

export default App;
