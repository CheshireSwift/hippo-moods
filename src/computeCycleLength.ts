import _ from 'lodash';
import data from './data.json';
import { sumOfSquares } from './sharedMaths';

function computeCycleLength([lowerBound, upperBound]: [number, number]): [
  number,
  number,
] {
  const boundedStepByDividing = (quotient: number, divisor: number) =>
    Math.max(1, Math.floor(quotient / divisor));

  const cycleStepSize = boundedStepByDividing(upperBound - lowerBound, 10);
  const offsetStepSize = boundedStepByDividing(cycleStepSize, 2);

  const cycleLengths = _.range(lowerBound, upperBound, cycleStepSize);

  const lengthOffsetPairs = _.flatMap(cycleLengths, (cycleLength) =>
    _.range(0, cycleLength, offsetStepSize).map((offset): [number, number] => [
      cycleLength,
      offset,
    ]),
  );

  return _.minBy(lengthOffsetPairs, sumOfSquares(data)) || [0, 0];
}

onmessage = (e) => {
  self.postMessage(computeCycleLength(e.data));
};
