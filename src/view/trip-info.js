import {humanizeDate} from '../util.js';

export const createTripInfoTemplate = ({startDate, finishDate}) => {
  return `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">Amsterdam &mdash; Chamonix &mdash; Geneva</h1>

        <p class="trip-info__dates">${humanizeDate(startDate, `MMM DD`)}&nbsp;&mdash;&nbsp;${humanizeDate(finishDate, `DD`)}</p>
      </div>
    </section>`;
};
