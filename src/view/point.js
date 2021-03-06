import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import {pointTypes} from '../utils/const.js';
import {humanizeDate, formatDuration} from '../utils/point.js';
import AbstractView from './abstract.js';

dayjs.extend(duration);

const createPointOfferTemplate = ({title, price}) => {
  return `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`;
};

const createPointOffersTemplate = (offers) => {
  return offers.length > 0 ? `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${offers.map((offer) => createPointOfferTemplate(offer)).join(``)}
  </ul>` : ``;
};

const createPointTemplate = (point) => {

  const {type, dateFrom, dateTo, destination, price, isFavorite, offers} = point;

  const offersTemplate = createPointOffersTemplate(offers);

  const formattedDuration = formatDuration(dateFrom, dateTo);

  const typeIcon = pointTypes.get(type).src;

  const favoriteClassName = isFavorite ? `event__favorite-btn event__favorite-btn--active` : `event__favorite-btn`;

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${humanizeDate(dateFrom, `YYYY-MM-DD`)}">${humanizeDate(dateFrom, `MMM D`)}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="${typeIcon}" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination.name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${humanizeDate(dateFrom, `YYYY-MM-DDTHH:mm`)}">${humanizeDate(dateFrom, `HH:mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="${humanizeDate(dateTo, `YYYY-MM-DDTHH:mm`)}">${humanizeDate(dateTo, `HH:mm`)}</time>
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

export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    this._clickRollupButtonHandler = this._clickRollupButtonHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
  }

  getTemplate() {
    return createPointTemplate(this._point);
  }

  setRollupButtonClickHandler(callback) {
    this._callback.click = callback;
    this.getElement().querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._clickRollupButtonHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favoriteClick = callback;
    this.getElement().querySelector(`.event__favorite-btn`)
      .addEventListener(`click`, this._favoriteClickHandler);
  }

  _clickRollupButtonHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _favoriteClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoriteClick();
  }
}
