import SmartView from './smart.js';
import {humanizeDate} from '../utils/point.js';
import {pointTypes} from '../utils/const.js';
import he from 'he';
import {nanoid} from 'nanoid';
import dayjs from 'dayjs';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const EMPTY_POINT = {
  type: pointTypes.keys().next().value,
  dateFrom: dayjs().startOf(`day`).toDate(),
  dateTo: dayjs().endOf(`day`).toDate(),
  destination: ``,
  price: 0,
  isFavorite: false,
  offers: []
};

const DeleteButtonLabel = {
  ADD: `Cancel`,
  EDIT: `Delete`
};

const createOffersTemplate = (offers) => {
  return offers && (offers.size > 0) ? `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${Array.from(offers).map(([key, value]) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${key}-1" type="checkbox" data-offer-key="${key}" name="event-offer-${key}" ${value.selected ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${key}-1">
          <span class="event__offer-title">${value.title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${value.price}</span>
        </label>
      </div>`).join(``)}
    </div>
  </section>` : ``;
};

const createDestinationInfoTemplate = (destination) => {
  return destination ? `<section class="event__section  event__section--destination">
  <h3 class="event__section-title  event__section-title--destination">Destination</h3>
  <p class="event__destination-description">${destination.description ? destination.description : ``}</p>

  ${destination.photos && (destination.photos.length > 0) ? `<div class="event__photos-container">
    <div class="event__photos-tape">
    ${destination.photos.map((photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`).join(``)}
    </div>
  </div>` : ``}
</section>` : ``;
};

const createAvailableDestinationsTemplate = (availableDestinations) => {
  return availableDestinations.length > 0 ? `<datalist id="destination-list-1">
    ${availableDestinations.map((destination) => `
    <option value="${destination}"></option>
    `).join(``)}
  </datalist>` : ``;
};

const createTypesMenuTemplate = (types) => {
  return `<div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>

      ${Array.from(types).map(([key, value]) => `<div class="event__type-item">
      <input id="event-type-${key}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${key}">
      <label class="event__type-label  event__type-label--${key}" for="event-type-${key}-1">${value.title}</label>
    </div>`).join(``)}

    </fieldset>
  </div>`;
};

const createPointEditTemplate = (state) => {

  const {type, dateFrom, dateTo, offers, destination, availableDestinations, price, deleteButtonLabel} = state;

  const typesMenuTemplate = createTypesMenuTemplate(pointTypes);

  const offersTemplate = createOffersTemplate(offers);

  const destinationInfoTemplate = createDestinationInfoTemplate(destination);

  const availableDestinationsTemplate = createAvailableDestinationsTemplate(availableDestinations);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${pointTypes.get(type).src}" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${typesMenuTemplate}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? he.encode(destination.name) : ``}" list="destination-list-1" autocomplete="off">
            ${availableDestinationsTemplate}
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, `DD/MM/YY HH:mm`)}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, `DD/MM/YY HH:mm`)}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${price}" pattern="\\d+" required autocomplete="off">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${deleteButtonLabel}</button>
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

export default class PointEdit extends SmartView {
  constructor(offers, destinations, point = EMPTY_POINT) {
    super();
    this._offers = offers;
    this._destinations = destinations;
    this._state = PointEdit.parsePointToState(point, this._offers, this._destinations);
    this._destinationOptions = this._buildDestinationOptions();
    this._dateFromPicker = null;
    this._dateToPicker = null;

    this._clickRollupButtonHandler = this._clickRollupButtonHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._pointTypeChangeHandler = this._pointTypeChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offerToggleHandler = this._offerToggleHandler.bind(this);
    this._destinationInputHandler = this._destinationInputHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._dateFromCloseHandler = this._dateFromCloseHandler.bind(this);
    this._dateToCloseHandler = this._dateToCloseHandler.bind(this);

    this._setInnerHandlers();
    this._validateAll();
    this._setDateFromPicker();
    this._setDateToPicker();
  }

  getTemplate() {
    return createPointEditTemplate(this._state);
  }

