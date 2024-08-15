import { collection, getDocs } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../libs/firebase";
import { signInWithGoogle, signOutWithGoogle } from "../libs/firebase";
import DisplayLog from "./DisplayLog";
import ReadModal from "./ReadModal";

function Display() {
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [displayedLogs, setDisplayedLogs] = useState([]);
  const [errorDisplayedLogs, setErrorDisplayedLogs] = useState("");
  const [isLoadingDisplayedLogs, setIsLoadingDisplayedLogs] = useState(false);
  const [displayReadModal, setDisplayReadModal] = useState(false);

  const openReadModal = function () {
    setDisplayReadModal(true);
  };

  const closeReadModal = function () {
    setDisplayReadModal(false);
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
      setIsLoadingDisplayedLogs(true);
      setErrorDisplayedLogs("");
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
    } catch (err) {
      console.log("Error reading document" + err);
      setErrorDisplayedLogs(err.message);
    } finally {
      setIsLoadingDisplayedLogs(false);
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
        setIsLoadingDisplayedLogs(true);
        setErrorDisplayedLogs("");
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
      } catch (err) {
        console.log("Error reading document:" + err);
        setErrorDisplayedLogs(err.message);
      } finally {
        setIsLoadingDisplayedLogs(false);
      }
    } else {
      const now = new Date();
      const enteredDate = new Date(
        now.getFullYear(),
        !!month ? month - 1 : now.getMonth(),
        date ?? ""
      );
      let plusOne = new Date();
      plusOne.setTime(enteredDate.getTime() + 24 * 60 * 60 * 1000);
      try {
        setIsLoadingDisplayedLogs(true);
        setErrorDisplayedLogs("");
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
      } catch (err) {
        console.log("Error reading document:" + err);
        setErrorDisplayedLogs(err.message);
      } finally {
        setIsLoadingDisplayedLogs(false);
      }
    }
  };

  console.log(displayedLogs);

  return (
    <>
      <div className="display">
        <nav className="nav nav-auth">
          <button onClick={openReadModal}></button>
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
        {!errorDisplayedLogs ? (
          isLoadingDisplayedLogs ? (
            <span className="loader"></span>
          ) : !!displayedLogs && displayedLogs.length !== 0 ? (
            <div className="displayed-logs">
              {displayedLogs
                .sort(
                  (a, b) =>
                    a.startTimeStamp.toDate().getTime() -
                    b.startTimeStamp.toDate().getTime()
                )
                .map((log, i) => (
                  <DisplayLog
                    i={i}
                    log={log}
                    setDisplayedLogs={setDisplayedLogs}
                    key={i}
                  />
                ))}
            </div>
          ) : (
            <p className="message">Nothing to display</p>
          )
        ) : (
          <p className="message">{errorDisplayedLogs}</p>
        )}
      </div>
      {displayReadModal && (
        <ReadModal
          displayedLogs={displayedLogs}
          errorDisplayedLogs={errorDisplayedLogs}
          isLoadingDisplayedLogs={isLoadingDisplayedLogs}
          onClose={closeReadModal}
          setDisplayedLogs={setDisplayedLogs}
        />
      )}
    </>
  );
}

export default Display;
