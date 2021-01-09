export const getUniqueItems = (items) => [...new Set(items)];

export const getPointTypes = (points) => getUniqueItems(points.map((point) => point.type));

const sumPrice = (points) => points.reduce((total, point) => point.price + total, 0);

export const sumPriceByType = (points) => {
  const pointTypes = getPointTypes(points);

  return pointTypes.map((type) => sumPrice(points.filter((point) => point.type === type)));
};
