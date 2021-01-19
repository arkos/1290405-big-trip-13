import AbstractView from '../view/abstract.js';
import {MenuItem} from '../utils/const.js';

export const createMenuTemplate = () => {
  return `<nav class="trip-controls__trip-tabs  trip-tabs">
    <a class="trip-tabs__btn  trip-tabs__btn--active" href="#" data-key="${MenuItem.TABLE}">Table</a>
    <a class="trip-tabs__btn" href="#" data-key="${MenuItem.STATISTICS}">Stats</a>
  </nav>`;
};

export default class Menu extends AbstractView {
  constructor() {
    super();
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate();
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener(`click`, this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const menuElements = this.getElement().querySelectorAll(`.trip-tabs__btn`);

    if (menuElements === null) {
      return;
    }

    menuElements.forEach((item) => {
      if (item.dataset.key === menuItem) {
        item.classList.add(`trip-tabs__btn--active`);
      } else {
        item.classList.remove(`trip-tabs__btn--active`);
      }
    });
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    this._callback.menuClick(evt.target.dataset.key);
  }
}
