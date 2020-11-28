import MenuView from './view/menu.js';
import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripPriceTemplate} from './view/trip-price.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createTripEventsTemplate} from './view/trip-events.js';
import {createTripEventTemplate} from './view/trip-event.js';
import {createEditEventTemplate} from './view/edit-event.js';
import {generateEvent} from './mock/event.js';
import {generateFilter} from './mock/filter.js';
import {generateSort} from './mock/sort.js';
import {renderTemplate, renderElement, RenderPosition} from './util.js';

const EVENT_COUNT = 20;

const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const tripMainElement = document.querySelector(`.trip-main`);

const sortedByDateEvents = [...events];
sortedByDateEvents.sort((a, b) => a.startDate - b.startDate);

const destinations = [];

sortedByDateEvents.forEach((evt) => destinations.push(evt.destination));

const tripInfo = {
  startDate: sortedByDateEvents[0].startDate,
  finishDate: sortedByDateEvents[sortedByDateEvents.length - 1].finishDate,
  destinations
};

renderTemplate(tripMainElement, createTripInfoTemplate(tripInfo), `afterbegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

const totalPriceForEvents = sortedByDateEvents.reduce((total, event) => {
  const priceForEventOffers = event.offers.reduce((sum, offer) => sum + offer.price, 0);
  return event.price + priceForEventOffers + total;
}, 0);

renderTemplate(tripInfoElement, createTripPriceTemplate(totalPriceForEvents), `beforeend`);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripMenuTitleElement = tripControlsElement.querySelector(`h2`);

renderElement(tripMenuTitleElement, new MenuView().getElement(), RenderPosition.AFTEREND);

const filter = generateFilter();
renderTemplate(tripControlsElement, createFilterTemplate(filter), `beforeend`);

const tripEventsElement = document.querySelector(`.trip-events`);
const sort = generateSort();
renderTemplate(tripEventsElement, createSortTemplate(sort), `beforeend`);

renderTemplate(tripEventsElement, createTripEventsTemplate(), `beforeend`);
const tripEventsListElement = tripEventsElement.querySelector(`.trip-events__list`);

renderTemplate(tripEventsListElement, createEditEventTemplate(sortedByDateEvents[sortedByDateEvents.length - 1]), `beforeend`);

for (let i = sortedByDateEvents.length - 2; i >= 0; i--) {
  renderTemplate(tripEventsListElement, createTripEventTemplate(sortedByDateEvents[i]), `beforeend`);
}

