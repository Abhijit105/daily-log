import React, { useState } from "react";
import Form from "./Form";
import { db } from "../libs/firebase";
import { COLORS } from "../config/config";
import ColorContainer from "./ColorContainer";

function Forms({ theme, onTheme }) {
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

  const changeColorHandler = function (event) {
    onTheme(event.target.dataset.color, theme.split("-")[1]);
  };

  const changeModeHandler = function (event) {
    onTheme(theme.split("-")[0], event.target.dataset.mode);
  };

  return (
    <div className="forms">
      <nav className="nav nav-buttons">
        <button data-mode="light" onClick={changeModeHandler}>
          Light
        </button>
        <button data-mode="dark" onClick={changeModeHandler}>
          Dark
        </button>
        <button data-mode="auto" onClick={changeModeHandler}>
          Auto
        </button>
        {COLORS.map((color, i) => (
          <ColorContainer
            key={i}
            onColorHandler={changeColorHandler}
            color={color}
            theme={theme}
          />
        ))}
        {true && <button>{theme.toLocaleUpperCase()}</button>}
      </nav>
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
