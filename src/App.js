import React, { useEffect, useState } from "react";
import Display from "./components/Display";
import Forms from "./components/Forms";

function App() {
  const [localTheme, setLocalTheme] = useState("");
  const [displayGlobalTheme, setDisplayGlobalTheme] = useState(false);
  const [globalTheme, setGlobalTheme] = useState("");

  const handleChangeTheme = function (selectedColor, selectedMode) {
    const selectedTheme = [selectedColor, selectedMode].join("-");
    localStorage.setItem("theme", JSON.stringify(selectedTheme));
    setLocalTheme(selectedTheme);
  };

  useEffect(() => {
    const selectedTheme =
      JSON.parse(localStorage.getItem("theme")) ?? "gray-light";
    setLocalTheme(selectedTheme);
  }, []);

  useEffect(() => {
    if (!localTheme) return;
    if (localTheme.split("-")[1] === "auto") setDisplayGlobalTheme(true);
    else setDisplayGlobalTheme(false);
  }, [localTheme]);

  useEffect(() => {
    if (!displayGlobalTheme) return;
    setGlobalTheme(
      window.matchMedia("(prefers-color-scheme: dark)").matches
        ? `${localTheme.split("-")[0]}-dark`
        : `${localTheme.split("-")[0]}-light`
    );
    const autoThemeSwitcher = function () {
      setGlobalTheme(
        `${localTheme.split("-")[0]}-${
          window.matchMedia("(prefers-color-scheme: dark)").matches
            ? "dark"
            : "light"
        }`
      );
    };
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", autoThemeSwitcher);
    return () => {
      window
        .matchMedia("(prefers-color-scheme: dark")
        .removeEventListener("change", autoThemeSwitcher);
    };
  }, [displayGlobalTheme, localTheme]);

  if (!localTheme)
    return (
      <div className="lds-circle">
        <div></div>
      </div>
    );

  return (
    <>
      <main
        className="main"
        data-theme={displayGlobalTheme ? globalTheme : localTheme}
      >
        <Forms
          localTheme={localTheme}
          onTheme={handleChangeTheme}
          mode={
            displayGlobalTheme
              ? globalTheme.split("-")[1]
              : localTheme.split("-")[1]
          }
        />
        <Display />
      </main>
    </>
  );
}

export default App;
