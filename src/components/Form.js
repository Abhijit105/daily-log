import React, { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";

function Form({ db, forms, addForm, removeForm }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startTimeStamp, setStartTimeStamp] = useState(null);
  const [message, setMessage] = useState("");

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
      const newLogRef = await addDoc(collection(db, "daily-log-24"), newLog);
      console.log(`Document written with id ${newLogRef.id}`);
      setMessage(`Document written with id ${newLogRef.id}`);
    } catch (err) {
      console.log("Error adding document: " + err);
    } finally {
      setStartTimeStamp(null);
    }
  };

  const clearTitle = function () {
    setTitle("");
  };

  const clearDescription = function () {
    setDescription("");
  };

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      setMessage("");
    }, 1 * 60 * 60 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  return (
    <>
      <h2>Hello daily-log</h2>
      <form onSubmit={(event) => submitData(event)} className="form">
        <div className="form-item">
          <label className="form-item-label">Title: </label>
          <input
            className="form-item-input"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
          />
          <button className="form-item-button" onClick={clearTitle}>
            Clear
          </button>
        </div>
        <div className="form-item">
          <label className="form-item-label">Description: </label>
          <textarea
            className="form-item-textarea"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          />
          <button className="form-item-button" onClick={clearDescription}>
            Clear
          </button>
        </div>
        <div className="form-item">
          <button
            className="form-button"
            onClick={initData}
            disabled={startTimeStamp !== null}
          >
            Init
          </button>
          <button
            type="submit"
            disabled={startTimeStamp === null || title === ""}
          >
            Done
          </button>
        </div>
        <div className="form-item">
          <button onClick={addForm}>+</button>
          <button onClick={removeForm} disabled={forms.length === 1}>
            -
          </button>
        </div>
        <p className="message">{message}</p>
      </form>
    </>
  );
}

export default Form;
