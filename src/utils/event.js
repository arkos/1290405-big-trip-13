import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {getDataForAllOffers} from '../mock/event.js';

dayjs.extend(duration);

export const humanizeDate = (date, formatter = `YYYY-MM-DD`) => {
  return dayjs(date).format(formatter);
};

const getDestinationsForTrip = (tripEvents) => {

  if (!tripEvents || tripEvents.length === 0) {
    return null;
  }

  const destinations = [];
  tripEvents.forEach((evt) => destinations.push(evt.destination));
  return destinations;
};

export const getTripInfo = (tripEvents) => {

  if (!tripEvents || tripEvents.length === 0) {
    return null;
  }

  const eventsByDateAsc = tripEvents.slice().sort(sortEventDateAsc);

  return {
    startDate: eventsByDateAsc[0].startDate,
    finishDate: eventsByDateAsc[eventsByDateAsc.length - 1].finishDate,
    destinations: getDestinationsForTrip(eventsByDateAsc)
  };
};

export const getTripPrice = (tripEvents) => {
  if (!tripEvents || tripEvents.length === 0) {
    return 0;
  }

  const offersData = getDataForAllOffers();

  const totalPriceForEvents = tripEvents.reduce((total, event) => {
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
