import dayjs from 'dayjs';
import {humanizeDate} from '../utils/event.js';
import AbstractView from '../view/abstract.js';

const createOffersTemplate = (offers) => {
  return offers && (offers.length > 0) ? `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${offers.map(({key, title, price}) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${key}-1" type="checkbox" name="event-offer-${key}" checked>
        <label class="event__offer-label" for="event-offer-${key}-1">
          <span class="event__offer-title">${title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${price}</span>
        </label>
      </div>`).join(``)}
    </div>
  </section>` : ``;
};

const createDestinationInfoTemplate = ({description = null, photos = null}) => {
  return `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${description ? description : ``}</p>

  ${photos && (photos.length > 0) ? `<div class="event__photos-container">
    <div class="event__photos-tape">
    ${photos.map((photo) => `<img class="event__photo" src="${photo}" alt="Event photo">`).join(``)}
    </div>
  </div>` : ``}
</section>`;
};

const createTypesMenuTemplate = (availableTypes) => {
  return `<div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>

      ${availableTypes.map(([typeName, typeText]) => `<div class="event__type-item">
      <input id="event-type-${typeName}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeName}">
      <label class="event__type-label  event__type-label--${typeName}" for="event-type-${typeName}-1">${typeText}</label>
    </div>`)}

    </fieldset>
  </div>`;
};

const createEditEventTemplate = (tripEvent) => {

  const offsetFinishDate = 4;
  const offsetFinishDateUnit = `h`;

  const availableTypes = {
    taxi: `Taxi`,
    bus: `Bus`,
    train: `Ship`,
    transport: `Transport`,
    drive: `Drive`,
    flight: `Flight`,
    [`check-in`]: `Check-In`,
    sightseeing: `Sightseeing`,
    restaurant: `Restaurant`
  };

  const {
    type = ``,
    startDate = dayjs().startOf(`day`),
    finishDate = dayjs().startOf(`day`).add(offsetFinishDate, offsetFinishDateUnit),
    destination = ``,
    price = ``,
    offers = {},
    destinationInfo = {}
  } = tripEvent;

  const typesMenuTemplate = createTypesMenuTemplate(Object.entries(availableTypes));

  const offersTemplate = createOffersTemplate(offers);

  const destinationInfoTemplate = createDestinationInfoTemplate(destinationInfo);

  const imgSrc = type ? `img/icons/${type.toLowerCase()}.png` : `img/icons/${Object.keys(availableTypes)[0]}.png`;

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${imgSrc}" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${typesMenuTemplate}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination}" list="destination-list-1">
          <datalist id="destination-list-1">
            <option value="Amsterdam"></option>
            <option value="Geneva"></option>
            <option value="Chamonix"></option>
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(startDate, `DD/MM/YY HH:mm`)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(finishDate, `DD/MM/YY HH:mm`)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">Delete</button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
        ${offersTemplate}
        ${destinationInfoTemplate}
      </section>
    </form>
  </li>`;
};

export default class EditEvent extends AbstractView {
  constructor(event) {
    super();
    this._event = event;

    this._clickHandler = this._clickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
  }

  getTemplate() {
    return createEditEventTemplate(this._event);
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(this._event);
  }

  setClickHandler(callback) {
    this._callback.click = callback;

    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._clickHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.submit = callback;

    this.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, this._submitHandler);
  }
}
