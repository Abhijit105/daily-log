import React, { useState } from "react";
import Form from "./Form";
import { db } from "../libs/firebase";

function Forms({ theme, onTheme }) {
  const [logsData, setLogsData] = useState([
    {
      title: "",
      description: "",
    },
  ]);
  const [color, setColor] = useState("");

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
        <button
          className={`gray-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="gray"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        <button
          className={`red-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="red"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        <button
          className={`pink-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="pink"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        <button
          className={`grape-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="grape"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        <button
          className={`violet-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="violet"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        <button
          className={`indigo-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="indigo"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        <button
          className={`blue-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="blue"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        <button
          className={`cyan-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="cyan"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        <button
          className={`teal-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="teal"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        <button
          className={`green-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="green"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        <button
          className={`lime-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="lime"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        <button
          className={`yellow-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="yellow"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        <button
          className={`orange-${
            theme.endsWith("auto")
              ? window.matchMedia("(prefers-color-scheme: dark)").matches
                ? "dark"
                : "light"
              : theme.split("-")[1]
          }`}
          data-color="orange"
          onClick={changeColorHandler}
          onMouseOver={(event) => setColor(event.target.dataset.color)}
          onMouseOut={(event) => setColor("")}
        ></button>
        {color && (
          <button
            className={`${color}-${
              theme.endsWith("auto")
                ? window.matchMedia("(prefers-color-scheme: dark)").matches
                  ? "dark"
                  : "light"
                : theme.split("-")[1]
            }`}
          >
            {color.toLocaleUpperCase()}
          </button>
        )}
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
