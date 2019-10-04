import { css } from 'emotion';
import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import allData from './data.json';
import RadialChart from './drawing/RadialChart';
import SineChart from './drawing/SineChart';
import { sumOfSquares } from './sharedMaths';

const cycleLengthGuesser = new Worker('./computeCycleLength.ts');

function guessCycleLength(startingGuess: number) {
  cycleLengthGuesser.postMessage([
    Math.floor(startingGuess * 0.5),
    Math.floor(startingGuess * 1.5),
  ]);
}

export const App = () => {
  const [cycleDays, setCycleLength] = React.useState(30);
  const [offset, setOffset] = React.useState(0);
  const [amplitude, setAmplitude] = React.useState(100);
  const [loadingGuess, setLoadingGuess] = React.useState(false);

  React.useEffect(() => {
    const receiveGuess = (e: MessageEvent) => {
      const [cycleGuess, offsetGuess] = e.data;
      setCycleLength(cycleGuess);
      setOffset(offsetGuess);
      setLoadingGuess(false);
    };

    cycleLengthGuesser.addEventListener('message', receiveGuess);

    return () => {
      cycleLengthGuesser.removeEventListener('message', receiveGuess);
    };
  });

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
      <RadialChart data={proportionalData} offset={offset / cycleDays} />
      <div className={css({ display: 'flex' })}>
        <div className={css({ padding: '0 0.5rem' })}>
          <button
            className={css({
              width: '6rem',
              height: '100%',
              fontSize: 36,
              background: '#eeeeee08',
              border: '1px solid #eeeeee08',
              transition: 'opacity 1s, background 0.25s, border 0.25s',
              ':hover': {
                background: '#eeeeee10',
                border: '1px solid #eeeeee',
              },
              ':disabled': {
                opacity: 0.1,
              },
            })}
            disabled={loadingGuess}
            onClick={() => {
              setLoadingGuess(true);
              guessCycleLength(cycleDays);
            }}
          >
            {loadingGuess ? '⏳' : '🔍'}
          </button>
        </div>
        <div>
          Cycle length: {cycleDays} days
          <input
            className={css({ width: '100%' })}
            type="range"
            min={1}
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
          Average mania (depression) peak: {(5 + amplitude / 20).toFixed(2)} (
          {(5 - amplitude / 20).toFixed(2)}
          )
          <input
            className={css({ width: '100%' })}
            type="range"
            min={0}
            max={100}
            value={amplitude}
            onChange={(e) => setAmplitude(e.target.valueAsNumber)}
          />
          Error: {sumOfSquares(allData)([cycleDays, offset])}
        </div>
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
