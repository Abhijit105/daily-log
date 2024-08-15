import DisplayLog from "./DisplayLog";

function ReadModal({
  onClose,
  errorDisplayedLogs,
  isLoadingDisplayedLogs,
  displayedLogs,
  setDisplayedLogs,
}) {
  return (
    <>
      <div className="modal read-modal">
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
      <div className="overlay" onClick={onClose}></div>
    </>
  );
}

export default ReadModal;
