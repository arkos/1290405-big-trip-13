import AbstractView from '../view/abstract.js';

const createSortItemsTemplate = (sortItems) => {
  return Array.from(sortItems).map(([sortItemKey, sortItemValue]) => `<div class="trip-sort__item  trip-sort__item--${sortItemKey}">
  <input id="sort-${sortItemKey}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
    value="sort-${sortItemKey}" ${sortItemValue.checked ? `checked` : ``} ${sortItemValue.disabled ? `disabled` : ``}>
  <label class="trip-sort__btn" for="sort-${sortItemKey}">${sortItemValue.text}</label>
</div>`).join(``);
};


const createSortTemplate = (sortItems) => {
  const sortItemsTemplate = createSortItemsTemplate(sortItems);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortItemsTemplate}
  </form>`;
};

export default class Sort extends AbstractView {
  constructor(sort) {
    super();
    this._sort = sort;
    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSortTemplate(this._sort);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== `INPUT`) {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.value);
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener(`change`, this._sortTypeChangeHandler);
  }
}
