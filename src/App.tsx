import React, { useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import LineChart, { dataSetLineChart } from "./components/old-chart/LineChart";

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
      "Nov",
      "Dec",
    ],
    dataSet: [
      {
        color: "#a83232",
        // points: Array(12).fill(0).map(i => Math.floor(Math.random()*100)),
        points: [10, 20, 30, 20, 10, 60, 70, 80, 90, 9, 72, 93],
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

  return <LineChart {...demoDataSetLineChart} />;
};

export default App;
