import { useState } from "react";

function ColorContainer({ mode, color, onColorHandler }) {
  const [displayTooltip, setDisplayTooltip] = useState(false);

  return (
    <div className="color-container">
      <button
        className={`${color}-${mode}`}
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
