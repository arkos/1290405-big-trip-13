import {humanizeDate} from '../utils/point.js';
import AbstractView from '../view/abstract.js';

const createTripInfoTemplate = (info, isLoading) => {
  let tripInfoTitle = ``;

  if (isLoading) {
    tripInfoTitle = `Loading trip summary...`;
  }

  if (info === null && !isLoading) {
    tripInfoTitle = `Trip doesn't contain any points`;
  }

  if (isLoading || info === null) {
    return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfoTitle}</h1>
      </div>
    </section>`;
  }

  const {dateFrom, dateTo, destinations} = info;

  if (destinations.length > 3) {
    destinations.splice(1, destinations.length - 2, `...`);
  }

  tripInfoTitle = destinations.join(` &mdash; `);

  return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${tripInfoTitle}</h1>

        <p class="trip-info__dates">${humanizeDate(dateFrom, `MMM DD`)}&nbsp;&mdash;&nbsp;${humanizeDate(dateTo, `DD`)}</p>
      </div>
  </section>`;
};

export default class TripInfo extends AbstractView {
  constructor(tripInfo, isLoading) {
    super();
    this._tripInfo = tripInfo;
    this._isLoading = isLoading;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripInfo, this._isLoading);
  }
}
