import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {humanizeDate} from '../util.js';
import AbstractView from '../view/abstract.js';

dayjs.extend(duration);

const createTripEventOfferTemplate = ({title, price}) => {
  return `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`;
};

const createTripEventOffersTemplate = (offers) => {
  return offers.length > 0 ? `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${offers.map((offer) => createTripEventOfferTemplate(offer)).join(``)}
  </ul>` : ``;
};

const createTripEventTemplate = (tripEvent) => {

  const {type, destination, startDate, finishDate, price, offers, isFavorite} = tripEvent;

  const offersTemplate = createTripEventOffersTemplate(offers);

  const durationBetweenDates = dayjs.duration(finishDate.diff(startDate));

  const days = durationBetweenDates.days();
  const hours = durationBetweenDates.hours();
  const minutes = durationBetweenDates.minutes();

  let formatter;

  if (days) {
    formatter = `DD[D] HH[H] mm[M]`;
  } else if (hours) {
    formatter = `HH[H] mm[M]`;
  } else {
    formatter = `mm[M]`;
  }

  const durationBeforeFormat = `0000-00-${days} ${hours}:${minutes}`;
  const formattedDuration = dayjs(durationBeforeFormat).format(formatter);

  const favoriteClassName = isFavorite ? `event__favorite-btn event__favorite-btn--active` : `event__favorite-btn`;

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${humanizeDate(startDate, `YYYY-MM-DD`)}">${humanizeDate(startDate, `MMM D`).toUpperCase()}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${humanizeDate(startDate, `YYYY-MM-DDTHH:mm`)}">${humanizeDate(startDate, `HH:mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="${humanizeDate(finishDate, `YYYY-MM-DDTHH:mm`)}">${humanizeDate(finishDate, `HH:mm`)}</time>
        </p>
        <p class="event__duration">${formattedDuration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      ${offersTemplate}

      <button class="${favoriteClassName}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};

export default class TripEvent extends AbstractView {
  constructor(event) {
    super();
    this._event = event;

    this._clickHandler = this._clickHandler.bind(this);
  }

  getTemplate() {
    return createTripEventTemplate(this._event);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  setClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._clickHandler);
  }
}
