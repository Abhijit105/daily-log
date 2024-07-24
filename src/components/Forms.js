import React, { useState } from "react";
import Form from "./Form";

function Forms({ db }) {
  const [logsData, setLogsData] = useState([
    {
      title: "",
      description: "",
    },
  ]);

  const addLogData = function () {
    setLogsData((logsData) => [
      ...logsData,
      {
        title: "",
        description: "",
      },
    ]);
  };

  const removeLogData = function () {
    setLogsData((logsData) =>
      logsData.filter((_, i, arr) => i !== arr.length - 1)
    );
  };

  return (
    <div className="forms">
      {logsData.map((logData, i) => (
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
