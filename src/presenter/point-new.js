import PointEditView from '../view/point-edit.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UpdateType, UserAction} from '../utils/const.js';
import {isEscEvent} from '../utils/common.js';

export default class PointNew {
  constructor(pointListContainer, changeData) {
    this._pointListContainer = pointListContainer;
    this._changeData = changeData;

    this._pointEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleClickRollupButtonUp = this._handleClickRollupButtonUp.bind(this);
  }

  init(offersModel, destinationsModel) {
    if (this._pointEditComponent !== null) {
      return;
    }

    this._pointEditComponent = new PointEditView(offersModel.getOffers(), destinationsModel.getDestinations());
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._pointEditComponent.setRollupButtonClickHandler(this._handleClickRollupButtonUp);

    render(this._pointListContainer, this._pointEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  destroy() {
    if (this._pointEditComponent === null) {
      return;
    }

    remove(this._pointEditComponent);
    this._pointEditComponent = null;

    document.removeEventListener(`keydown`, this._handleEscKeyDown);
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _handleEscKeyDown(evt) {
    isEscEvent(evt, () => {
      this.destroy();
    });
  }

  _handleClickRollupButtonUp() {
    this.destroy();
  }
}
