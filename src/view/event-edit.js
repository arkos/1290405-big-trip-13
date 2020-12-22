import SmartView from './smart.js';
import {humanizeDate} from '../utils/event.js';
import he from 'he';

import dayjs from 'dayjs';

const EMPTY_EVENT = {
  type: ``,
  startDate: dayjs().startOf(`day`),
  finishDate: dayjs().endOf(`day`),
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

const createEventEditTemplate = (state) => {

  const {type, startDate, finishDate, offers, destination, availableDestinations, price, image, eventTypesMenu, deleteButtonLabel} = state;

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

export default class EventEdit extends SmartView {
  constructor(typesDataMap, offersDataMap, destinationsDataMap, event = EMPTY_EVENT) {
    super();
    this._typesDataMap = typesDataMap;
    this._offersDataMap = offersDataMap;
    this._destinationsDataMap = destinationsDataMap;
    this._state = EventEdit.parseEventToState(event, this._typesDataMap, this._offersDataMap, this._destinationsDataMap);
    this._destinationOptions = this._buildDestinationOptions();

    this._clickRollupButtonHandler = this._clickRollupButtonHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offerToggleHandler = this._offerToggleHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._invalidPriceHandler = this._invalidPriceHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEventEditTemplate(this._state);
  }

  reset(event) {
    this.updateData(EventEdit.parseEventToState(event, this._typesDataMap, this._offersDataMap, this._destinationsDataMap));
  }

  restoreHandlers() {
    this._buildDestinationOptions();
    this._setInnerHandlers();
    this.setRollupButtonClickHandler(this._callback.rollupButtonClick);
    this.setFormSubmitHandler(this._callback.submit);
    this.setDeleteClickHandler(this._callback.deleteClick);
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
    const options = Array.from(destinations.options);
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
    this.getElement().querySelector(`.event--edit`).checkValidity();
  }

  _setInnerHandlers() {
    this.getElement()
    .querySelector(`.event__type-list`)
    .addEventListener(`change`, this._eventTypeChangeHandler);

    const priceElement = this.getElement().querySelector(`.event__input--price`);
    priceElement.addEventListener(`input`, this._priceInputHandler);
    priceElement.addEventListener(`invalid`, this._invalidPriceHandler);

    const offersRendered = this.getElement().querySelector(`.event__available-offers`);
    if (offersRendered) {
      offersRendered.addEventListener(`change`, this._offerToggleHandler);
    }

    this.getElement()
    .querySelector(`.event__input--destination`)
    .addEventListener(`change`, this._destinationChangeHandler);
  }

  _invalidPriceHandler() {
    this.getElement().querySelector(`.event__save-btn`).disabled = true;
  }

  _clickRollupButtonHandler(evt) {
    evt.preventDefault();
    this._callback.rollupButtonClick();
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(EventEdit.parseStateToEvent(this._state));
  }

  _deleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.deleteClick(EventEdit.parseStateToEvent(this._state));
  }

  _destinationChangeHandler(evt) {
    evt.preventDefault();

    let selectedDestination = evt.target.value;

    if (!this._destinationsDataMap.has(selectedDestination)) {
      selectedDestination = this._state.destination.title;
    }

    const {destination, availableDestinations} = EventEdit._createDestinationSelection(selectedDestination, this._destinationsDataMap);

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

  _eventTypeChangeHandler(evt) {

    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      image: this._typesDataMap.get(evt.target.value).image,
      offers: EventEdit._createOfferSelectionForType(
          evt.target.value,
          null,
          this._offersDataMap
      )
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();

    if (evt.target.reportValidity()) {
      this.getElement().querySelector(`.event__save-btn`).disabled = false;
    }

    this.updateData({
      price: parseInt(evt.target.value, 10)
    }, true);
  }

  static parseEventToState(event, typesDataMap, offersDataMap, destinationsDataMap) {
    const deleteButtonLabel = (event === EMPTY_EVENT) ? DeleteButtonLabel.ADD : DeleteButtonLabel.EDIT;

    const [defaultType] = typesDataMap.keys();
    const type = event.type ? event.type : defaultType;

    const offerSelectionMap = EventEdit._createOfferSelectionForType(type, event.offers, offersDataMap);

    const eventTypesMenu = new Map();
    typesDataMap.forEach((value, key) => eventTypesMenu.set(key, value.title));

    const eventTypeData = typesDataMap.get(type);
    const {image} = eventTypeData;

    const {destination, availableDestinations} = EventEdit._createDestinationSelection(event.destination, destinationsDataMap);

    return Object.assign(
        {},
        event,
        {
          type,
          offers: offerSelectionMap,
          image,
          eventTypesMenu,
          destination,
          availableDestinations,
          deleteButtonLabel
        }
    );
  }

  static parseStateToEvent(state) {
    const event = Object.assign({}, state);

    const offers = [];

    state.offers.forEach((value, key) => {
      if (value.selected) {
        offers.push(key);
      }
    });

    event.offers = offers;
    event.destination = state.destination.title;

    delete event.src;
    delete event.eventTypesMenu;
    delete event.availableDestinations;
    delete event.deleteButtonLabel;

    return event;
  }

  static _createDestinationSelection(currentDestination, destinationsDataMap) {
    const availableDestinations = [];
    let destination = {title: ``, description: ``, photos: []};

    destinationsDataMap.forEach((value, key) => {
      if (currentDestination === key) {
        destination = {title: key, description: value.description, photos: value.photos.slice()};
      } else {
        availableDestinations.push(key);
      }
    });

    return {destination, availableDestinations};
  }

  static _createOfferSelectionForType(type, selectedOffers, offersDataMap) {
    const offerSelectionMap = new Map();

    offersDataMap.forEach((value, key) => {
      if (value.eventTypeKey === type) {
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
