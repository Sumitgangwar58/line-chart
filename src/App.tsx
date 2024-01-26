import React, { useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import LineChart, { dataSetLineChart } from "./components/old-chart/LineChart";
import SvgLineChart from "./components/SvgLineChart/SvgLineChart";

const App = () => {
  const demoDataSetLineChart: dataSetLineChart = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      // "Nov",
      // "Dec",
    ],
    dataSet: [
      {
        color: "blue",
        // points: Array(12).fill(0).map(i => Math.floor(Math.random()*100)),
        points: [0, 20, 40, 60, 80, 60, 40, 20, 0, 10],
        // points:Array(12).fill(0).map(i => Math.ceil(Math.floor(Math.random()*100))),
      },
      // {
      //   color: "#40a832",
      //   points:Array(12).fill(0).map(i => Math.ceil(Math.random()*100)),
      // },
      // {
      //   color: "#a832a2",
      //   points: Array(12).fill(0).map(i => Math.ceil(Math.random()*100)),
      // },
    ],
  };

  // return <LineChart {...demoDataSetLineChart} />;

  return (
    <div className="App">
      <SvgLineChart {...demoDataSetLineChart} />
    </div>
  );
};

export default App;
