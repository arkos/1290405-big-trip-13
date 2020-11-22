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
    {type: `taxi`, title: `Order Uber`, price: 20},
    {type: `flight`, title: `Add luggage`, price: 50},
    {type: `flight`, title: `Switch to comfort`, price: 80},
    {type: `drive`, title: `Rent a car`, price: 200},
    {type: `check-in`, title: `Add breakfast`, price: 50},
    {type: `sightseeing`, title: `Book tickets`, price: 40},
    {type: `sightseeing`, title: `Lunch in city`, price: 30},
  ];

  return offers.filter((offer) => type === offer.type);
};

const generatePhotos = () => {
  const randomSize = getRandomInteger(1, 3);
  const photos = new Array(randomSize).fill(`http://picsum.photos/248/152?r=${Math.random()}`);
  return photos;
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

const generateDestinationInfo = () => {
  return {
    description: generateDescription(),
    photos: generatePhotos()
  };
};

export const generateEvent = () => {
  const type = generateType();

  return {
    type,
    destination: generateDestination(),
    offers: generateOffers(type.toLowerCase()),
    destinationInfo: generateDestinationInfo()
  };
};
