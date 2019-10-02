import { css } from 'emotion';
import _ from 'lodash';
import React from 'react';
import { Arc, ArcProps } from './Arc';
import { blendColors, rgbTriadToCss } from './colors';

const colorForPoint = (point: ProportionData) =>
  blendColors([0, 0, 255], [255, 0, 0], point.moodProportion);

const colorForArc = (start: ProportionData, end: ProportionData) =>
  blendColors(colorForPoint(start), colorForPoint(end));

const RoundedArc = (props: Omit<ArcProps, 'linecap'>) => (
  <Arc {...props} linecap="round" />
);

const ButtArc = (props: Omit<ArcProps, 'linecap'>) => (
  <Arc {...props} linecap="butt" />
);

const DataPoint = ({
  point,
  min,
  max,
}: {
  point: ProportionData;
  min?: number;
  max?: number;
}) => {
  const highlightColor = (moodProportion: number) => {
    switch (moodProportion) {
      case 0.5:
        return 'white';
      case min:
        return 'red';
      case max:
        return 'blue';
    }
  };

  const highlight = highlightColor(point.moodProportion);

  // Starting + stopping an arc at the same point (thanks to our rounded linecaps) just gives a blob
  // Optionally adding a slightly thicker arc gives us a highlight ring around the blob
  return (
    <>
      {highlight && (
        <RoundedArc
          color={highlight}
          startProportion={point.dateProportion}
          endProportion={point.dateProportion}
          thickness={120}
        />
      )}
      <RoundedArc
        color={rgbTriadToCss(colorForPoint(point))}
        startProportion={point.dateProportion}
        endProportion={point.dateProportion}
      />
    </>
  );
};

const proportionalThickness = (start: ProportionData, end: ProportionData) =>
  20 + Math.abs(start.moodProportion + end.moodProportion - 1) * 50;

const DataEdge = ({
  start,
  end,
}: {
  start: ProportionData;
  end: ProportionData;
}) => (
  <RoundedArc
    color={rgbTriadToCss(colorForArc(start, end))}
    startProportion={start.dateProportion}
    endProportion={end.dateProportion}
    thickness={proportionalThickness(start, end)}
  />
);

export const RadialChart = ({ data }: { data: ProportionData[] }) => {
  const filteredData = data.filter((point) => point.dateProportion >= 0);

  // Highest/lowest mood scores recorded
  const max = _.max(_.map(filteredData, 'moodProportion'));
  const min = _.min(_.map(filteredData, 'moodProportion'));

  // Blob for each entry in the data
  const blobs = filteredData.map((point: ProportionData) => (
    <DataPoint key={point.dateProportion} point={point} min={min} max={max} />
  ));

  // Generates pairs of items with index [i, i+1] so that we can make an arc between adjacent
  // entries
  const edges = _.zip(filteredData, _.tail(filteredData));

  // Curve between each blob
  const curves = edges.map(
    ([start, end]) =>
      start &&
      end && <DataEdge key={start.dateProportion} start={start} end={end} />,
  );

  return (
    <svg
      className={css({ margin: '4rem 20%', width: '60%' })}
      viewBox="-600 -600 1200 1200"
    >
      {curves}
      {blobs}
    </svg>
  );
};

export default RadialChart;
