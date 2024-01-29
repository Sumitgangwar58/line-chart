import React, { useEffect, useMemo, useRef, useState } from "react";
import "../old-chart/LineChart.css";
import { cubicSplineInterpolation } from "../old-chart/Curve";

export interface LineChartI {
  width?: number;
  height?: number;
  lineType?: "straight" | "curved";
  labels: {
    x: string[] | number;
    y: string[] | number;
  };
  dataSet: {
    color: string;
    points: number[];
  }[];
  graphScale?: {
    textColor: string;
    color: string;
    lineWidth: number;
    cutSize: number;
    cutGap: number;
    cutPosition: "center" | "left" | "right";
  };
  xPadding?: number;
  yPadding?: number;
}

type Point = { x: number; y: number };

const LineChartSvg = ({
  width = 600,
  height = 450,
  labels,
  dataSet,
  lineType = "curved",
  graphScale = {
    color: "#9B9EA5",
    lineWidth: 1,
    cutGap: 12,
    cutSize: 9,
    cutPosition: "center",
    textColor: "#1C2433",
  },
  xPadding = 60,
  yPadding = 50,
}: LineChartI) => {
  const [curvesEquations, setCurveEquations] = useState<
    ((x: number) => number)[]
  >([]);
  const [curveLines, setCurveLines] = useState<React.JSX.Element[]>([]);
  const [graphScaleLine, setGraphScaleLine] = useState<React.JSX.Element>();
  const [mousePosition, setMousePosition] = useState<Point>();
  const chartRef = useRef<SVGSVGElement>(null);

  const origin = {
    x: xPadding,
    y: height - yPadding,
  };

  const xBlockCount = typeof labels.x === "number" ? labels.x : labels.x.length;
  const yBlockCount = typeof labels.y === "number" ? labels.y : labels.y.length;

  const xBlockWidth = (width - 2 * xPadding) / xBlockCount;
  const yBlockWidth = (height - 2 * yPadding) / yBlockCount;

  const maxY = useMemo<number>(() => {
    let maxY = 0;
    dataSet.forEach((i) => {
      let currMax = Math.max(...i.points);
      if (currMax > maxY) maxY = currMax;
    });
    return maxY - (maxY % 10) + 10;
  }, [dataSet]);

  const getPointsFromIndex = (
    index: number,
    line: "horizontal" | "vertical"
  ) => {
    const blockWidth = line === "vertical" ? yBlockWidth : xBlockWidth;
    const currSize =
      blockWidth * (index + 1) -
      (graphScale.cutPosition === "center"
        ? blockWidth / 2
        : graphScale.cutPosition === "left"
        ? blockWidth
        : 0);
    return line === "vertical" ? origin.y - currSize : origin.x + currSize;
  };

  const drawScale = () => {
    let xLabelPoints: Point[] = [];
    let yLabelPoints: Point[] = [];

    const makeScaleLabel = (
      point: Point,
      label: string,
      line: "horizontal" | "vertical"
    ) => {
      return (
        <text
          className={`inte-scaleLabel--${line}`}
          x={line === "vertical" ? point.x - (graphScale.cutGap ?? 0) : point.x}
          y={
            line === "horizontal" ? point.y + (graphScale.cutGap ?? 0) : point.y
          }
          stroke={graphScale.textColor}
          strokeWidth={0.1}
        >
          {label}
        </text>
      );
    };

    const cutsInXAxis = Array(xBlockCount)
      .fill(0)
      .map((item, index) => {
        const x1 = getPointsFromIndex(index, "horizontal");
        const x2 = x1;
        const y1 = origin.y;
        const y2 = origin.y + (graphScale?.cutSize ?? 0);
        xLabelPoints.push({
          x: x2,
          y: y2,
        });
        return `M ${x1},${y1} ${x2},${y2}`;
      })
      .join(" ");

    const cutsInYAxis = Array(yBlockCount)
      .fill(0)
      .map((item, index) => {
        const x1 = xPadding;
        const x2 = xPadding - (graphScale?.cutSize ?? 0);
        const y1 = getPointsFromIndex(index, "vertical");
        const y2 = y1;
        yLabelPoints.push({
          x: x2,
          y: y2,
        });
        return `M ${x1},${y1} ${x2},${y2}`;
      })
      .join(" ");

    const getYLabel = (index: number, tot: number) => {
      const blockWidth = maxY / tot;
      const currValue = blockWidth * (index + 1);
      return graphScale.cutPosition === "center"
        ? currValue - blockWidth / 2
        : graphScale.cutPosition === "left"
        ? currValue + blockWidth
        : currValue;
    };
    const xLabels = xLabelPoints.map((item, index) =>
      makeScaleLabel(
        item,
        typeof labels.x === "number" ? `${xPadding + item.x}` : labels.x[index],
        "horizontal"
      )
    );

    const ylabels = yLabelPoints.map((item, index) =>
      makeScaleLabel(
        item,
        typeof labels.y === "number"
          ? `${getYLabel(index, labels.y)}`
          : labels.y[index],
        "vertical"
      )
    );

    return (
      <>
        <path
          d={`M ${xPadding},${yPadding} ${origin.x},${origin.y} ${
            width - xPadding
          },${height - yPadding} ${cutsInXAxis} ${cutsInYAxis}`}
          strokeWidth={graphScale.lineWidth}
          stroke={graphScale.color}
          fill="none"
        />
        {xLabels}
        {ylabels}
      </>
    );
  };

  const drawCurve = () => {
    const equations: Function[] = [];
    const xPoints = Array(xBlockCount)
      .fill(0)
      .map((item, index) => getPointsFromIndex(index, "horizontal"));
    const getYPoints = (y: number) => {
      return origin.y - (y / yBlockCount) * yBlockWidth;
    };

    const curvesEquations = dataSet.map((item, index) => {
      const currPoints = xPoints.map((x, index) => {
        return {
          x: x,
          y: getYPoints(item.points[index]),
        };
      });
      return cubicSplineInterpolation(
        currPoints,
        xPadding,
        yPadding,
        width - xPadding,
        height - yPadding
      );
    });

    setCurveEquations(curvesEquations);

    const curvesPoint =
      lineType === "curved"
        ? curvesEquations.map((equation, index) => {
            const points: Point[] = [];
            for (let i = xPadding; i < width - xPadding; i++) {
              points.push({
                x: i,
                y: equation(i),
              });
            }
            return points;
          })
        : dataSet.map((item, index) => {
            const points: Point[] = [];
            for (let i = 0; i < xPoints.length; i++) {
              points.push({
                x: xPoints[i],
                y: getYPoints(item.points[i]),
              });
            }
            return points;
          });

    const curveLines = curvesPoint.map((item, index) => {
      let path = "";
      item.forEach((p) => (path += `${p.x},${p.y} `));
      return (
        <path
          d={`M ${path}`}
          strokeWidth={graphScale.lineWidth * 2}
          stroke={dataSet[index].color}
          fill="none"
        />
      );
    });

    return curveLines;
  };

  const handelMouseOver = (e: MouseEvent) => {
    const currPoint = {
      x: e.clientX - (chartRef.current?.getBoundingClientRect().left ?? 0),
      y: e.clientY - (chartRef.current?.getBoundingClientRect().top ?? 0),
    };
    if (
      currPoint.x < xPadding ||
      currPoint.y < yPadding ||
      currPoint.x > width - xPadding ||
      currPoint.y > height - yPadding
    )
      setMousePosition(undefined);
    else setMousePosition(currPoint);
  };

  useEffect(() => {
    if (!chartRef) return;
    setCurveLines(drawCurve());
    setGraphScaleLine(drawScale());
    chartRef.current?.addEventListener("mousemove", handelMouseOver);
    return () => {
      chartRef.current?.removeEventListener("mousemove", handelMouseOver);
    };
  }, [dataSet]);

  return (
    <div className="inte-LineChart">
      <svg ref={chartRef} width={width} height={height}>
        {graphScaleLine}
        {curveLines}
        {/* {
          hoveredLine
        } */}
      </svg>
      {mousePosition ? (
        <>
          <div
            className="hovered-line vertical"
            style={{
              borderWidth: `${graphScale.lineWidth}px`,
              width: `1px`,
              height: `${origin.y - mousePosition.y}px`,
              top: `${mousePosition.y}px`,
              left: `${mousePosition.x}px`,
            }}
          />
          <div
            className="hovered-line horizontal"
            style={{
              borderWidth: `${graphScale.lineWidth}px`,
              width: `${mousePosition.x - origin.x}px`,
              height: "1px",
              top: `${mousePosition.y}px`,
              left: `${origin.x}px`,
            }}
          />
        </>
      ) : null}
    </div>
  );
};

export default LineChartSvg;
