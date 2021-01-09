import MenuView from './view/menu.js';
import StatisticsView from './view/statistics.js';
import {remove, render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import SummaryPresenter from './presenter/summary.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';
import Api from './api.js';
import {MenuItem, UpdateType, FilterType} from './utils/const.js';

const AUTHORIZATION = `Basic ab0d513b8d5045f4a72159701a847950`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const tripMainElement = document.querySelector(`.trip-main`);
const pointsElement = document.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const siteMenuTitleElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const [menuContainer, filterContainer] = siteMenuTitleElements;

const siteMenuComponent = new MenuView();

let statisticsComponent = null;

const filterPresenter = new FilterPresenter(filterContainer, filterModel);
const summaryPresenter = new SummaryPresenter(tripMainElement, pointsModel);
summaryPresenter.init();

const tripPresenter = new TripPresenter(
    tripMainElement,
    pointsElement,
    pointsModel,
    filterModel,
    offersModel,
    destinationsModel,
    api
);

const pointNewButton = document.querySelector(`.trip-main__event-add-btn`);

pointNewButton.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  remove(statisticsComponent);
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createPoint(handlePointNewFormClose);
  pointNewButton.disabled = true;
});

const handlePointNewFormClose = () => {
  pointNewButton.disabled = false;
};

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.init();
      remove(statisticsComponent);
      break;
    case MenuItem.STATISTICS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsView(pointsModel.getPoints());
      render(pointsElement, statisticsComponent, RenderPosition.AFTEREND);
      break;
  }
  siteMenuComponent.setMenuItem(menuItem);
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);

filterPresenter.init();
tripPresenter.init();

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
