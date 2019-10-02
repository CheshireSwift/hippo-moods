import { css } from 'emotion';
import _ from 'lodash';
import React from 'react';

const axes = (
  <>
    <line x1={0} x2={0} y1={-1000} y2={1000} stroke="black" />
    <line x1={-1000} x2={1000} y1={0} y2={0} stroke="black" />
  </>
);

const gradations = (frequency: number) =>
  _.range(-200, 100, frequency).map((x) => (
    <line key={x} x1={x} x2={x} y1={0} y2={frequency / 10} stroke="black" />
  ));

const scaledSin = (x: number, amplitude: number) =>
  amplitude * Math.sin((Math.PI / 100) * x);

export const SineChart = ({
  data,
  offset = 0,
  amplitude = 100,
}: {
  data: ProportionData[];
  offset: number;
  amplitude: number;
}) => (
  <svg
    className={css({ margin: '4rem 20%', width: '60%' })}
    viewBox="-200 -100 300 200"
  >
    <rect
      x="-200"
      y="-100"
      width="300"
      height="200"
      stroke="white"
      fill="none"
    />
    {axes}
    {gradations(25)}
    {gradations(50)}
    {gradations(100)}
    {data.map((point) => (
      <circle
        key={point.dateProportion}
        cx={point.dateProportion * 100}
        cy={200 * point.moodProportion - 100}
        r={1}
        fill="red"
      />
    ))}
    {_.range(-250, 150, 100).map((x) => (
      <path
        key={x}
        d={halfSine(
          x + offset * 100,
          scaledSin(x, amplitude),
          x + 100 + offset * 100,
          scaledSin(x + 100, amplitude),
        )}
        stroke="pink"
        fill="none"
      />
    ))}
  </svg>
);

// Spooky bezier curve magic for approximating half a cosine, courtesy of StackOverflow
const K = 0.37;
const halfSine = (x1: number, y1: number, x2: number, y2: number) => {
  return (
    'M' +
    x1 +
    ',' +
    y1 +
    'C' +
    (x1 + K * (x2 - x1)) +
    ',' +
    y1 +
    ',' +
    (x2 - K * (x2 - x1)) +
    ',' +
    y2 +
    ',' +
    x2 +
    ',' +
    y2
  );
};

export default SineChart;
