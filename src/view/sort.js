import {createElement} from '../util.js';

const createSortItemsTemplate = (sortItems) => {
  return sortItems.map(([sortName, sortText], index) => `<div class="trip-sort__item  trip-sort__item--${sortName}">
  <input id="sort-${sortName}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
    value="sort-${sortName}" ${index === 0 ? `checked` : ``} ${sortName === `event` || sortName === `offer` ? `disabled` : ``}>
  <label class="trip-sort__btn" for="sort-${sortName}">${sortText}</label>
</div>`).join(``);
};


const createSortTemplate = (sort) => {
  const sortItems = Object.entries(sort);
  const sortItemsTemplate = createSortItemsTemplate(sortItems);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortItemsTemplate}
  </form>`;
};

export default class Sort {
  constructor(sort) {
    this._sort = sort;
    this._element = null;
  }

  getTemplate() {
    return createSortTemplate(this._sort);
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
