import React from "react";

const Display = ({ disp }) => {
  return (
    <div className="input-group">
      <input
        type="text"
        className="form-control text-right"
        value={disp}
        readOnly
      />
    </div>
  );
};

export default Display;
