import { collection, getDocs } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../libs/firebase";
import { signInWithGoogle, signOutWithGoogle } from "../libs/firebase";
import UpdateModal from "./UpdateModal";

function Display() {
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoadingLogs, setIsLoadingLogs] = useState(false);
  const [displayUpdateModal, setDisplayUpdateModal] = useState(false);
  const [logToBeUpdated, setLogToBeUpdated] = useState(null);

  const openUpdateModal = function (selectedLog) {
    setDisplayUpdateModal(true);
    setLogToBeUpdated(selectedLog);
  };

  const closeUpdateModal = function () {
    setDisplayUpdateModal(false);
  };

  const yesterday = async function () {
    const now = new Date();
    let yesterday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    if (now.getDay() === 1)
      yesterday.setTime(yesterday.getTime() - 3 * 24 * 60 * 60 * 1000);
    else yesterday.setTime(yesterday.getTime() - 24 * 60 * 60 * 1000);
    let plusOne = new Date();
    plusOne.setTime(yesterday.getTime() + 24 * 60 * 60 * 1000);
    try {
      setIsLoadingLogs(true);
      const logsCol = collection(db, "daily-log-24");
      const logsSnapshot = await getDocs(logsCol);
      const logsList = logsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      const logsYesterday = logsList.filter(
        (log) =>
          log.startTimeStamp?.toDate().getTime() >= yesterday.getTime() &&
          log.startTimeStamp?.toDate().getTime() < plusOne.getTime()
      );
      setDisplayedLogs(logsYesterday.reverse());
      setErrorMessage("");
    } catch (err) {
      console.log("Error reading document" + err);
      setErrorMessage(err.message);
    } finally {
      setIsLoadingLogs(false);
    }
  };

  const go = async function () {
    if (!date && !month) {
      const now = new Date();
      const currentDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      try {
        setIsLoadingLogs(true);
        const logsCol = collection(db, "daily-log-24");
        const logsSnapshot = await getDocs(logsCol);
        const logsList = logsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const logsToday = logsList.filter(
          (log) =>
            log.startTimeStamp?.toDate().getTime() >= currentDate.getTime()
        );
        setDisplayedLogs(logsToday.reverse());
        setErrorMessage("");
      } catch (err) {
        console.log("Error reading document:" + err);
        setErrorMessage(err.message);
      } finally {
        setIsLoadingLogs(false);
      }
    } else if (!month) {
      const now = new Date();
      const enteredDate = new Date(now.getFullYear(), now.getMonth(), date);
      let plusOne = new Date();
      plusOne.setTime(enteredDate.getTime() + 24 * 60 * 60 * 1000);
      try {
        setIsLoadingLogs(true);
        const logsCol = collection(db, "daily-log-24");
        const logsSnapshot = await getDocs(logsCol);
        const logsList = logsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const logsEnteredDate = logsList.filter(
          (log) =>
            log.startTimeStamp?.toDate().getTime() >= enteredDate.getTime() &&
            log.startTimeStamp?.toDate().getTime() < plusOne.getTime()
        );
        setDisplayedLogs(logsEnteredDate.reverse());
        setErrorMessage("");
      } catch (err) {
        console.log("Error reading document:" + err);
        setErrorMessage(err.message);
      } finally {
        setIsLoadingLogs(false);
      }
    } else {
      const now = new Date();
      const enteredDate = new Date(now.getFullYear(), month - 1, date);
      let plusOne = new Date();
      plusOne.setTime(enteredDate.getTime() + 24 * 60 * 60 * 1000);
      try {
        setIsLoadingLogs(true);
        const logsCol = collection(db, "daily-log-24");
        const logsSnapshot = await getDocs(logsCol);
        const logsList = logsSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        const logsEnteredDate = logsList.filter(
          (log) =>
            log.startTimeStamp?.toDate().getTime() >= enteredDate.getTime() &&
            log.startTimeStamp?.toDate().getTime() < plusOne.getTime()
        );
        setDisplayedLogs(logsEnteredDate.reverse());
        setErrorMessage("");
      } catch (err) {
        console.log("Error reading document:" + err);
        setErrorMessage(err.message);
      } finally {
        setIsLoadingLogs(false);
      }
    }
  };

  useEffect(() => {
    let timer = setTimeout(() => {
      setErrorMessage("");
    }, 5 * 60 * 1000);

    return () => clearTimeout(timer);
  }, [errorMessage]);

  return (
    <>
      <div className="display">
        <nav className="nav nav-auth">
          <button onClick={signInWithGoogle}>Google</button>
          <button onClick={signOutWithGoogle}>Sign Out</button>
        </nav>
        <div className="date-area">
          <div className="date-item">
            <button onClick={yesterday}>Yesterday...</button>
          </div>
          <div className="date-item">
            <input
              type="number"
              min={1}
              max={31}
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
            <label>DD</label>
          </div>
          <div className="date-item">
            <input
              type="number"
              min={1}
              max={12}
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            />
            <label>MM</label>
          </div>
          <div className="date-item">
            <button onClick={go}>GO</button>
          </div>
        </div>
        {isLoadingLogs ? (
          <span className="loader"></span>
        ) : (
          <div className="displayed-logs">
            {displayedLogs
              .sort(
                (a, b) =>
                  a.startTimeStamp.toDate().getTime() -
                  b.startTimeStamp.toDate().getTime()
              )
              .map((log, i) => (
                <div className="displayed-log" key={i}>
                  <div>
                    <h3>{i + 1}. </h3>
                  </div>
                  <div>
                    <h3>{log.title}</h3>
                    <p>{log.description}</p>
                    <h5>
                      Start: {log.startTimeStamp.toDate().toLocaleString()} End:{" "}
                      {log.endTimeStamp.toDate().toLocaleString()}
                    </h5>
                  </div>
                  <div>
                    <button onClick={() => openUpdateModal(log)}>Update</button>
                  </div>
                </div>
              ))}
          </div>
        )}
        <p className="message">{errorMessage}</p>
      </div>
      {displayUpdateModal && (
        <UpdateModal onClose={closeUpdateModal} log={logToBeUpdated} />
      )}
    </>
  );
}

export default Display;
