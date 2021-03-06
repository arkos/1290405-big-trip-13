import Subject from '../utils/subject.js';

export default class Offers extends Subject {
  constructor() {
    super();
    this._offers = new Map();
  }

  setOffers(offers) {
    this._offers = new Map(offers);
  }

  getOffers() {
    return this._offers;
  }

  static adaptToClient(offers) {
    const adaptedOffers = new Map();

    offers.forEach((offer) => adaptedOffers.set(offer.type, [...offer.offers]));

    return adaptedOffers;
  }
}
