import Subject from '../utils/subject.js';

export default class Points extends Subject {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
    return this._points;
  }

  updatePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update a non existing point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      update,
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addPoint(updateType, update) {
    this._points = [
      update,
      ...this._points
    ];

    this._notify(updateType, updateType);
  }

  deletePoint(updateType, update) {
    const index = this._points.findIndex((point) => point.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete a non existing point`);
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(point) {
    const destination = Object.assign({}, point.destination, {photos: point.destination.pictures});
    delete destination.pictures;

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          dateFrom: point.date_from !== null ? new Date(point.date_from) : point.date_from,
          dateTo: point.date_to !== null ? new Date(point.date_to) : point.date_to,
          destination,
          price: point.base_price,
          isFavorite: point.is_favorite
        }
    );

    delete adaptedPoint.date_from;
    delete adaptedPoint.date_to;
    delete adaptedPoint.base_price;
    delete adaptedPoint.is_favorite;

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const destination = Object.assign({}, point, {pictures: point.destination.photos});
    delete destination.photos;

    const adaptedPoint = Object.assign(
        {},
        point,
        {
          "date_from": point.dateFrom instanceof Date ? point.dateFrom.toISOString() : null,
          "date_to": point.dateTo instanceof Date ? point.dateTo.toISOString() : null,
          "destination": destination,
          "base_price": point.price,
          "is_favorite": point.isFavorite,
          "offers": point.offers
        }
    );

    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.price;
    delete adaptedPoint.isFavorite;

    return adaptedPoint;
  }
}
