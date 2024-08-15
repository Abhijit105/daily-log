import React, { useEffect, useCallback } from "react";
import DisplayLog from "./DisplayLog";

function ReadModal({
  onClose,
  displayedLogs,
  setDisplayedLogs,
  displayReadModal,
}) {
  const escapeCloser = useCallback(
    function (event) {
      if (event.key === "Escape") onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (!displayReadModal) return;
    document.addEventListener("keydown", escapeCloser);
    return () => document.removeEventListener("keydown", escapeCloser);
  }, [escapeCloser, displayReadModal]);

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
              <DisplayLog
                i={i}
                log={log}
                setDisplayedLogs={setDisplayedLogs}
                key={i}
              />
            ))}
        </div>
      </div>
      <div className="overlay" onClick={onClose}></div>
    </>
  );
}

export default ReadModal;
