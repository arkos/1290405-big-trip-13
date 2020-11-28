import {createElement} from '../util.js';

const createFilterItemsTemplate = (filterItems) => {
  return filterItems.map(([filterName, filterText], index) => `<div class="trip-filters__filter">
  <input id="filter-${filterName}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${filterName}" ${index === 0 ? `checked` : ``}>
  <label class="trip-filters__filter-label" for="filter-${filterName}">${filterText}</label>
</div>`).join(``);
};

const createFilterTemplate = (filter) => {
  const filterItemsTemplate = createFilterItemsTemplate(Object.entries(filter));
  return `<form class="trip-filters" action="#" method="get">
    ${filterItemsTemplate}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>`;
};

export default class Filter {
  constructor(filter) {
    this._filter = filter;
    this._element = null;
  }

  getTemplate() {
    return createFilterTemplate(this._filter);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
