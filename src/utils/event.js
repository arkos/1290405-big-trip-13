import dayjs from 'dayjs';

export const humanizeDate = (date, formatter = `YYYY-MM-DD`) => {
  return dayjs(date).format(formatter);
};

export const getDestinationsForTrip = (tripEvents) => {

  if (!tripEvents || tripEvents.length === 0) {
    return null;
  }

  const destinations = [];
  tripEvents.forEach((evt) => destinations.push(evt.destination));
  return destinations;
};
