import _ from 'lodash';
import moment from 'moment';

export const sumOfSquares = (data: DayData[]) => ([cycleLength, offset]: [
  number,
  number,
]) =>
  _.sumBy(data, ({ date, mood }) =>
    Math.pow(
      mood -
        5 -
        5 *
          Math.cos(
            -(2 * Math.PI * (offset - moment().diff(date, 'days'))) /
              cycleLength,
          ),
      2,
    ),
  );
