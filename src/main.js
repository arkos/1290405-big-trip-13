import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripPriceTemplate} from './view/trip-price.js';
import {createMenuTemplate} from './view/menu.js';
import {createFiltersTemplate} from './view/filters.js';
import {createSortTemplate} from './view/sort.js';
import {createTripEventsTemplate} from './view/trip-events.js';
import {createTripEventTemplate} from './view/trip-event.js';
import {createEditEventTemplate} from './view/edit-event.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createTripPriceTemplate(), `beforeend`);

const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
const tripMenuTitleElement = tripControlsElement.querySelector(`h2`);

render(tripMenuTitleElement, createMenuTemplate(), `afterend`);
render(tripControlsElement, createFiltersTemplate(), `beforeend`);

const tripEventsElement = document.querySelector(`.trip-events`);
render(tripEventsElement, createSortTemplate(), `beforeend`);

render(tripEventsElement, createTripEventsTemplate(), `beforeend`);
const tripEventsListElement = tripEventsElement.querySelector(`.trip-events__list`);

render(tripEventsListElement, createEditEventTemplate(), `beforeend`);

render(tripEventsListElement, createTripEventTemplate(), `beforeend`);
render(tripEventsListElement, createTripEventTemplate(), `beforeend`);
render(tripEventsListElement, createTripEventTemplate(), `beforeend`);

