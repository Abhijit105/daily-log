import React, { useEffect, useCallback, useState } from "react";
import { onSnapshot, doc, collection } from "firebase/firestore";
import { db } from "../libs/firebase";
import ReadLog from "./ReadLog";
import UpdateModal from "./UpdateModal";
import DeleteModal from "./DeleteModal";

function ReadModal({
  onClose,
  displayedLogs,
  setDisplayedLogs,
  displayReadModal,
}) {
  const [displayUpdateModal, setDisplayUpdateModal] = useState(false);
  const [displayDeleteModal, setDisplayDeleteModal] = useState(false);
  const [logToBeUpdated, setLogToBeUpdated] = useState(null);
  const [logToBeDeleted, setLogToBeDeleted] = useState(null);

  const openUpdateModal = function (selectedLog) {
    setDisplayUpdateModal(true);
    setLogToBeUpdated(selectedLog);
  };

  const closeUpdateModal = function () {
    setDisplayUpdateModal(false);
    setLogToBeUpdated(null);
  };

  const openDeleteModal = function (selectedLog) {
    setDisplayDeleteModal(true);
    setLogToBeDeleted(selectedLog);
  };

  const closeDeleteModal = function () {
    setDisplayDeleteModal(false);
    setLogToBeDeleted(null);
  };

  const escapeCloser = useCallback(
    function (event) {
      if (event.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!displayUpdateModal || !logToBeUpdated?.id) return;
    const unsubscribe = onSnapshot(
      doc(db, "daily-log-24", logToBeUpdated.id),
      (doc) =>
        setDisplayedLogs((displayedLogs) =>
          displayedLogs.map((displayedLog) =>
            displayedLog.id !== logToBeUpdated.id
              ? displayedLog
              : { ...displayedLog, ...doc.data() }
          )
        )
    );
    return () => unsubscribe();
  }, [displayUpdateModal, logToBeUpdated?.id, setDisplayedLogs]);

  useEffect(() => {
    if (!displayDeleteModal) return;
    const unsubscribe = onSnapshot(collection(db, "daily-log-24"), (snapshot) =>
      setDisplayedLogs((displayedLogs) =>
        displayedLogs.filter((displayedLog) =>
          snapshot.docs.map((doc) => doc.id).includes(displayedLog.id)
        )
      )
    );
    return () => unsubscribe();
  }, [displayDeleteModal, setDisplayedLogs]);

  useEffect(() => {
    if (!displayReadModal) return;
    document.addEventListener("keydown", escapeCloser);
    return () => document.removeEventListener("keydown", escapeCloser);
  }, [escapeCloser, displayReadModal]);

  useEffect(() => {
    if (!displayedLogs) return;
    if (displayedLogs.length === 0) onClose();
  }, [displayedLogs, onClose]);

  return (
    <>
      <div className="modal read-modal">
        <div className="displayed-logs">
          {displayedLogs
            .sort(
              (a, b) =>
                a.startTimeStamp.toDate().getTime() -
                b.startTimeStamp.toDate().getTime()
            )
            .map((log, i) => (
              <ReadLog
                i={i}
                log={log}
                key={i}
                openUpdateModal={openUpdateModal}
                openDeleteModal={openDeleteModal}
              />
            ))}
        </div>
      </div>
      <div className="overlay read-modal-overlay" onClick={onClose}></div>
      {displayUpdateModal && (
        <UpdateModal
          onClose={closeUpdateModal}
          log={logToBeUpdated}
          displayUpdateModal={displayUpdateModal}
        />
      )}
      {displayDeleteModal && (
        <DeleteModal
          onClose={closeDeleteModal}
          log={logToBeDeleted}
          displayDeleteModal={displayDeleteModal}
        />
      )}
    </>
  );
}

export default ReadModal;
