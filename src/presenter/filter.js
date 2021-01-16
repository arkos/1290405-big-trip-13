import FilterView from '../view/filter.js';
import {remove, render, RenderPosition, replace} from '../utils/render.js';
import {FilterType, UpdateType} from '../utils/const.js';
import {filter} from '../utils/filter.js';

export default class Filter {
  constructor(filterContainer, filterModel, pointsModel) {
    this._filterContainer = filterContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._currentFilter = null;
    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filterModel.attach(this._handleModelEvent);
    this._pointsModel.attach(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filterModel.getFilter();

    const prevFilterComponent = this._filterComponent;

    const filters = this._getFilters();
    this._filterComponent = new FilterView(this._currentFilter, filters);
    this._filterComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filterContainer, this._filterComponent, RenderPosition.AFTEREND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);
  }

  _getFilters() {
    const points = this._pointsModel.getPoints();

    return {
      [FilterType.EVERYTHING]: true,
      [FilterType.FUTURE]: filter[FilterType.FUTURE](points).length > 0,
      [FilterType.PAST]: filter[FilterType.PAST](points).length > 0,
    };
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._currentFilter = filterType;
    this._filterModel.setFilter(UpdateType.MAJOR, this._currentFilter);
  }

  _handleModelEvent() {
    this.init();
  }
}
