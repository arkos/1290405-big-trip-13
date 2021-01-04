import MenuView from './view/menu.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import Api from './api.js';
import {MenuItem, UpdateType} from './utils/const.js';
import Menu from './view/menu.js';

const AUTHORIZATION = `Basic ab0d513b8d5045f4a72159701a847950`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const tripMainElement = document.querySelector(`.trip-main`);
const pointsElement = document.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

// Site Menu rendering
const siteMenuTitleElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const [menuContainer, filterContainer] = siteMenuTitleElements;

const siteMenuComponent = new MenuView();

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.ADD_NEW_POINT:
      break;
    case MenuItem.TABLE:

      break;
    case MenuItem.STATISTICS:
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

const filterPresenter = new FilterPresenter(filterContainer, filterModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(
    tripMainElement,
    pointsElement,
    pointsModel,
    filterModel,
    offersModel,
    destinationsModel,
    api
);

// Trip rendering
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});

const promises = Promise.all([api.getOffers(), api.getDestinations(), api.getPoints()]);
promises
.then(([offers, destinations, points]) => {
  offersModel.setOffers(offers);
  destinationsModel.setDestinations(destinations);
  pointsModel.setPoints(UpdateType.INIT, points);
  render(menuContainer, siteMenuComponent, RenderPosition.AFTEREND);
})
.catch(() => {
  pointsModel.setPoints(UpdateType.INIT, []);
  render(menuContainer, siteMenuComponent, RenderPosition.AFTEREND);
});
