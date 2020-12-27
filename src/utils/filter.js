import {FilterType} from './const.js';
import {isPastDate, isFutureDate} from './point.js';

export const filter = {
  [FilterType.EVERYTHING]: (events) => events.slice(),
  [FilterType.FUTURE]: (events) => events.filter((event) => isFutureDate(event.startDate)),
  [FilterType.PAST]: (events) => events.filter((event) => isPastDate(event.finishDate))
};
