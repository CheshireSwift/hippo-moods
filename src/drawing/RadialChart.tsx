import { css } from 'emotion';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Arc, ArcProps } from './Arc';
import { blendColors, rgbTriadToCss } from './colors';

type ProportionData = {
  dateProportion: number;
  moodProportion: number;
};

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

export const RadialChart = ({ data }: { data: MoodData }) => {
  // Assumes sorted data, as does everything below
  const earliestPoint = _.first(data);
  const latestPoint = _.last(data);

  if (!earliestPoint || !latestPoint) {
    return <>No data</>;
  }

  const earliestDate = moment(earliestPoint.date, moment.ISO_8601);
  const latestDate = moment(latestPoint.date, moment.ISO_8601);

  // Total number of millis between first and last entry in cycle
  const periodLength = latestDate.diff(earliestDate);

  // What proportion through the cycle is a date (0 for first record, 1 for last, 0.25 for a
  // quarter through the cycle)
  const proportionForDate = (date: string) =>
    moment(date, moment.ISO_8601).diff(earliestDate) / periodLength;

  // Data scaled so that:
  // - dateProportion ranges from 0 to 1 for earliest/latest date
  // - moodProportion ranges from 0 to 1 for very depressed/manic
  const proportionalData = data.map((point) => ({
    dateProportion: proportionForDate(point.date),
    moodProportion: point.mood / 10,
  }));

  // Highest/lowest mood scores recorded
  const max = _.max(_.map(proportionalData, 'moodProportion'));
  const min = _.min(_.map(proportionalData, 'moodProportion'));

  // Blob for each entry in the data
  const blobs = proportionalData.map((point: ProportionData) => (
    <DataPoint key={point.dateProportion} point={point} min={min} max={max} />
  ));

  // Generates pairs of items with index [i, i+1] so that we can make an arc between adjacent
  // entries
  const edges = _.zip(proportionalData, _.tail(proportionalData));

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