  _setDateFromPicker() {
    if (this._dateFromPicker) {
      this._dateFromPicker.destroy();
      this._dateFromPicker = null;
    }

    this._dateFromPicker = flatpickr(
        this.getElement().querySelector(`input[name='event-start-time']`),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._state.dateFrom,
          maxDate: dayjs(this._state.dateTo).second(0).subtract(1, `m`).toDate(),
          onClose: this._dateFromCloseHandler,
        }
    );
  }

  _setDateToPicker() {
    if (this._dateToPicker) {
      this._dateToPicker.destroy();
      this._dateToPicker = null;
    }

    this._dateToPicker = flatpickr(
        this.getElement().querySelector(`input[name='event-end-time']`),
        {
          enableTime: true,
          // eslint-disable-next-line camelcase
          time_24hr: true,
          dateFormat: `d/m/y H:i`,
          defaultDate: this._state.dateTo,
          minDate: dayjs(this._state.dateFrom).second(0).add(1, `m`).toDate(),
          onClose: this._dateToCloseHandler,
        }
    );
  }

  _dateFromCloseHandler([userDate]) {
    this.updateData(
        {
          dateFrom: dayjs(userDate).second(0).toDate(),
        },
        true
    );
    this._setDateToPicker();
  }

  _dateToCloseHandler([userDate]) {
    this.updateData(
        {
          dateTo: dayjs(userDate).second(0).toDate(),
        },
        true
    );
    this._setDateFromPicker();
  }

  reset(point) {
    this.updateData(PointEdit.parsePointToState(point, this._offers, this._destinations));
  }

  restoreHandlers() {
    this._destinationOptions = this._buildDestinationOptions();
    this._setInnerHandlers();
    this.setRollupButtonClickHandler(this._callback.rollupButtonClick);
    this.setFormSubmitHandler(this._callback.submit);
    this.setDeleteClickHandler(this._callback.deleteClick);
    this._setDateFromPicker();
    this._setDateToPicker();
    this._validateAll();
  }

  setRollupButtonClickHandler(callback) {
    this._callback.rollupButtonClick = callback;

    this.getElement()
      .querySelector(`.event__rollup-btn`)
      .addEventListener(`click`, this._clickRollupButtonHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.submit = callback;

    this.getElement()
      .querySelector(`form`)
      .addEventListener(`submit`, this._submitHandler);
  }

  setDeleteClickHandler(callback) {
    this._callback.deleteClick = callback;

    this.getElement()
      .querySelector(`.event__reset-btn`)
      .addEventListener(`click`, this._deleteClickHandler);
  }

  _buildDestinationOptions() {
    const destinations = this.getElement().querySelector(`#destination-list-1`);
    const options = Array.from(destinations.options).map((option) => option.value);
    return new Set(options);
  }

  _validateDestination() {
    const destinationElement = this.getElement().querySelector(`.event__input--destination`);
    if (!this._destinationOptions.has(destinationElement.value)) {
      destinationElement.setCustomValidity(`You have to select a destination from the provided destinations list`);
      return false;
    }

    destinationElement.setCustomValidity(``);
    return true;
  }

  _validateAll() {
    this._validateDestination();
    const isValid = this.getElement().querySelector(`.event--edit`).checkValidity();

    const saveButton = this.getElement().querySelector(`.event__save-btn`);

    saveButton.disabled = !isValid;

    return isValid;
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-list`)
      .addEventListener(`change`, this._pointTypeChangeHandler);

    const priceElement = this.getElement().querySelector(`.event__input--price`);
    priceElement.addEventListener(`input`, this._priceInputHandler);

    const offersRendered = this.getElement().querySelector(`.event__available-offers`);
    if (offersRendered) {
      offersRendered.addEventListener(`change`, this._offerToggleHandler);
    }

    const destinationElement = this.getElement().querySelector(`.event__input--destination`);
    destinationElement.addEventListener(`input`, this._destinationInputHandler);
  }

  _clickRollupButtonHandler(evt) {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(PointEdit.parseStateToPoint(this._state));
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(PointEdit.parseStateToPoint(this._state));
  }

  _destinationInputHandler(evt) {
    evt.preventDefault();

    this._validateAll();

    let destination = this._destinations.get(evt.target.value);

    if (!destination || evt.target.value === this._state.destination.name) {
      return;
    }

    this.updateData(
        {destination: Object.assign({}, destination, {name: evt.target.value})}
    );
  }

  _offerToggleHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();

    const offers = new Map(this._state.offers);

    const offer = offers.get(evt.target.dataset.offerKey);
    offer.selected = !offer.selected;

    this.updateData({
      offers
    });
  }

  _pointTypeChangeHandler(evt) {

    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      offers: PointEdit._createOfferSelectionForType(
          [],
          this._offers.get(evt.target.value)
      )
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    this._validateAll();

    this.updateData({
      price: parseInt(evt.target.value, 10)
    }, true);
  }

  static parsePointToState(point, offers, destinations) {
    const deleteButtonLabel = (point === EMPTY_POINT) ? DeleteButtonLabel.ADD : DeleteButtonLabel.EDIT;

    const offersForType = offers.get(point.type);

    const offerSelectionMap = PointEdit._createOfferSelectionForType(point.offers, offersForType);

    const availableDestinations = [...destinations.keys()];

    return Object.assign(
        {},
        point,
        {
          offers: offerSelectionMap,
          availableDestinations,
          deleteButtonLabel
        }
    );
  }

  static parseStateToPoint(state) {
    const point = Object.assign({}, state);

    const offers = [];

    state.offers.forEach((value) => {
      if (value.selected) {
        const {title, price} = value;
        offers.push({title, price});
      }
    });

    point.offers = offers;

    delete point.availableDestinations;
    delete point.deleteButtonLabel;

    return point;
  }

  static _createOfferSelectionForType(selectedOffers, allOffersForType) {
    const offerSelectionMap = new Map();

    allOffersForType.forEach((value) => {
      const findOffer = selectedOffers.find((selectedOffer) => selectedOffer.title === value.title);

      let isSelected = false;

      if (findOffer) {
        isSelected = true;
      }

      offerSelectionMap.set(nanoid(), Object.assign({}, value, {selected: isSelected}));
    });

    return offerSelectionMap;
  }
}
