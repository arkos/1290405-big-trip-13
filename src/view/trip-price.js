import AbstractView from '../view/abstract.js';

const createTripPriceTemplate = (totalPrice) => {
  return `<p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalPrice}</span>
    </p>`;
};

export default class TripPrice extends AbstractView {
  constructor(price) {
    super();
    this._price = price;
  }

  getTemplate() {
    return createTripPriceTemplate(this._price);
  }
}

