import SortView from '../view/sort.js';
import NoEventView from '../view/no-event.js';
import TripInfoView from '../view/trip-info.js';
import TripPriceView from '../view/trip-price.js';
import EventListView from '../view/event-list.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {generateSort} from '../mock/sort.js';
import {getTripInfo, getTripPrice, sortEventDateAsc, sortEventPriceDesc, sortEventDurationDesc} from '../utils/event.js';
import {SortType} from '../utils/const.js';
import EventPresenter from '../presenter/event.js';


export default class Trip {
  constructor(tripContainer, eventContainer, eventsModel) {
    this._tripContainer = tripContainer;
    this._eventContainer = eventContainer;
    this._eventsModel = eventsModel;

    this._eventPresenterMap = new Map();

    const sort = generateSort();
    this._sortComponent = new SortView(sort);
    this._currentSortType = SortType.DAY;

    this._tripPriceComponent = null;
    this._tripInfoComponent = null;

    this._noEventComponent = new NoEventView();
    this._eventListComponent = new EventListView();

    this._handleEventChange = this._handleEventChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  _getEvents() {
    switch (this._currentSortType) {
      case SortType.DAY:
        return this._eventsModel.getEvents().slice().sort(sortEventDateAsc);
      case SortType.TIME:
        return this._eventsModel.getEvents().slice().sort(sortEventDurationDesc);
      case SortType.PRICE:
        return this._eventsModel.getEvents().slice().sort(sortEventPriceDesc);
      default:
        return this._eventsModel.getEvents();
    }
  }

  init() {
    this._renderTrip();
  }

  _renderSort() {
    render(this._eventContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._handleEventChange, this._handleModeChange);
    eventPresenter.init(event, this._eventTypeInfoMap, this._offerInfoMap, this._destinationInfoMap);
    this._eventPresenterMap.set(event.id, eventPresenter);
  }

  _renderEvents() {
    render(this._eventContainer, this._eventListComponent, RenderPosition.BEFOREEND);

    this._getEvents().forEach((event) => this._renderEvent(event));
  }

  _renderNoEvents() {
    render(this._eventContainer, this._noEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripInfo() {
    const tripInfo = getTripInfo(this._getEvents());

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
    const totalPriceForEvents = getTripPrice(this._getEvents());

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
    this._eventPresenterMap.get(updatedEvent.id).init(updatedEvent);

    this._renderTripInfo();
    this._renderTripPrice();
  }

  _handleModeChange() {
    this._eventPresenterMap.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearEventList();
    this._renderEvents();
  }

  _renderTrip() {
    if (this._getEvents().length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderTripInfo();
    this._renderTripPrice();
    this._renderSort();
    this._renderEvents();
  }
}
