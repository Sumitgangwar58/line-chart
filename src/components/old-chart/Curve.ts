export function cubicSplineInterpolation(
  points: { x: number; y: number }[],
  minX: number,
  minY: number,
  maxX: number,
  maxY: number
): (x: number) => number {
  // Compute coefficients
  const n = points.length;
  const h: number[] = [];
  const alpha: number[] = [];
  const l: number[] = [];
  const mu: number[] = [];
  const z: number[] = [];
  const c: number[] = [];
  const b: number[] = [];
  const d: number[] = [];

  for (let i = 0; i < n - 1; i++) {
    h[i] = points[i + 1].x - points[i].x;
  }
  for (let i = 1; i < n - 1; i++) {
    alpha[i] =
      (3 / h[i]) * (points[i + 1].y - points[i].y) -
      (3 / h[i - 1]) * (points[i].y - points[i - 1].y);
  }

  l[0] = 1;
  mu[0] = 0;
  z[0] = 0;

  for (let i = 1; i < n - 1; i++) {
    l[i] = 2 * (points[i + 1].x - points[i - 1].x) - h[i - 1] * mu[i - 1];
    mu[i] = h[i] / l[i];
    z[i] = (alpha[i] - h[i - 1] * z[i - 1]) / l[i];
  }

  l[n - 1] = 1;
  z[n - 1] = 0;
  c[n - 1] = 0;

  for (let j = n - 2; j >= 0; j--) {
    c[j] = z[j] - mu[j] * c[j + 1];
    b[j] =
      (points[j + 1].y - points[j].y) / h[j] -
      (h[j] * (c[j + 1] + 2 * c[j])) / 3;
    d[j] = (c[j + 1] - c[j]) / (3 * h[j]);
  }

  // Return the interpolated function
  return (x: number): number => {
    // Clamp x within boundaries
    x = Math.max(minX, Math.min(maxX, x));

    let i = 0;
    while (i < n && points[i].x < x) {
      i++;
    }
    if (i === 0) {
      i = 1;
    } else if (i === n) {
      i = n - 1;
    }

    const xi = points[i - 1].x;
    const yi = points[i - 1].y;
    const bi = b[i - 1];
    const ci = c[i - 1];
    const di = d[i - 1];

    const dx = x - xi;

    // Calculate the interpolated y value
    let interpolatedY = yi + bi * dx + ci * dx ** 2 + di * dx ** 3;

    // Clamp y within boundaries
    interpolatedY = Math.max(minY, Math.min(maxY, interpolatedY));

    return interpolatedY;
  };
}
