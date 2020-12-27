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
import PointPresenter from '../presenter/point.js';
import PointNewPresenter from '../presenter/point-new.js';

export default class Trip {
  constructor(tripContainer, pointContainer, pointsModel, filterModel, offersModel, destinationsModel) {
    this._tripContainer = tripContainer;
    this._pointContainer = pointContainer;
    this._pointsModel = pointsModel;
    this._filterModel = filterModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._isLoading = true;

    this._pointPresenterMap = new Map();

    this._currentSortType = SortType.DAY;
    this._sortComponent = null;

    this._tripPriceComponent = null;
    this._tripInfoComponent = null;

    this._noPointComponent = new NoPointView();
    this._pointListComponent = new PointListView();
    this._loadingComponent = new LoadingView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.attach(this._handleModelEvent);
    this._filterModel.attach(this._handleModelEvent);

    // this._pointNewPresenter = new PointNewPresenter(this._pointListComponent, this._handleViewAction);
  }

  init() {
    this._renderTrip();
  }

  createPoint() {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(this._dataListModel);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[filterType](points);

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
    render(this._pointContainer, this._loadingComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._pointContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, this._offersModel, this._destinationsModel);
    this._pointPresenterMap.set(point.id, pointPresenter);
  }

  _renderPoints(points) {
    render(this._pointContainer, this._pointListComponent, RenderPosition.BEFOREEND);

    points.forEach((point) => this._renderPoint(point));
  }

  _renderNoPoints() {
    render(this._pointContainer, this._noPointComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripInfo(points) {
    if (this._tripInfoComponent !== null) {
      this._tripInfoComponent = null;
    }

    const tripInfo = getTripInfo(points);
    this._tripInfoComponent = new TripInfoView(tripInfo);
    render(this._tripContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripPrice(points) {
    if (this._tripPriceComponent !== null) {
      this._tripPriceComponent = null;
    }

    const totalPriceForPoints = getTripPrice(points);
    this._tripPriceComponent = new TripPriceView(totalPriceForPoints);
    render(this._tripInfoComponent, this._tripPriceComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderTripInfo(points);
    this._renderTripPrice(points);
    this._renderSort();
    this._renderPoints(points);
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    this._pointPresenterMap.forEach((presenter) => presenter.destroy());
    this._pointPresenterMap.clear();

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
        this._pointsModel.addPoint(updateType, update);
        break;
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenterMap.get(data.id).init(data);
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
    this._pointNewPresenter.destroy();
    this._pointPresenterMap.forEach((presenter) => presenter.resetView());
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
