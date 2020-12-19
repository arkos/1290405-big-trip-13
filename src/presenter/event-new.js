import EventEditView from '../view/event-edit.js';
import {remove, render, RenderPosition} from '../utils/render.js';
import {UpdateType, UserAction} from '../utils/const.js';
import {isEscEvent} from '../utils/common.js';
import {nanoid} from 'nanoid';

export default class EventNew {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._changeData = changeData;

    this._eventEditComponent = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleClickRollupButtonUp = this._handleClickRollupButtonUp.bind(this);
  }

  init(dataListModel) {
    if (this._eventEditComponent !== null) {
      return;
    }

    this._dataListModel = dataListModel;

    this._eventEditComponent = new EventEditView(this._dataListModel.getTypes(), this._dataListModel.getOffers(), this._dataListModel.getDestinations());
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);
    this._eventEditComponent.setRollupButtonClickHandler(this._handleClickRollupButtonUp);

    render(this._eventListContainer, this._eventEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  destroy() {
    if (this._eventEditComponent === null) {
      return;
    }

    remove(this._eventEditComponent);
    this._eventEditComponent = null;

    document.removeEventListener(`keydown`, this._handleEscKeyDown);
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.ADD_EVENT,
        UpdateType.MINOR,
        Object.assign({id: nanoid()}, event)
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
