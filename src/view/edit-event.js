import dayjs from 'dayjs';
import {humanizeDate} from '../utils/event.js';
import {getDataForAllEventTypes, getDataForEventType, getDataForAllOffers} from '../mock/event.js';
import AbstractView from '../view/abstract.js';

const EMPTY_EVENT = {
  type: ``,
  startDate: dayjs().startOf(`day`),
  finishDate: dayjs().endOf(`day`),
  destination: ``,
  price: ``,
  offers: new Set(),
  destinationInfo: {}
};

const createOffersTemplate = (offers, offersData) => {
  return offers && (offers.size > 0) ? `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      ${Array.from(offers).map(({key, selected}) => `<div class="event__offer-selector">
        <input class="event__offer-checkbox  visually-hidden" id="event-offer-${key}-1" type="checkbox" data-offer-key="${key}" name="event-offer-${key}" ${selected ? `checked` : ``}>
        <label class="event__offer-label" for="event-offer-${key}-1">
          <span class="event__offer-title">${offersData.get(key).title}</span>
          &plus;&euro;&nbsp;
          <span class="event__offer-price">${offersData.get(key).price}</span>
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

const createTypesMenuTemplate = (allAvailableTypes) => {
  return `<div class="event__type-list">
    <fieldset class="event__type-group">
      <legend class="visually-hidden">Event type</legend>

      ${Array.from(allAvailableTypes).map(([typeDataKey, typeDataValue]) => `<div class="event__type-item">
      <input id="event-type-${typeDataKey}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${typeDataKey}">
      <label class="event__type-label  event__type-label--${typeDataKey}" for="event-type-${typeDataKey}-1">${typeDataValue.title}</label>
    </div>`).join(``)}

    </fieldset>
  </div>`;
};

const createEditEventTemplate = (state) => {

  const {type, startDate, finishDate, offers, offersData, destination, destinationInfo, price, src, allTypeData} = state;

  const typesMenuTemplate = createTypesMenuTemplate(allTypeData.entries());

  const offersTemplate = createOffersTemplate(offers, offersData);

  const destinationInfoTemplate = createDestinationInfoTemplate(destinationInfo);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="${src}" alt="Event type icon">
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
  constructor(event = EMPTY_EVENT) {
    super();
    this._event = event;
    this._state = EditEvent.parseEventToState(event);

    this._clickHandler = this._clickHandler.bind(this);
    this._submitHandler = this._submitHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._priceInputHandler = this._priceInputHandler.bind(this);
    this._offerToggleHandler = this._offerToggleHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createEditEventTemplate(this._state);
  }

  static _parseEventToAvailableOffers(event) {
    const eventTypeData = getDataForEventType(event.type);
    const offers = new Set();

    if (event.offers && eventTypeData.offers.size > 0) {
      eventTypeData.offers.forEach((availableOffer) => {
        let selected = event.offers.has(availableOffer) ? true : false;
        offers.add({key: availableOffer, selected});
      }
      );
    }

    return offers;
  }

  _clickHandler(evt) {
    evt.preventDefault();
    this._callback.click();
  }

  _submitHandler(evt) {
    evt.preventDefault();
    this._callback.submit(EditEvent.parseStateToEvent(this._state));
  }

  _offerToggleHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();

    console.log(evt.target.dataset.offerKey);

    const offers = new Set(this._state.offers);
    offers.forEach((offer) => {
      if (offer.key === evt.target.dataset.offerKey) {
        offer.selected = !offer.selected;
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

    const allAvailableTypes = getDataForAllEventTypes();

    evt.preventDefault();
    this.updateData({
      type: evt.target.value,
      src: allAvailableTypes.get(evt.target.value).image,
      offers: EditEvent._parseEventToAvailableOffers({type: evt.target.value, offers: new Set()})
    });
  }

  _priceInputHandler(evt) {
    evt.preventDefault();
    this.updateData({
      price: parseInt(evt.target.value, 10)
    }, true);
  }

  _setInnerHandlers() {
    this.getElement()
    .querySelector(`.event__type-list`)
    .addEventListener(`change`, this._eventTypeChangeHandler);

    this.getElement()
    .querySelector(`.event__input--price`)
    .addEventListener(`input`, this._priceInputHandler);

    const offersRendered = this.getElement().querySelector(`.event__available-offers`);
    if (offersRendered) {
      offersRendered.addEventListener(`change`, this._offerToggleHandler);
    }
  }

  _restoreHandlers() {
    this._setInnerHandlers();
    this.setClickHandler(this._callback.click);
    this.setFormSubmitHandler(this._callback.submit);
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

  updateElement() {
    let prevElement = this.getElement();

    const parent = prevElement.parentElement;
    this.removeElement();

    const newElement = this.getElement();
    parent.replaceChild(newElement, prevElement);

    this._restoreHandlers();
  }

  updateData(update, isStateUpdateOnly) {
    if (!update) {
      return;
    }

    this._state = Object.assign(
        {},
        this._state,
        update
    );

    if (isStateUpdateOnly) {
      return;
    }

    this.updateElement();
  }

  static parseEventToState(event) {
    const allTypeData = getDataForAllEventTypes();
    const eventTypeData = allTypeData.get(event.type);
    const [defaultTypeData] = allTypeData.values();
    const src = eventTypeData ? eventTypeData.image : defaultTypeData.image;

    const offersData = getDataForAllOffers();

    const offers = EditEvent._parseEventToAvailableOffers(event);

    return Object.assign(
        {},
        event,
        {
          offers,
          offersData,
          allTypeData,
          src
        }
    );
  }

  static parseStateToEvent(state) {
    const event = Object.assign({}, state);

    const copyOffers = new Set();

    state.offers.forEach((offer) => {
      if (offer.selected) {
        const copyOffer = offer.key;
        copyOffers.add(copyOffer);
      }
    });

    event.offers = copyOffers;

    delete event.src;
    delete event.allTypeData;
    delete event.offersData;

    return event;
  }
}
