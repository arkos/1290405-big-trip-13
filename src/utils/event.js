import dayjs from 'dayjs';

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

  return {
    startDate: tripEvents[0].startDate,
    finishDate: tripEvents[tripEvents.length - 1].finishDate,
    destinations: getDestinationsForTrip(tripEvents)
  };
};
