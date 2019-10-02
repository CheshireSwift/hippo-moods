import { StrokeWidthProperty } from 'csstype';
import { css } from 'emotion';
import React from 'react';
import Vector from '../maths/Vector';
import { arcPath } from './utils';

export type ArcProps = {
  color: string;
  thickness?: StrokeWidthProperty<number>;
  startProportion: number;
  endProportion: number;
  linecap: React.SVGAttributes<SVGPathElement>['strokeLinecap'];
};
export const Arc = ({
  color,
  thickness = 100,
  startProportion,
  endProportion,
  linecap,
}: ArcProps) => (
  <path
    className={css({ stroke: color })}
    fill="none"
    stroke={color}
    strokeWidth={thickness}
    strokeLinecap={linecap}
    d={arcPath(
      new Vector(0, 0),
      500,
      // Subtract a quarter turn from each to start at the top rather than the right
      (startProportion - 0.25) * 2 * Math.PI,
      (endProportion - 0.25) * 2 * Math.PI,
    )}
  />
);

export default Arc;
