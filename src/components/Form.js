import React, { useState } from "react";
import { addDoc, collection } from "firebase/firestore";

function Form({ db, forms, addForm, removeForm }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTimeStamp, setStartTimeStamp] = useState(null);

  const initData = function () {
    const now = new Date();
    setStartTimeStamp(now);
  };

  const submitData = async function (event) {
    event.preventDefault();
    if (!title) return;
    const newLog = {
      title,
      description,
      startTimeStamp,
      endTimeStamp: new Date(),
    };
    try {
      const newLogRef = await addDoc(collection(db, "daily-log"), newLog);
      console.log(`Document written with id ${newLogRef.id}`);
    } catch (err) {
      console.log("Error adding document: " + err);
    }
  };

  return (
    <>
      <h2>Hello daily-log</h2>
      <form onSubmit={(event) => submitData(event)}>
        <div>
          <label>Title: </label>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
        </div>
        <div>
          <label>Description: </label>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
        </div>
        <div>
          <button onClick={initData} disabled={startTimeStamp !== null}>
            Init
          </button>
          <button type="submit" disabled={title === ""}>
            Done
          </button>
        </div>
        <div>
          <button onClick={addForm}>+</button>
          <button onClick={removeForm} disabled={forms.length === 1}>
            -
          </button>
        </div>
      </form>
    </>
  );
}

export default Form;
