import React, { useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";
import LineChart, { dataSetLineChart } from "./components/old-chart/LineChart";
import SvgLineChart from "./components/SvgLineChart/SvgLineChart";
import LineChartSvg from "./components/SvgLineChart/SvgLineChart";

const xBlockCount = 10;

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
        points: [5, 20, 35, 20, 10, 65, 70, 80, 90, 0, 92, 93],
        // points:Array(12).fill(0).map(i => Math.ceil(Math.floor(Math.random()*100))),
      },
      // {
      //   color: "#40a832",
      //   points:Array(12).fill(0).map(i => Math.ceil(Math.random()*90)),
      // },
      // {
      //   color: "#a832a2",
      //   points: Array(12).fill(0).map(i => Math.ceil(Math.random()*100)),
      // },
    ],
  };

  return (
    <div className="App">
      <LineChartSvg
        width={800}
        height={500}
        lineType={"curved"}
        dataSet={demoDataSetLineChart.dataSet}
        labels={{
          x: demoDataSetLineChart.labels,
          y: 10,
        }}
        graphScale={{
          color: "#9B9EA5",
          lineWidth: 2,
          cutGap: 12,
          cutSize: 9,
          cutPosition: "center",
          textColor: "#1C2433",
        }}
      />
    </div>
  );
};

export default App;
