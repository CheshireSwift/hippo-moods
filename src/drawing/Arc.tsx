import { StrokeWidthProperty } from 'csstype';
import { css, cx } from 'emotion';
import React from 'react';
import Vector from '../maths/Vector';
import { arcPath } from './utils';

export type ArcProps = {
  color: string;
  thickness?: StrokeWidthProperty<number>;
  startProportion: number;
  endProportion: number;
  linecap: React.SVGAttributes<SVGPathElement>['strokeLinecap'];
  radius?: number;
  className?: string;
};
export const Arc = ({
  color,
  thickness = 100,
  startProportion,
  endProportion,
  linecap,
  radius = 500,
  className,
}: ArcProps) => (
  <path
    className={cx(
      css({
        stroke: color,
        strokeWidth: thickness,
        transition: 'opacity 0.25s, stroke-width 0.5s',
      }),
      className,
    )}
    fill="none"
    // stroke={color}
    // strokeWidth={thickness}
    strokeLinecap={linecap}
    d={arcPath(
      new Vector(0, 0),
      radius,
      // Subtract a quarter turn from each to start at the top rather than the right
      (startProportion - 0.25) * 2 * Math.PI,
      (endProportion - 0.25) * 2 * Math.PI,
    )}
  />
);

export default Arc;
