import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripPriceTemplate} from './view/trip-price.js';
import {createMenuTemplate} from './view/menu.js';
import {createFilterTemplate} from './view/filter.js';
import {createSortTemplate} from './view/sort.js';
import {createTripEventsTemplate} from './view/trip-events.js';
import {createTripEventTemplate} from './view/trip-event.js';
import {createEditEventTemplate} from './view/edit-event.js';
import {generateEvent} from './mock/event.js';
import {generateFilter} from './mock/filter.js';
import {generateSort} from './mock/sort.js';

const EVENT_COUNT = 2;

const events = new Array(EVENT_COUNT).fill().map(generateEvent);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

const totalPrice = events.reduce((sum, current) => current.price + sum, 0);
render(tripInfoElement, createTripPriceTemplate(totalPrice), `beforeend`);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripMenuTitleElement = tripControlsElement.querySelector(`h2`);

render(tripMenuTitleElement, createMenuTemplate(), `afterend`);

const filter = generateFilter();
render(tripControlsElement, createFilterTemplate(filter), `beforeend`);

const tripEventsElement = document.querySelector(`.trip-events`);
const sort = generateSort();
render(tripEventsElement, createSortTemplate(sort), `beforeend`);

const sortedByDateEvents = [...events];
sortedByDateEvents.sort((a, b) => b.startDate - a.startDate);

render(tripEventsElement, createTripEventsTemplate(), `beforeend`);
const tripEventsListElement = tripEventsElement.querySelector(`.trip-events__list`);

render(tripEventsListElement, createEditEventTemplate(sortedByDateEvents[0]), `beforeend`);

for (let i = 1; i < events.length; i++) {
  render(tripEventsListElement, createTripEventTemplate(sortedByDateEvents[i]), `beforeend`);
}

