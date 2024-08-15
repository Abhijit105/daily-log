import React, { useEffect, useState, useCallback } from "react";
import { addDoc, collection } from "firebase/firestore";
import CreateModal from "./CreateModal";

function Form({ i, db, logsData, setLogsData, addLogData, removeLogData }) {
  const [startTimeStamp, setStartTimeStamp] = useState(null);
  const [message, setMessage] = useState("");
  const [displayCreateModal, setDisplayCreateModal] = useState(false);

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
      title: logsData[i].title ?? "",
      description: logsData[i].description ?? "",
      startTimeStamp,
      endTimeStamp: new Date(),
    };
    try {
      const logsCol = collection(db, "daily-log-24");
      const newLogRef = await addDoc(logsCol, newLog);
      console.log(`Document written with id ${newLogRef.id}`);
      setMessage(`Document written with id ${newLogRef.id}`);
    } catch (err) {
      console.log("Error adding document: " + err);
      setMessage(err.message);
    } finally {
      setStartTimeStamp(null);
    }
  };

  const cancel = function () {
    setStartTimeStamp(null);
  };

  const clearTitle = function () {
    setLogsData((logsData) =>
      logsData.map((logData, idx) =>
        idx !== i ? logData : { logData, title: "" }
      )
    );
    document.getElementById(`title-${i}`).focus();
  };

  const clearDescription = function (event) {
    event.preventDefault();
    setLogsData((logsData) =>
      logsData.map((logData, idx) =>
        idx !== i ? logData : { ...logData, description: "" }
      )
    );
    document.getElementById(`description-${i}`).focus();
  };

  const openCreateModal = function () {
    setDisplayCreateModal(true);
  };

  const closeCreateModal = function () {
    setDisplayCreateModal(false);
  };

  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => {
      setMessage("");
    }, 5 * 60 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, [message]);

  const screenWidthListener = useCallback(function () {
    const loaderWidth = window.innerWidth * 0.6 - 40;
    document.querySelector(".loader").style.width = loaderWidth;
  }, []);

  useEffect(() => {
    if (!startTimeStamp) return;
    window.addEventListener("resize", screenWidthListener);
    return () => {
      window.removeEventListener("resize", screenWidthListener);
    };
  }, [startTimeStamp, screenWidthListener]);

  return (
    <>
      <div className="headline">
        <h2>Hello daily-log</h2>
        <button onClick={openCreateModal}></button>
      </div>
      <div className="form-wrapper">
        <form className="form" onSubmit={submitData}>
          <div className="form-item">
            <label className="form-item-label">Title: </label>
            <input
              id={`title-${i}`}
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
              id={`description-${i}`}
              className="form-item-textarea"
              value={logsData[i].description}
              onChange={(event) => changeDescription(event)}
            />
            <button
              className="form-item-button"
              onClick={(event) => clearDescription(event)}
            >
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
              className="form-button"
              type="submit"
              disabled={startTimeStamp === null || logsData[i].title === ""}
            >
              Done
            </button>
            <button
              className="form-button"
              disabled={startTimeStamp === null}
              onClick={cancel}
            >
              Cancel
            </button>
          </div>
          <div className="add-remove-buttons">
            <button onClick={(event) => addLogData(event)}>+</button>
            <button
              onClick={(event) => removeLogData(event)}
              disabled={logsData.length === 1}
            >
              -
            </button>
          </div>
          {!!startTimeStamp && <div className="loader"></div>}
          {!!message && <p className="message">{message}</p>}
        </form>
        <div className="divider"></div>
      </div>
      {displayCreateModal && (
        <CreateModal
          onClose={closeCreateModal}
          addLogData={addLogData}
          cancel={cancel}
          changeDescription={changeDescription}
          changeTitle={changeTitle}
          clearDescription={clearDescription}
          clearTitle={clearTitle}
          displayCreateModal={displayCreateModal}
          i={i}
          initData={initData}
          logsData={logsData}
          message={message}
          removeLogData={removeLogData}
          startTimeStamp={startTimeStamp}
          submitData={submitData}
        />
      )}
    </>
  );
}

export default Form;
