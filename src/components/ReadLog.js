import React from "react";

function ReadLog({ i, log, openUpdateModal, openDeleteModal }) {
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
          <button onClick={() => openUpdateModal(log)}>Update</button>
          <button onClick={() => openDeleteModal(log)}>Delete</button>
        </div>
      </div>
    </>
  );
}

export default ReadLog;
