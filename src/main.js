import {createTripInfoTemplate} from './view/trip-info.js';
import {createTripPriceTemplate} from './view/trip-price.js';

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const tripMainElement = document.querySelector(`.trip-main`);
render(tripMainElement, createTripInfoTemplate(), `afterbegin`);

const tripInfoElement = tripMainElement.querySelector(`.trip-info`);
render(tripInfoElement, createTripPriceTemplate(), `beforeend`);

