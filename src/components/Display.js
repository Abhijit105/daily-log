import { collection, getDocs } from "firebase/firestore";
import React, { useState } from "react";

function Display({ db }) {
  const [date, setDate] = useState("");
  const [month, setMonth] = useState("");
  const [displayedLogs, setDisplayedLogs] = useState([]);

  const go = async function () {
    if (!date && !month) {
      const now = new Date();
      const currentDate = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate()
      );
      try {
        const logsCol = collection(db, "daily-log-24");
        const logsSnapshot = await getDocs(logsCol);
        const logsList = logsSnapshot.docs.map((doc) => doc.data());
        const logsToday = logsList.filter(
          (log) =>
            log.startTimeStamp?.toDate().getTime() >= currentDate.getTime()
        );
        setDisplayedLogs(logsToday.reverse());
      } catch (err) {
        console.log("Error reading document:" + err);
      }
    } else if (!month) {
      const now = new Date();
      const enteredDate = new Date(now.getFullYear(), now.getMonth(), date);
      let plusOne = new Date();
      plusOne.setTime(enteredDate.getTime() + 24 * 60 * 60 * 1000);
      try {
        const logsCol = collection(db, "daily-log-24");
        const logsSnapshot = await getDocs(logsCol);
        const logsList = logsSnapshot.docs.map((doc) => doc.data());
        const logsEnteredDate = logsList.filter(
          (log) =>
            log.startTimeStamp?.toDate().getTime() >= enteredDate.getTime() &&
            log.startTimeStamp?.toDate().getTime() < plusOne.getTime()
        );
        setDisplayedLogs(logsEnteredDate.reverse());
      } catch (err) {
        console.log("Error reading document:" + err);
      }
    } else {
      const now = new Date();
      const enteredDate = new Date(now.getFullYear(), month - 1, date);
      let plusOne = new Date();
      plusOne.setTime(enteredDate.getTime() + 24 * 60 * 60 * 1000);
      try {
        const logsCol = collection(db, "daily-log-24");
        const logsSnapshot = await getDocs(logsCol);
        const logsList = logsSnapshot.docs.map((doc) => doc.data());
        const logsEnteredDate = logsList.filter(
          (log) =>
            log.startTimeStamp?.toDate().getTime() >= enteredDate.getTime() &&
            log.startTimeStamp?.toDate().getTime() < plusOne.getTime()
        );
        setDisplayedLogs(logsEnteredDate.reverse());
      } catch (err) {
        console.log("Error reading document:" + err);
      }
    }
  };

  return (
    <div className="display">
      <div className="date-label">
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
      <div className="displayed-logs">
        {displayedLogs
          .sort(
            (a, b) =>
              a.startTimeStamp.toDate().getTime() -
              b.startTimeStamp.toDate().getTime()
          )
          .map((log) => (
            <div>
              <h3>{log.title}</h3>
              <p>{log.description}</p>
              <h5>
                Start: {log.startTimeStamp.toDate().toLocaleString()} End:{" "}
                {log.endTimeStamp.toDate().toLocaleString()}
              </h5>
            </div>
          ))}
      </div>
    </div>
  );
}

export default Display;
