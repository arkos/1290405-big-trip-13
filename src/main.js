import MenuView from './view/menu.js';
import {generateEvent, getDataForAllEventTypes, getDataForAllOffers, getDataForAllDestinations} from './mock/event.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import EventsModel from './model/events.js';
import FilterModel from './model/filter.js';
import DataListModel from './model/data-list.js';
import Api from './api.js';

const EVENT_COUNT = 3;
const AUTHORIZATION = `Basic ab0d513b8d5045f4a72159701a847950`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const generatedEvents = new Array(EVENT_COUNT).fill().map(generateEvent);
const api = new Api(END_POINT, AUTHORIZATION);

const eventTypeInfoMap = getDataForAllEventTypes();
const offerInfoMap = getDataForAllOffers();
const destinationInfoMap = getDataForAllDestinations();

const dataListModel = new DataListModel();
dataListModel.setData(offerInfoMap, eventTypeInfoMap, destinationInfoMap);

const tripMainElement = document.querySelector(`.trip-main`);
const eventsElement = document.querySelector(`.trip-events`);

const eventsModel = new EventsModel();
eventsModel.setEvents(generatedEvents);

const filterModel = new FilterModel();

// Site Menu rendering

const siteMenuTitleElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const [menuContainer, filterContainer] = siteMenuTitleElements;

render(menuContainer, new MenuView(), RenderPosition.AFTEREND);

const filterPresenter = new FilterPresenter(filterContainer, filterModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(tripMainElement, eventsElement, eventsModel, filterModel, dataListModel);

// Trip rendering
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createEvent();
});
