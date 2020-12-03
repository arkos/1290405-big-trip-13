import {humanizeDate} from '../utils/event.js';
import AbstractView from '../view/abstract.js';

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

export default class TripInfo extends AbstractView {
  constructor(tripInfo) {
    super();
    this._tripInfo = tripInfo;
  }

  getTemplate() {
    return createTripInfoTemplate(this._tripInfo);
  }
}
