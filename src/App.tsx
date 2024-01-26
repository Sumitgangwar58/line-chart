import React, { useEffect, useRef } from "react";
import logo from "./logo.svg";
import "./App.css";

const lineColor = "red";
const lineWidth = 1;

const xPadding = 50;
const yPadding = 50;

const canvasWidth = 800;
const canvasHeight = 500;

const cutSize = 5;

const getLength = (
  length: number,
  currPointNumber: number,
  totalPoints: number,
  padding: number
) => {
  const blockWidth = (length - 2 * padding) / totalPoints;
  const currentDist = currPointNumber * blockWidth;

  console.log(currentDist - blockWidth / 2, "length");

  return currentDist;
};

const labels = Array(10)
  .fill(0)
  .map((i, index) => index.toString());

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;

    drawScale(ctx);
  }, []);

  const drawScale = (ctx: CanvasRenderingContext2D) => {
    const origin = {
      x: xPadding,
      y: canvasHeight - yPadding,
    };
    ctx.beginPath();

    ctx.strokeStyle = lineColor;
    ctx.lineWidth = lineWidth;

    //making horizontal line
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(xPadding, yPadding);

    //making vertical line
    ctx.moveTo(origin.x, origin.y);
    ctx.lineTo(canvasWidth - xPadding, origin.y);

    // making points and setting labels in horizontal line
    ctx.moveTo(origin.x, origin.y);
    for (let i = 0; i < labels.length - 1; i++) {
      const labelPoint = (p: { x: number; y: number }) => {
        const offset = 10;
        ctx.fillText(labels[i], p.x + offset, p.y + offset);
      };
      const currPoint = {
        x: origin.x + getLength(canvasWidth, i, labels.length, xPadding),
        y: origin.y,
      };

      ctx.moveTo(currPoint.x, currPoint.y);
      ctx.lineTo(currPoint.x, currPoint.y + cutSize);
      labelPoint(currPoint);
    }

    ctx.stroke();
  };

  return (
    <div className="App">
      <canvas
        ref={canvasRef}
        width={canvasWidth}
        height={canvasHeight}
      ></canvas>
    </div>
  );
}

export default App;
