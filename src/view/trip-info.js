import {humanizeDate, createElement} from '../util.js';

const createTripInfoTemplate = ({startDate, finishDate, destinations}) => {
  if (destinations.length > 3) {
    destinations.splice(1, destinations.length - 2, `...`);
  }

  const tripInfoTitle = destinations.join(` &mdash; `);

  return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfoTitle}</h1>

        <p class="trip-info__dates">${humanizeDate(startDate, `MMM DD`)}&nbsp;&mdash;&nbsp;${humanizeDate(finishDate, `DD`)}</p>
      </div>
    </section>`;
};

export default class TripInfo {
  constructor(tripInfo) {
    this._tripInfo = tripInfo;
    this._element = null;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripInfo);
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
