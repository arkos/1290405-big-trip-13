import PointsModel from '../model/points.js';
import {isOnline} from '../utils/common.js';

const getSyncedPoints = (items) => {
  return items.filter(({success}) => success)
  .map(({payload}) => payload.point);
};

const createStoreStructure = (items) => {
  if (items instanceof Map) {
    return Object.fromEntries(items.entries());
  }
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, storePoints, storeOffers, storeDestinations) {
    this._api = api;
    this._storePoints = storePoints;
    this._storeOffers = storeOffers;
    this._storeDestinations = storeDestinations;
  }

  getOffers() {
    if (isOnline()) {
      return this._api.getOffers()
      .then((offers) => {
        const items = createStoreStructure(offers);
        this._storeOffers.setItems(items);
        return offers;
      });
    }

    const storeOffers = this._storeOffers.getItems();

    return Promise.resolve(new Map(Object.entries(storeOffers)));
  }

  getDestinations() {
    if (isOnline()) {
      return this._api.getDestinations()
      .then((destinations) => {
        const items = createStoreStructure(destinations);
        this._storeDestinations.setItems(items);
        return destinations;
      });
    }

    const storeDestinations = this._storeDestinations.getItems();

    return Promise.resolve(new Map(Object.entries(storeDestinations)));
  }

  getPoints() {
    if (isOnline()) {
      return this._api.getPoints()
      .then((points) => {
        const items = createStoreStructure(points.map(PointsModel.adaptToServer));
        this._storePoints.setItems(items);
        return points;
      });
    }

    const storePoints = Object.values(this._storePoints.getItems());

    return Promise.resolve(storePoints.map(PointsModel.adaptToClient));
  }

  updatePoint(point) {
    if (isOnline()) {
      return this._api.updatePoint(point)
      .then((updatedPoint) => {
        this._storePoints.setItem(updatedPoint.id, PointsModel.adaptToServer(Object.assign({}, point)));
        return updatedPoint;
      });
    }

    this._storePoints.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if (isOnline()) {
      return this._api.addPoint(point)
      .then((newPoint) => {
        this._storePoints.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
        return newPoint;
      });
    }

    return Promise.reject(new Error(`Adding new point failed`));
  }

  deletePoint(point) {
    if (isOnline()) {
      return this._api.deletePoint(point)
      .then(() => this._storePoints.removeItem(point.id));
    }

    return Promise.reject(new Error(`Deleting task failed`));
  }

  sync() {
    if (isOnline()) {
      const storePoints = Object.values(this._storePoints.getItems());

      return this._api.sync(storePoints)
      .then((response) => {
        const createdPoints = getSyncedPoints(response.created);
        const updatedPoints = getSyncedPoints(response.updated);

        const items = createStoreStructure([...createdPoints, ...updatedPoints]);

        this._storePoints.setItems(items);
      });
    }

    return Promise.reject(new Error(`Sync data failed`));
  }
}

