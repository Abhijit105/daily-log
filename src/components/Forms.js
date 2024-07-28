import React, { useState } from "react";
import Form from "./Form";
import { db } from "../libs/firebase";

function Forms() {
  const [logsData, setLogsData] = useState([
    {
      title: "",
      description: "",
    },
  ]);

  const addLogData = function (event) {
    event.preventDefault();
    setLogsData((logsData) => [
      ...logsData,
      {
        title: "",
        description: "",
      },
    ]);
  };

  const removeLogData = function (event) {
    event.preventDefault();
    setLogsData((logsData) =>
      logsData.filter((_, i, arr) => i !== arr.length - 1)
    );
  };

  return (
    <div className="forms">
      {logsData.map((_, i) => (
        <Form
          i={i}
          db={db}
          logsData={logsData}
          setLogsData={setLogsData}
          addLogData={addLogData}
          removeLogData={removeLogData}
          key={i}
        />
      ))}
    </div>
  );
}

export default Forms;
