import { css } from 'emotion';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import allData from './data.json';
import RadialChart from './drawing/RadialChart';
import SineChart from './drawing/SineChart';

export const App = () => {
  const [cycleDays, setCycleLength] = React.useState(30);
  const [offset, setOffset] = React.useState(0);
  const [amplitude, setAmplitude] = React.useState(100);

  // Assumes sorted data, as does everything below
  const latestPoint = _.last(allData);

  if (!latestPoint) {
    return <>No data</>;
  }

  const latestDate = moment(latestPoint.date, moment.ISO_8601);
  const earliestDate = moment(latestDate).subtract(cycleDays, 'days');

  // What proportion through the cycle is a date (0 for first record, 1 for last, 0.25 for a
  // quarter through the cycle)
  const proportionForDate = (date: string) =>
    moment(date, moment.ISO_8601).diff(earliestDate) /
    (cycleDays * 24 * 60 * 60 * 1000);

  // Data scaled so that:
  // - dateProportion ranges from 0 to 1 for earliest/latest date
  // - moodProportion ranges from 0 to 1 for very depressed/manic
  const proportionalData = allData.map((point) => ({
    dateProportion: proportionForDate(point.date),
    moodProportion: point.mood / 10,
  }));

  return (
    <div className={css({ width: '100%', maxWidth: '98vh', margin: '0 auto' })}>
      <RadialChart data={proportionalData} />
      <div>
        Cycle length: {cycleDays} days
        <input
          className={css({ width: '100%' })}
          type="range"
          min={0}
          max={365}
          value={cycleDays}
          onChange={(e) => setCycleLength(e.target.valueAsNumber)}
        />
        Offset: {offset} days
        <input
          className={css({ width: '100%' })}
          type="range"
          min={0}
          max={cycleDays}
          value={offset}
          onChange={(e) => setOffset(e.target.valueAsNumber)}
        />
        Peak mood: {amplitude / 10}
        <input
          className={css({ width: '100%' })}
          type="range"
          min={0}
          max={100}
          value={amplitude}
          onChange={(e) => setAmplitude(e.target.valueAsNumber)}
        />
      </div>
      <SineChart
        data={proportionalData}
        offset={offset / cycleDays}
        amplitude={amplitude}
      />
    </div>
  );
};

export default App;
