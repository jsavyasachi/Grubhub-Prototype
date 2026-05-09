import React, { useState } from "react";
import Title from "./title";
import Display from "./display";
import Buttons from "./buttons";
import axios from "axios";

const Wrapper = () => {
  const [disp, setDisp] = useState("");

  const onClick = async (button) => {
    if (button === "=") {
      await calculate();
    } else if (button === "C") {
      reset();
    } else if (button === "CE") {
      setDisp(prev => prev.slice(0, -1));
    } else {
      setDisp(prev => prev + button);
    }
  };

  const calculate = async () => {
    try {
      const response = await axios.post("http://localhost:3001/calculate", { expr: disp });
      if (response.status === 200) {
        setDisp(String(response.data));
      } else {
        setDisp("ERROR");
      }
    } catch (e) {
      setDisp("Error in React");
    }
  };

  const reset = () => {
    setDisp("");
  };

  const calcStyle = {
    maxWidth: "22rem",
    margin: "5% auto"
  };

  return (
    <div style={calcStyle}>
      <Title />
      <Display disp={disp} />
      <Buttons onClick={onClick} />
    </div>
  );
};

export default Wrapper;
