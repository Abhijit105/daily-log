import React, { useEffect, useState } from "react";
import Display from "./components/Display";
import Forms from "./components/Forms";

function App() {
  const [theme, setTheme] = useState("");

  const handleChangeTheme = function (selectedColor, selectedMode) {
    setTheme([selectedColor, selectedMode].join("-"));
    localStorage.setItem(
      "theme",
      JSON.stringify([selectedColor, selectedMode].join("-"))
    );
  };

  console.log(document.querySelector(".main"));
  console.log(theme);

  useEffect(() => {
    const selectedTheme =
      JSON.parse(localStorage.getItem("theme")) ?? "gray-light";
    setTheme(selectedTheme);
  }, []);

  if (!theme)
    return (
      <div className="lds-circle">
        <div></div>
      </div>
    );

  return (
    <>
      <main
        className="main"
        data-theme={
          theme.endsWith("auto")
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
              ? `${theme.split("-")[0]}-dark`
              : `${theme.split("-")[0]}-light`
            : theme
        }
      >
        <Forms theme={theme} onTheme={handleChangeTheme} />
        <Display />
      </main>
    </>
  );
}

export default App;
