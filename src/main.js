import MenuView from './view/menu.js';
import FilterView from './view/filter.js';
import {generateEvent} from './mock/event.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';

const EVENT_COUNT = 10;
const generatedEvents = new Array(EVENT_COUNT).fill().map(generateEvent);

const tripMainElement = document.querySelector(`.trip-main`);
const eventsElement = document.querySelector(`.trip-events`);

const eventsModel = new EventsModel();
eventsModel.setEvents(generatedEvents);

const filterModel = new FilterModel();

// Site Menu rendering

const filter = {
  everything: `Everything`,
  future: `Future`,
  past: `Past`
};

const siteMenuTitleElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const siteMenuElements = [new MenuView(), new FilterView(filter)];
siteMenuElements.forEach((element, index) => render(siteMenuTitleElements[index], element, RenderPosition.AFTEREND));

const tripPresenter = new TripPresenter(tripMainElement, eventsElement, eventsModel);

// Trip rendering
tripPresenter.init();
