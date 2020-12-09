import SortView from '../view/sort.js';
import NoEventView from '../view/no-event.js';
import TripInfoView from '../view/trip-info.js';
import TripPriceView from '../view/trip-price.js';
import TripEventListView from '../view/trip-event-list.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {generateSort} from '../mock/sort.js';
import {getTripInfo} from '../utils/event.js';
import {updateItem} from '../utils/common.js';
import EventPresenter from '../presenter/event.js';


export default class Trip {
  constructor(tripContainer, eventContainer) {
    this._tripContainer = tripContainer;
    this._eventContainer = eventContainer;
    this._eventPresenterMap = new Map();

    const sort = generateSort(); // TODO: Replace mock data with real data
    this._sortComponent = new SortView(sort);

    this._tripPriceComponent = null;
    this._tripInfoComponent = null;

    this._noEventComponent = new NoEventView();
    this._eventListComponent = new TripEventListView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(tripEvents) {
    this._tripEvents = tripEvents.slice();

    this._renderTrip();
  }

  _renderSort() {
    render(this._eventContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(tripEvent) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(tripEvent);
    this._eventPresenterMap.set(tripEvent.id, eventPresenter);
  }

  _renderEvents() {
    render(this._eventContainer, this._eventListComponent, RenderPosition.BEFOREEND);

    this._tripEvents.forEach((tripEvent) => this._renderEvent(tripEvent));
  }

  _renderEventList() {
    this._renderEvents();
  }

  _renderNoEvents() {
    render(this._eventContainer, new NoEventView(), RenderPosition.AFTERBEGIN);
  }

  _renderTripInfo() {
    const tripInfo = getTripInfo(this._tripEvents);

    const prevTripInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new TripInfoView(tripInfo);

    if (prevTripInfoComponent === null) {
      render(this._tripContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    render(this._tripInfoComponent, this._tripPriceComponent, RenderPosition.BEFOREEND);
    replace(this._tripInfoComponent, prevTripInfoComponent);

    remove(prevTripInfoComponent);
  }

  _renderTripPrice() {
    const totalPriceForEvents = this._tripEvents.reduce((total, event) => {
      const priceForEventOffers = event.offers.reduce((sum, offer) => sum + offer.price, 0);
      return event.price + priceForEventOffers + total;
    }, 0);

    const prevTripPriceComponent = this._tripPriceComponent;
    this._tripPriceComponent = new TripPriceView(totalPriceForEvents);

    if (prevTripPriceComponent === null) {
      render(this._tripInfoComponent, this._tripPriceComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._tripPriceComponent, prevTripPriceComponent);

    remove(prevTripPriceComponent);
  }

  _clearEventList() {
    this._eventPresenterMap.forEach((presenter) => presenter.destroy());
    this._eventPresenterMap.clear();
  }

  _handleEventChange(updatedEvent) {
    this._tripEvents = updateItem(this._tripEvents, updatedEvent);
    this._eventPresenterMap.get(updatedEvent.id).init(updatedEvent);

    this._renderTripInfo();
    this._renderTripPrice();
  }

  _handleModeChange() {
    this._eventPresenterMap.forEach((presenter) => presenter.resetView());
  }

  _renderTrip() {
    if (this._tripEvents.length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderTripInfo();
    this._renderTripPrice();
    this._renderSort();
    this._renderEventList(); // TODO: Probably obsolete, need to decide later
  }
}
