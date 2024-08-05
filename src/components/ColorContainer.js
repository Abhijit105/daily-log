import { useState } from "react";

function ColorContainer({ theme, color, onColorHandler }) {
  const [displayTooltip, setDisplayTooltip] = useState(false);

  return (
    <div className="color-container">
      <button
        className={`${color}-${
          theme.split("-")[1] === "auto"
            ? window.matchMedia("(prefers-color-scheme: dark)").matches
              ? "dark"
              : "light"
            : theme.split("-")[1]
        }`}
        data-color={color}
        onClick={onColorHandler}
        onMouseOver={() => setDisplayTooltip(true)}
        onMouseOut={() => setDisplayTooltip(false)}
      ></button>
      {displayTooltip && (
        <div className="tooltip">
          {color
            .split("")
            .map((char, i) => (i === 0 ? char.toLocaleUpperCase() : char))
            .join("")}
        </div>
      )}
    </div>
  );
}

export default ColorContainer;
