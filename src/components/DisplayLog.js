import React, { useState, useEffect } from "react";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { db } from "../libs/firebase";
import UpdateModal from "./UpdateModal";
import DeleteModal from "./DeleteModal";

function DisplayLog({ i, log, setDisplayedLogs }) {
  const [displayUpdateModal, setDisplayUpdateModal] = useState(false);
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);

  const openUpdateModal = function () {
    setDisplayUpdateModal(true);
  };

  const closeUpdateModal = function () {
    setDisplayUpdateModal(false);
  };

  const openDeleteModal = function () {
    setDisplayDeleteModal(true);
  };

  const closeDeleteModal = function () {
    setDisplayDeleteModal(false);
  };

  useEffect(() => {
    if (!displayUpdateModal) return;
    const unsubscribe = onSnapshot(doc(db, "daily-log-24", log.id), (doc) =>
      setDisplayedLogs((displayedLogs) =>
        displayedLogs.map((displayedLog) =>
          displayedLog.id !== log.id
            ? displayedLog
            : { ...displayedLog, ...doc.data() }
        )
      )
    );
    return () => unsubscribe();
  }, [displayUpdateModal, log?.id, setDisplayedLogs]);

  useEffect(() => {
    if (!displayDeleteModal) return;
    console.log("called");
    const unsubscribe = onSnapshot(collection(db, "daily-log-24"), (snapshot) =>
      setDisplayedLogs((displayedLogs) =>
        displayedLogs.filter((displayedLog) =>
          snapshot.docs.map((doc) => doc.id).includes(displayedLog.id)
        )
      )
    );
    return () => unsubscribe();
  }, [displayDeleteModal, setDisplayedLogs]);

  return (
    <>
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
        <div className="action-buttons">
          <button onClick={openUpdateModal}>Update</button>
          <button onClick={openDeleteModal}>Delete</button>
        </div>
      </div>
      {displayUpdateModal && (
        <UpdateModal
          onClose={closeUpdateModal}
          log={log}
          displayUpdateModal={displayUpdateModal}
        />
      )}
      {displayDeleteModal && (
        <DeleteModal
          onClose={closeDeleteModal}
          log={log}
          displayDeleteModal={displayDeleteModal}
        />
      )}
    </>
  );
}

export default DisplayLog;
