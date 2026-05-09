import React from "react";

const Buttons = ({ onClick }) => {
  const buttons = [
    "(", "CE", ")", "C",
    "1", "2", "3", "+",
    "4", "5", "6", "-",
    "7", "8", "9", "*",
    ".", "0", "=", "/"
  ];

  return (
    <div className="btn-group-vertical w-100">
      <div className="row no-gutters">
        {buttons.map((btn, index) => (
          <div key={index} className="col-3">
            <button
              className="btn btn-outline-secondary w-100 p-3"
              onClick={() => onClick(btn)}
            >
              {btn}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Buttons;
