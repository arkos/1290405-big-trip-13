import MenuView from './view/menu.js';
import {render, RenderPosition} from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import DataListModel from './model/data-list.js';
import Api from './api.js';
import {UpdateType} from './utils/const.js';

const AUTHORIZATION = `Basic ab0d513b8d5045f4a72159701a847950`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const tripMainElement = document.querySelector(`.trip-main`);
const pointsElement = document.querySelector(`.trip-points`);

const api = new Api(END_POINT, AUTHORIZATION);

const dataListModel = new DataListModel();
const pointsModel = new PointsModel();
const filterModel = new FilterModel();

// Site Menu rendering
const siteMenuTitleElements = tripMainElement.querySelectorAll(`.trip-controls h2`);
const [menuContainer, filterContainer] = siteMenuTitleElements;

render(menuContainer, new MenuView(), RenderPosition.AFTEREND);

const filterPresenter = new FilterPresenter(filterContainer, filterModel);
filterPresenter.init();

const tripPresenter = new TripPresenter(tripMainElement, pointsElement, pointsModel, filterModel, dataListModel);

// Trip rendering
tripPresenter.init();

document.querySelector(`.trip-main__point-add-btn`).addPointListener(`click`, (evt) => {
  evt.prpointDefault();
  tripPresenter.createPoint();
});

api.getPoints()
.then((points) => pointsModel.setPoints(UpdateType.INIT, points))
.catch(() => pointsModel.setPoints(UpdateType.INIT, []));

api.getOffers().then((offers) => dataListModel.setOffers(offers));
api.getDestinations().then((destinations) => dataListModel.setDestinations(destinations));
