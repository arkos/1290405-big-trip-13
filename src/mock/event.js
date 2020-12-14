import dayjs from 'dayjs';
import {nanoid} from 'nanoid';
import {getRandomInteger, getRandomItems} from '../utils/common.js';

const eventTypesMap = new Map(
    [
      [
        `taxi`,
        {
          title: `Taxi`,
          image: `img/icons/taxi.png`,
          offers: new Set([`uber`])
        }
      ],
      [
        `bus`,
        {
          title: `Bus`,
          image: `img/icons/bus.png`,
          offers: new Set()
        }
      ],
      [
        `train`,
        {
          title: `Train`,
          image: `img/icons/train.png`,
          offers: new Set()
        }
      ],
      [
        `ship`,
        {
          title: `Ship`,
          image: `img/icons/ship.png`,
          offers: new Set()
        }
      ],
      [
        `transport`,
        {
          title: `Transport`,
          image: `img/icons/transport.png`,
          offers: new Set()
        }
      ],
      [
        `drive`,
        {
          title: `Drive`,
          image: `img/icons/drive.png`,
          offers: new Set([`car`])
        }
      ],
      [
        `flight`,
        {
          title: `Flight`,
          image: `img/icons/flight.png`,
          offers: new Set([`luggage`, `comfort`])
        }
      ],
      [
        `check-in`,
        {
          title: `Check-In`,
          image: `img/icons/check-in.png`,
          offers: new Set([`breakfast`])
        }
      ],
      [
        `sightseeing`,
        {
          title: `Sightseeing`,
          image: `img/icons/sightseeing.png`,
          offers: new Set([`tickets`, `lunch`])
        }
      ],
      [
        `restaurant`,
        {
          title: `Restaurant`,
          image: `img/icons/restaurant.png`,
          offers: new Set()
        }
      ],
    ]
);

const offersMap = new Map(
    [
      [`uber`, {title: `Order Uber`, price: 20}],
      [`car`, {title: `Rent a car`, price: 200}],
      [`luggage`, {title: `Add luggage`, price: 50}],
      [`comfort`, {title: `Switch to comfort`, price: 80}],
      [`breakfast`, {title: `Add breakfast`, price: 50}],
      [`tickets`, {title: `Book tickets`, price: 40}],
      [`lunch`, {title: `Lunch in city`, price: 30}]
    ]
);

const generateType = () => {
  const types = Array.from(eventTypesMap.keys());

  const randomIndex = getRandomInteger(0, types.length - 1);
  return types[randomIndex];
};

const generateDestination = () => {
  const destinations = [
    `Amsterdam`,
    `Chamonix`,
    `Geneva`
  ];

  const randomIndex = getRandomInteger(0, destinations.length - 1);
  return destinations[randomIndex];
};

const generateOffers = (type) => {
  const eventTypeData = getDataForEventType(type);
  const offers = Array.from(eventTypeData.offers);

  if (offers.length > 0) {
    const randomSize = getRandomInteger(1, offers.length);
    offers.length = randomSize;
  }

  return new Set(offers);
};

const generatePhotos = () => {
  const randomSize = getRandomInteger(1, 3);
  const photos = new Array(randomSize).fill().map(() => `http://picsum.photos/248/152?r=${Math.random()}`);
  return photos;
};

const generateDate = (offsetFromNow = 0, offsetUnit = `h`) => {
  return dayjs().add(offsetFromNow, offsetUnit);
};

const generateDescription = () => {
  const sampleDescription = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
  const descriptions = Array.from(sampleDescription.matchAll(/([^.]*)\.\s*/g), (m) => m[1]);

  const randomDescriptions = getRandomItems(descriptions);
  return `${randomDescriptions.join(`. `)}.`;
};

const generatePrice = () => {
  const upper = 1000;
  const lower = 100;
  const price = getRandomInteger(lower, upper);
  return price;
};

const generateDestinationInfo = () => {
  return {
    description: generateDescription(),
    photos: generatePhotos()
  };
};

export const getDataForEventType = (type) => {
  if (!eventTypesMap.has(type)) {
    return null;
  }

  return eventTypesMap.get(type);
};

export const getDataForAllEventTypes = () => {
  return eventTypesMap;
};

export const getDataForAllOffers = () => {
  return offersMap;
};

export const generateEvent = () => {
  const type = generateType();

  const maxDaysOffset = 3;
  const randomOffsetDays = getRandomInteger(-maxDaysOffset, maxDaysOffset);

  const maxHoursOffset = 23;
  const randomOffsetHours = getRandomInteger(0, maxHoursOffset);

  const maxMinutesOffset = 59;
  const randomOffsetMinutes = getRandomInteger(0, maxMinutesOffset);

  const generatedDate = generateDate();

  const startDate = dayjs(generatedDate)
    .add(randomOffsetDays, `d`)
    .add(randomOffsetHours, `h`)
    .add(randomOffsetMinutes, `m`);

  const finishDate = dayjs(startDate).add(Math.abs(randomOffsetDays), `d`).add(Math.abs(randomOffsetHours), `h`).add(Math.abs(randomOffsetMinutes), `m`);

  return {
    id: nanoid(),
    type,
    startDate,
    finishDate,
    destination: generateDestination(),
    price: generatePrice(),
    offers: generateOffers(type),
    destinationInfo: generateDestinationInfo(),
    isFavorite: Boolean(getRandomInteger(0, 1))
  };
};
