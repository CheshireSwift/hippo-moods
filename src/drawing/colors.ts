type Triad = [number, number, number];

export const blendColors = (
  [a1, a2, a3]: Triad,
  [b1, b2, b3]: Triad,
  bias = 0.5,
): Triad => [
  (1 - bias) * a1 + bias * b1,
  (1 - bias) * a2 + bias * b2,
  (1 - bias) * a3 + bias * b3,
];

export const rgbTriadToCss = (triad: Triad) => `rgb(${triad.join(',')})`;
