import MenuView from '../view/menu.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import NoEventView from './view/no-event.js';
import TripInfoView from './view/trip-info.js';
import TripPriceView from './view/trip-price.js';
import TripEventListView from './view/trip-event-list.js';
import {render, RenderPosition, replace} from './utils/render.js';


export default class Trip {
  constructor() {

    this._menuComponent = new MenuView();
    this._filterComponent = new FilterView();
    this._sortComponent = new SortView();
    this._noEventComponent = new NoEventView();
    this._tripInfoComponent = new TripInfoView();
    this._tripPriceComponent = new TripPriceView();
    this._eventListComponent = new TripEventListView();
  }

  init(tripEvents) {
    this._tripEvents = tripEvents;

    this._renderTrip();
  }

  _renderMenu() {

  }

  _renderFilter() {

  }

  _renderSort() {

  }

  _renderEvent() {

  }

  _renderEvents() {

  }

  _renderNoEvents() {

  }

  _renderTripInfo() {

  }

  _renderTripPrice() {

  }

  _renderTrip() {

    this._renderMenu();
    this._renderFilter();

    if (this._tripEvents.length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderTripInfo();
    this._renderTripPrice();
    this._renderSort();
    this._renderEvents();

  }
}
