import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {getDataForAllOffers} from '../mock/event.js';

dayjs.extend(duration);

export const humanizeDate = (date, formatter = `YYYY-MM-DD`) => {
  return dayjs(date).format(formatter);
};

const getDestinationsForTrip = (events) => {

  if (!events || events.length === 0) {
    return null;
  }

  const destinations = [];
  events.forEach((evt) => destinations.push(evt.destination));
  return destinations;
};

export const getTripInfo = (events) => {

  if (!events || events.length === 0) {
    return null;
  }

  const eventsByDateAsc = events.slice().sort(sortEventDateAsc);

  return {
    startDate: eventsByDateAsc[0].startDate,
    finishDate: eventsByDateAsc[eventsByDateAsc.length - 1].finishDate,
    destinations: getDestinationsForTrip(eventsByDateAsc)
  };
};

export const getTripPrice = (events) => {
  if (!events || events.length === 0) {
    return 0;
  }

  const offersData = getDataForAllOffers();

  const totalPriceForEvents = events.reduce((total, event) => {
    const priceForEventOffers = Array.from(event.offers).reduce((sum, offer) => sum + offersData.get(offer).price, 0);
    return event.price + priceForEventOffers + total;
  }, 0);

  return totalPriceForEvents;
};

export const sortEventDateAsc = (lhsEvent, rhsEvent) => {
  return dayjs(lhsEvent.startDate).diff(dayjs(rhsEvent.startDate));
};

export const sortEventPriceDesc = (lhsEvent, rhsEvent) => {
  return rhsEvent.price - lhsEvent.price;
};

export const sortEventDurationDesc = (lhsEvent, rhsEvent) => {
  const lhsDurationMs = dayjs.duration(dayjs(lhsEvent.finishDate).diff(dayjs(lhsEvent.startDate))).asMilliseconds();
  const rhsDurationMs = dayjs.duration(dayjs(rhsEvent.finishDate).diff(dayjs(rhsEvent.startDate))).asMilliseconds();

  return rhsDurationMs - lhsDurationMs;
};

export const isPastDate = (date) => {
  return date === null ? false : dayjs().isAfter(date);
};

export const isFutureDate = (date) => {
  return date === null ? false : dayjs().isBefore(date, `day`) || dayjs().isSame(date, `day`);
};

export const formatDuration = (startDate, finishDate) => {
  const durationBetweenDates = dayjs.duration(finishDate.diff(startDate));

  const days = durationBetweenDates.days();
  const hours = durationBetweenDates.hours();
  const minutes = durationBetweenDates.minutes();

  let template;

  if (days) {
    template = `DD[D] HH[H] mm[M]`;
  } else if (hours) {
    template = `HH[H] mm[M]`;
  } else {
    template = `mm[M]`;
  }

  const durationBeforeFormat = `0000-00-${days} ${hours}:${minutes}`;
  const formattedDuration = dayjs(durationBeforeFormat).format(template);
  return formattedDuration;
};
