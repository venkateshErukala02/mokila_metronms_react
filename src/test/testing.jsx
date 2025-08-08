import React, { useState } from "react";
import * as d3 from "d3";

import Pie from "./piegraph";

import "../pages/ornms.css";

function TestPie() {
  const generateData = (value, length = 5) =>
    d3.range(length).map((item, idx) => ({
      date: idx,
      value: value === null || value === undefined ? Math.random() * 100 : value
    }));

  const [data, setData] = useState(generateData());
  const changeData = () => {
    setData(generateData());
  };

  return (
    <div className="App">
      <h1>Pie Chart with React & D3</h1>
      <div>
        <button onClick={changeData}>Recalculate Data</button>
      </div>
      <div className="piechart">
        <Pie
          data={data}
          width={200}
          height={200}
          innerRadius={60}
          outerRadius={100}
        />
      </div>
    </div>
  );
}

export default TestPie;
