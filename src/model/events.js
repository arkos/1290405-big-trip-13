import Subject from '../utils/subject.js';

export default class Events extends Subject {
  constructor() {
    super();
    this._events = [];
  }

  setEvents(updateType, events) {
    this._events = events.slice();
    this._notify(updateType);
  }

  getEvents() {
    return this._events;
  }

  updateEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't update a non existing event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      update,
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  addEvent(updateType, update) {
    this._events = [
      update,
      ...this._events
    ];

    this._notify(updateType, updateType);
  }

  deleteEvent(updateType, update) {
    const index = this._events.findIndex((event) => event.id === update.id);

    if (index === -1) {
      throw new Error(`Can't delete a non existing event`);
    }

    this._events = [
      ...this._events.slice(0, index),
      ...this._events.slice(index + 1)
    ];

    this._notify(updateType, update);
  }

  static adaptToClient(event) {
    const offers = [];
    event.offers.forEach((offer) => offers.push(offer.title));

    const adaptedEvent = Object.assign(
        {},
        event,
        {
          startDate: event.date_from !== null ? new Date(event.date_from) : event.date_from,
          finishDate: event.date_to !== null ? new Date(event.date_to) : event.date_to,
          destination: event.destination.name,
          price: event.base_price,
          isFavorite: event.is_favorite,
          offers
        }
    );

    delete adaptedEvent.date_from;
    delete adaptedEvent.date_to;
    delete adaptedEvent.base_price;
    delete adaptedEvent.is_favorite;

    return adaptedEvent;
  }

  static adaptToServer(event, destinationsDataMap, offersDataMap) {
    const destination = {};
    const destinationData = destinationsDataMap ? destinationsDataMap.get(destination) : null;

    destination.name = event.destination;
    destination.description = destinationData ? destinationData.description : null;
    destination.pictures = [];

    if (destinationData && destinationData.photos && destinationData.photos.length > 0) {
      destination.pictures = destinationData.photos.map((photo) => ({src: photo, description: ``}));
      // TODO: add photo src and description
    }

    let offers = [];

    if (event.offers && event.offers.length > 0 && offersDataMap) {
      offers = event.offers.forEach((offer) => {
        const offerData = offersDataMap.get(offer);
        if (offerData) {
          offers.push({title: offerData.title, price: offerData.price});
        }
      });
    }

    const adaptedEvent = Object.assign(
        {},
        event,
        {
          "date_from": event.startDate instanceof Date ? event.startDate.toISOString() : null,
          "date_to": event.finishDate instanceof Date ? event.finishDate.toISOString() : null,
          "destination": destination,
          "base_price": event.price,
          "is_favorite": event.isFavorite,
          "offers": offers
        }
    );

    delete adaptedEvent.startDate;
    delete adaptedEvent.finishDate;
    delete adaptedEvent.price;
    delete adaptedEvent.isFavorite;

    return adaptedEvent;
  }
}
