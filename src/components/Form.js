import React, { useEffect, useState } from "react";
import { addDoc, collection } from "firebase/firestore";

function Form({ i, db, logsData, setLogsData, addLogData, removeLogData }) {
  const [startTimeStamp, setStartTimeStamp] = useState(null);
  const [message, setMessage] = useState("");

  const changeTitle = function (event) {
    setLogsData((logsData) =>
      logsData.map((logData, idx) =>
        i !== idx ? logData : { ...logData, title: event.target.value }
      )
    );
  };

  const changeDescription = function (event) {
    setLogsData((logsData) =>
      logsData.map((logData, idx) =>
        i !== idx ? logData : { ...logData, description: event.target.value }
      )
    );
  };

  const initData = function () {
    const now = new Date();
    setStartTimeStamp(now);
  };

  const submitData = async function (event) {
    event.preventDefault();
    if (!logsData[i].title) return;
    const newLog = {
      title: logsData[i].title,
      description: logsData[i].description,
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
    setLogsData((logsData) =>
      logsData.map((logData, idx) =>
        idx !== i ? logData : { logData, title: "" }
      )
    );
  };

  const clearDescription = function () {
    setLogsData((logsData) =>
      logsData.map((logData, idx) =>
        idx !== i ? logData : { ...logData, description: "" }
      )
    );
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
      <form className="form" onSubmit={submitData}>
        <div className="form-item">
          <label className="form-item-label">Title: </label>
          <input
            className="form-item-input"
            value={logsData[i].title}
            onChange={(event) => changeTitle(event)}
          />
          <button className="form-item-button" onClick={clearTitle}>
            Clear
          </button>
        </div>
        <div className="form-item">
          <label className="form-item-label">Description: </label>
          <textarea
            className="form-item-textarea"
            value={logsData[i].description}
            onChange={(event) => changeDescription(event)}
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
            disabled={startTimeStamp === null || logsData[i].title === ""}
          >
            Done
          </button>
        </div>
      </form>
      <div className="add-remove-buttons">
        <button onClick={addLogData}>+</button>
        <button onClick={removeLogData} disabled={logsData.length === 1}>
          -
        </button>
        <p className="message">{message}</p>
      </div>
    </>
  );
}

export default Form;
