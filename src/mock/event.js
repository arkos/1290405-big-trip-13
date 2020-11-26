import dayjs from 'dayjs';

const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const generateType = () => {
  const types = [
    `Taxi`,
    `Bus`,
    `Train`,
    `Ship`,
    `Transport`,
    `Drive`,
    `Flight`,
    `Check-in`,
    `Sightseeing`,
    `Restaurant`
  ];

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

  const offers = [
    {type: `taxi`, key: `uber`, title: `Order Uber`, price: 20},
    {type: `flight`, key: `luggage`, title: `Add luggage`, price: 50},
    {type: `flight`, key: `comfort`, title: `Switch to comfort`, price: 80},
    {type: `drive`, key: `car`, title: `Rent a car`, price: 200},
    {type: `check-in`, key: `brekfast`, title: `Add breakfast`, price: 50},
    {type: `sightseeing`, key: `tickets`, title: `Book tickets`, price: 40},
    {type: `sightseeing`, key: `lunch`, title: `Lunch in city`, price: 30},
  ];

  const filteredOffers = offers.filter((offer) => type === offer.type);

  if (filteredOffers.length > 0) {
    const randomSize = getRandomInteger(1, filteredOffers.length);
    filteredOffers.length = randomSize;
  }

  return filteredOffers;
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
  const allDescriptions = [
    `Lorem ipsum dolor sit amet, consectetur adipiscing elit.`,
    `Cras aliquet varius magna, non porta ligula feugiat eget.`,
    `Fusce tristique felis at fermentum pharetra.`,
    `Aliquam id orci ut lectus varius viverra.`,
    `Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.`,
    `Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.`,
    `Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.`,
    `Sed sed nisi sed augue convallis suscipit in sed felis.`,
    `Aliquam erat volutpat.`,
    `Nunc fermentum tortor ac porta dapibus.`,
    `In rutrum ac purus sit amet tempus.`
  ];

  const randomSize = getRandomInteger(1, allDescriptions.length);

  const clonedDescriptions = [...allDescriptions];

  const selectedDescriptions = [];

  for (let i = 0; i < randomSize; i++) {
    const randomIndex = getRandomInteger(0, clonedDescriptions.length - 1);
    selectedDescriptions.push(clonedDescriptions.splice(randomIndex, 1));
  }
  return selectedDescriptions.join(` `);
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
    type,
    startDate,
    finishDate,
    destination: generateDestination(),
    price: generatePrice(),
    offers: generateOffers(type.toLowerCase()),
    destinationInfo: generateDestinationInfo()
  };
};
