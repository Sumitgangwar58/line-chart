import React, { useMemo } from "react";
import { dataSetLineChart } from "../old-chart/LineChart";
import PrintArray from "../../Utiltiy/PrintArray";
import { cubicSplineInterpolation } from "../old-chart/Curve";

const xPadding = 50;
const yPadding = 50;

const lineWidth = 1;
const lineColor = "black";
const textColor = "#1C2433";

const cutSize = 9;
const verticalBlockCount = 10;
const cutGap = 12;
const cutColor = "red";

let width = window.innerWidth;
let height = window.innerHeight;

// window.setTimeout(() => {
//   width = window.innerWidth;
//   height = window.innerHeight;
// }, 1000);

const graphWidth = width - 2 * xPadding;
const graphHeight = height - 2 * yPadding;

type Point = { x: number; y: number };

const SvgLineChart = ({ labels, dataSet }: dataSetLineChart) => {
  const maxY = useMemo<number>(() => {
    let maxY = 0;
    dataSet.map((i) => {
      let currMax = Math.max(...i.points);
      if (currMax > maxY) maxY = currMax;
    });
    return maxY - (maxY % 10) + 10;
  }, [dataSet]);

  const origin: Point = {
    x: xPadding,
    y: height - yPadding,
  };

  const yBlockWidth = graphHeight / verticalBlockCount;

  const xBlockWidth = graphWidth / labels.length;

  const cutsInYAxis = Array(verticalBlockCount)
    .fill(0)
    .map((i, ind) => {
      const currPoint: Point = {
        x: xPadding,
        y: origin.y - yBlockWidth * ind,
      };

      const currPointF: Point = {
        x: origin.x + graphWidth,
        y: currPoint.y,
      };
      return (
        <>
          <line
            x1={currPoint.x}
            y1={currPoint.y}
            x2={origin.x - cutSize}
            y2={currPoint.y}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <line
            x1={currPointF.x}
            y1={currPointF.y}
            x2={origin.x - cutSize}
            y2={currPointF.y}
            stroke={cutColor}
            strokeWidth={lineWidth / 2}
          />
        </>
      );
    });

  const cutsInYAxisPath: string = Array(verticalBlockCount)
    .fill(0)
    .map((i, ind) => {
      const currPoint: Point = {
        x: xPadding,
        y: origin.y - yBlockWidth * ind,
      };

      const currPointF: Point = {
        x: origin.x + graphWidth,
        y: currPoint.y,
      };

      return `M${currPoint.x},${currPoint.y} ${origin.x - cutSize},${
        currPoint.y
      } M${currPointF.x},${currPointF.y} ${origin.x - cutSize},${currPointF.y}`;
    })
    .join(" ");

  const combinedPath = (
    <path d={cutsInYAxisPath} stroke={lineColor} strokeWidth={lineWidth} />
  );

  const cutsInXAxis = Array(labels.length)
    .fill(0)
    .map((i, ind) => {
      const currPoint: Point = {
        x: xPadding + xBlockWidth * ind,
        y: origin.y,
      };

      const currPointF: Point = {
        x: currPoint.x,
        y: yPadding,
      };
      return (
        <>
          <line
            x1={currPoint.x}
            y1={currPoint.y}
            x2={currPoint.x}
            y2={currPoint.y + cutSize}
            stroke={lineColor}
            strokeWidth={lineWidth}
          />
          <line
            x1={currPointF.x}
            y1={currPointF.y}
            x2={currPointF.x}
            y2={origin.y + cutSize}
            stroke={cutColor}
            strokeWidth={lineWidth / 2}
          />
        </>
      );
    });
  console.log("Y-Block-Width", yBlockWidth, "yPadding = ", yPadding);
  const getYPixel = (blockWidth: number, dataPoint: number) => {
    console.log(dataPoint, "Y-DataPoint");
    const spaceTakes = dataPoint / verticalBlockCount;
    console.log(
      "Y-DataPoint = ",
      dataPoint,
      "pixel =",
      blockWidth * spaceTakes
    );
    return blockWidth * spaceTakes;
  };
  const yearLinePoint = Array(labels.length)
    .fill(0)
    .map((item, i) => {
      return {
        x: origin.x + xBlockWidth * i,
        y: origin.y - getYPixel(yBlockWidth, dataSet[0].points[i]),
      };
    });

  const smoothYearLine = cubicSplineInterpolation(
    yearLinePoint,
    xPadding,
    yPadding,
    xPadding + graphWidth,
    yPadding + graphHeight
  );

  const yearLine: string[] = Array(graphWidth)
    .fill(0)
    .map((item, ind) => {
      const currPoint = {
        x: xPadding + ind,
        y: smoothYearLine(xPadding + ind),
      };
      return `${currPoint.x},${currPoint.y}`;
    });

  console.log(yearLine.join(" "));

  return (
    <svg width={width} height={height}>
      <path
        d={`M ${yearLine.join(" ")}`}
        stroke={`${dataSet[0].color}`}
        strokeWidth={lineWidth * 5}
        fill="#067de560"
      />
      <line
        x1={origin.x}
        y1={origin.y}
        x2={width - xPadding}
        y2={origin.y}
        stroke={lineColor}
        strokeWidth={lineWidth}
      />
      <line
        x1={xPadding}
        y1={yPadding}
        x2={xPadding}
        y2={height - yPadding}
        stroke={lineColor}
        strokeWidth={lineWidth}
      />

      <PrintArray arr={cutsInXAxis} />
      {/* {combinedPath} */}
      <PrintArray arr={cutsInYAxis} />
    </svg>
  );
};

export default SvgLineChart;
