import {createElement} from '../util.js';

const createTripPriceTemplate = (totalPrice) => {
  return `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>`;
};

export default class TripPrice {
  constructor(price) {
    this._price = price;
    this._element = null;
  }

  getTemplate() {
    return createTripPriceTemplate(this._price);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

