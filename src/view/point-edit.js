import SmartView from './smart.js';
import {humanizeDate} from '../utils/point.js';
import he from 'he';

import dayjs from 'dayjs';
import flatpickr from 'flatpickr';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const EMPTY_POINT = {
  type: ``,
  dateFrom: dayjs().startOf(`day`).toDate(),
  dateTo: dayjs().endOf(`day`).toDate(),
  destination: ``,
  price: 0,
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

const createDestinationInfoTemplate = ({description, photos}) => {
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

const createAvailableDestinationsTemplate = (availableDestinations) => {
  return `<datalist id="destination-list-1">
    ${availableDestinations.map((destination) => `
    <option value="${destination}"></option>
    `).join(``)}
  </datalist>`;
};

const createTypesMenuTemplate = (eventTypesMenu) => {
  return `<div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>

      ${Array.from(eventTypesMenu).map(([key, title]) => `<div class="event__type-item">
      <input id="event-type-${key}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${key}">
      <label class="event__type-label  event__type-label--${key}" for="event-type-${key}-1">${title}</label>
    </div>`).join(``)}

    </fieldset>
  </div>`;
};

const createPointEditTemplate = (state) => {

  const {type, dateFrom, dateTo, offers, destination, availableDestinations, price, image, eventTypesMenu, deleteButtonLabel} = state;

  const typesMenuTemplate = createTypesMenuTemplate(eventTypesMenu);

  const offersTemplate = createOffersTemplate(offers);

  const destinationInfoTemplate = createDestinationInfoTemplate(destination);

  const availableDestinationsTemplate = createAvailableDestinationsTemplate(availableDestinations);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${image}" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">
          ${typesMenuTemplate}
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${type}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination ? he.encode(destination.title) : ``}" list="destination-list-1" autocomplete="off">
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
  constructor(typesDataMap, offersDataMap, destinationsDataMap, point = EMPTY_POINT) {
    super();
    this._typesDataMap = typesDataMap;
    this._offersDataMap = offersDataMap;
    this._destinationsDataMap = destinationsDataMap;
    this._state = PointEdit.parsePointToState(point, this._typesDataMap, this._offersDataMap, this._destinationsDataMap);
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
    this.updateData(PointEdit.parsePointToState(point, this._typesDataMap, this._offersDataMap, this._destinationsDataMap));
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

    let selectedDestination = evt.target.value;

    if (!this._destinationsDataMap.has(selectedDestination)) {
      selectedDestination = this._state.destination.title;
    }

    const {destination, availableDestinations} = PointEdit._createDestinationSelection(selectedDestination, this._destinationsDataMap);

    if (!destination || destination.title === this._state.destination.title) {
      return;
    }

    this.updateData({
      destination,
      availableDestinations
    });
  }

  _offerToggleHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();

    const offers = new Map(this._state.offers);
    offers.forEach((value, key) => {
      if (key === evt.target.dataset.offerKey) {
        value.selected = !value.selected;
      }
    });

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
      image: this._typesDataMap.get(evt.target.value).image,
      offers: PointEdit._createOfferSelectionForType(
          evt.target.value,
          null,
          this._offersDataMap
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

  static parsePointToState(point, typesDataMap, offersDataMap, destinationsDataMap) {
    const deleteButtonLabel = (point === EMPTY_POINT) ? DeleteButtonLabel.ADD : DeleteButtonLabel.EDIT;

    const [defaultType] = typesDataMap.keys();
    const type = point.type ? point.type : defaultType;

    const offerSelectionMap = PointEdit._createOfferSelectionForType(type, point.offers, offersDataMap);

    const pointTypesMenu = new Map();
    typesDataMap.forEach((value, key) => pointTypesMenu.set(key, value.title));

    const pointTypeData = typesDataMap.get(type);
    const {image} = pointTypeData;

    const {destination, availableDestinations} = PointEdit._createDestinationSelection(point.destination, destinationsDataMap);

    return Object.assign(
        {},
        point,
        {
          type,
          offers: offerSelectionMap,
          image,
          pointTypesMenu,
          destination,
          availableDestinations,
          deleteButtonLabel
        }
    );
  }

  static parseStateToPoint(state) {
    const point = Object.assign({}, state);

    const offers = [];

    state.offers.forEach((value, key) => {
      if (value.selected) {
        offers.push(key);
      }
    });

    point.offers = offers;
    point.destination = state.destination.title;

    delete point.src;
    delete point.pointTypesMenu;
    delete point.availableDestinations;
    delete point.deleteButtonLabel;

    return point;
  }

  static _createDestinationSelection(currentDestination, destinationsDataMap) {
    const availableDestinations = [];
    let destination = {title: ``, description: ``, photos: []};

    destinationsDataMap.forEach((value, key) => {
      if (currentDestination === key) {
        destination = {title: key, description: value.description, photos: value.photos.slice()};
      }

      availableDestinations.push(key);
    });

    return {destination, availableDestinations};
  }

  static _createOfferSelectionForType(type, selectedOffers, offersDataMap) {
    const offerSelectionMap = new Map();

    offersDataMap.forEach((value, key) => {
      if (value.pointTypeKey === type) {
        offerSelectionMap.set(key, {
          title: value.title,
          price: value.price,
          selected: selectedOffers ? (selectedOffers.indexOf(key) !== -1) : false
        });
      }
    });

    return offerSelectionMap;
  }
}
