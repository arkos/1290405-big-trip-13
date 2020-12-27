import SortView from '../view/sort.js';
import NoPointView from '../view/no-point.js';
import TripInfoView from '../view/trip-info.js';
import TripPriceView from '../view/trip-price.js';
import PointListView from '../view/point-list.js';
import LoadingView from '../view/loading.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {getTripInfo, getTripPrice, sortPointDateAsc, sortPointPriceDesc, sortPointDurationDesc} from '../utils/point.js';
import {filter} from '../utils/filter.js';
import {SortType, UserAction, UpdateType, FilterType} from '../utils/const.js';
import PointPresenter from '../presenter/event.js';
import PointNewPresenter from '../presenter/point-new.js';

export default class Trip {
  constructor(tripContainer, eventContainer, eventsModel, filterModel, offersModel, destinationsModel) {
    this._tripContainer = tripContainer;
    this._eventContainer = eventContainer;
    this._eventsModel = eventsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._isLoading = true;

    this._eventPresenterMap = new Map();

    this._currentSortType = SortType.DAY;
    this._sortComponent = null;

    this._tripPriceComponent = null;
    this._tripInfoComponent = null;

    this._noPointComponent = new NoPointView();
    this._eventListComponent = new PointListView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._eventsModel.attach(this._handleModelEvent);
    this._filterModel.attach(this._handleModelEvent);

    this._eventNewPresenter = new PointNewPresenter(this._eventListComponent, this._handleViewAction);
  }

  init() {
    this._renderTrip();
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._eventNewPresenter.init(this._dataListModel);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const events = this._eventsModel.getPoints();
    const filteredPoints = filter[filterType](events);

    switch (this._currentSortType) {
      case SortType.DAY:
        return filteredPoints.sort(sortPointDateAsc);
      case SortType.TIME:
        return filteredPoints.sort(sortPointDurationDesc);
      case SortType.PRICE:
        return filteredPoints.sort(sortPointPriceDesc);
      default:
        return filteredPoints;
    }
  }

  _renderLoading() {
    render(this._eventContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._eventContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(event) {
    const eventPresenter = new PointPresenter(this._eventListComponent, this._handleViewAction, this._handleModeChange);
    eventPresenter.init(event, this._dataListModel);
    this._eventPresenterMap.set(event.id, eventPresenter);
  }

  _renderPoints(events) {
    render(this._eventContainer, this._eventListComponent, RenderPosition.BEFOREEND);

    events.forEach((event) => this._renderPoint(event));
  }

  _renderNoPoints() {
    render(this._eventContainer, this._noPointComponent, RenderPosition.AFTERBEGIN);
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

    const totalPriceForPoints = getTripPrice(events);
    this._tripPriceComponent = new TripPriceView(totalPriceForPoints);
    render(this._tripInfoComponent, this._tripPriceComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const events = this._getPoints();

    if (events.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderTripInfo(events);
    this._renderTripPrice(events);
    this._renderSort();
    this._renderPoints(events);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._eventNewPresenter.destroy();

    this._eventPresenterMap.forEach((presenter) => presenter.destroy());
    this._eventPresenterMap.clear();

    remove(this._loadingComponent);
    remove(this._sortComponent);
    remove(this._noPointComponent);
    remove(this._tripInfoComponent);
    remove(this._tripPriceComponent);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.ADD_POINT:
        this._eventsModel.addPoint(updateType, update);
        break;
      case UserAction.UPDATE_POINT:
        this._eventsModel.updatePoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._eventsModel.deletePoint(updateType, update);
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
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
