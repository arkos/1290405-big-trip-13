import SortView from '../view/sort.js';
import NoEventView from '../view/no-event.js';
import TripInfoView from '../view/trip-info.js';
import TripPriceView from '../view/trip-price.js';
import EventListView from '../view/event-list.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {getTripInfo, getTripPrice, sortEventDateAsc, sortEventPriceDesc, sortEventDurationDesc} from '../utils/event.js';
import {filter} from '../utils/filter.js';
import {SortType, UserAction, UpdateType, FilterType} from '../utils/const.js';
import EventPresenter from '../presenter/event.js';
import EventNewPresenter from '../presenter/event-new.js';

export default class Trip {
  constructor(tripContainer, eventContainer, eventsModel, filterModel, dataListModel) {
    this._tripContainer = tripContainer;
    this._eventContainer = eventContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._dataListModel = dataListModel;

    this._eventPresenterMap = new Map();

    this._currentSortType = SortType.DAY;
    this._sortComponent = null;

    this._tripPriceComponent = null;
    this._tripInfoComponent = null;

    this._noEventComponent = new NoEventView();
    this._eventListComponent = new EventListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsModel.attach(this._handleModelEvent);
    this._filterModel.attach(this._handleModelEvent);

    this._eventNewPresenter = new EventNewPresenter(this._eventListComponent, this._handleViewAction);
  }

  init() {
    this._renderTrip();
  }

  createEvent() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init(this._dataListModel);
  }

  _getEvents() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getEvents();
    const filteredEvents = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredEvents.sort(sortEventDateAsc);
      case SortType.TIME:
        return filteredEvents.sort(sortEventDurationDesc);
      case SortType.PRICE:
        return filteredEvents.sort(sortEventPriceDesc);
      default:
        return filteredEvents;
    }
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._eventContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(event) {
    const eventPresenter = new EventPresenter(this._eventListComponent, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event, this._dataListModel);
    this._eventPresenterMap.set(event.id, eventPresenter);
  }

  _renderEvents(events) {
    render(this._eventContainer, this._eventListComponent, RenderPosition.BEFOREEND);

    events.forEach((event) => this._renderEvent(event));
  }

  _renderNoEvents() {
    render(this._eventContainer, this._noEventComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripInfo(events) {
    if (this._tripInfoComponent !== null) {
      this._tripInfoComponent = null;
    }

    const tripInfo = getTripInfo(events);
    this._tripInfoComponent = new TripInfoView(tripInfo);
    render(this._tripContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripPrice(events) {
    if (this._tripPriceComponent !== null) {
      this._tripPriceComponent = null;
    }

    const totalPriceForEvents = getTripPrice(events);
    this._tripPriceComponent = new TripPriceView(totalPriceForEvents);
    render(this._tripInfoComponent, this._tripPriceComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    const events = this._getEvents();

    if (events.length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderTripInfo(events);
    this._renderTripPrice(events);
    this._renderSort();
    this._renderEvents(events);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();

    this._eventPresenterMap.forEach((presenter) => presenter.destroy());
    this._eventPresenterMap.clear();

    remove(this._sortComponent);
    remove(this._noEventComponent);
    remove(this._tripInfoComponent);
    remove(this._tripPriceComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.ADD_EVENT:
        this._eventsModel.addEvent(updateType, update);
        break;
      case UserAction.UPDATE_EVENT:
        this._eventsModel.updateEvent(updateType, update);
        break;
      case UserAction.DELETE_EVENT:
        this._eventsModel.deleteEvent(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._eventPresenterMap.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _handleModeChange() {
    this._eventNewPresenter.destroy();
    this._eventPresenterMap.forEach((presenter) => presenter.resetView());
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }
}
