import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import {generateEvent} from './mock/event.js';
import {generateFilter} from './mock/filter.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';

const EVENT_COUNT = 20;
const generatedEvents = new Array(EVENT_COUNT).fill().map(generateEvent);

const tripMainElement = document.querySelector(`.trip-main`);
const eventsElement = document.querySelector(`.trip-events`);

// Site Menu rendering
const filter = generateFilter();
const siteMenuTitleElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const siteMenuElements = [new MenuView(), new FilterView(filter)];
siteMenuElements.forEach((element, index) => render(siteMenuTitleElements[index], element, RenderPosition.AFTEREND));

const tripPresenter = new TripPresenter(tripMainElement, eventsElement);

// Trip rendering
tripPresenter.init(generatedEvents);
