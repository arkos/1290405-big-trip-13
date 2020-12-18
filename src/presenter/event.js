import EventView from '../view/event.js';
import EventEditView from '../view/event-edit.js';
import {isEscEvent} from '../utils/common.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';
import {getDataForAllDestinations, getDataForAllEventTypes, getDataForAllOffers} from '../mock/event.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Event {
  constructor(eventListContainer, changeData, changeMode) {
    this._eventListContainer = eventListContainer;
    this._eventComponent = null;
    this._eventEditComponent = null;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;

    this._eventTypeInfoMap = getDataForAllEventTypes();
    this._offerInfoMap = getDataForAllOffers();
    this._destinationInfoMap = getDataForAllDestinations();

    this._handleClickRollupButtonUp = this._handleClickRollupButtonUp.bind(this);
    this._handleClickRollupButtonDown = this._handleClickRollupButtonDown.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(event) {
    this._event = event;

    const prevEventComponent = this._eventComponent;
    const prevEventEditComponent = this._eventEditComponent;

    this._eventComponent = new EventView(event, this._offerInfoMap);
    this._eventEditComponent = new EventEditView(event, this._eventTypeInfoMap, this._offerInfoMap, this._destinationInfoMap);

    this._eventComponent.setRollupButtonClickHandler(this._handleClickRollupButtonDown);
    this._eventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._eventEditComponent.setRollupButtonClickHandler(this._handleClickRollupButtonUp);
    this._eventEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._eventEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if ((prevEventComponent === null) || (prevEventEditComponent === null)) {
      render(this._eventListContainer, this._eventComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._eventComponent, prevEventComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._eventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  _handleClickRollupButtonUp() {
    this._eventEditComponent.reset(this._event);
    this._switchToDisplay();
  }

  _handleClickRollupButtonDown() {
    this._switchToEdit();
  }

  _handleEscKeyDown(evt) {
    isEscEvent(evt, () => {
      this._eventEditComponent.reset(this._event);
      this._switchToDisplay();
    });
  }

  _handleFormSubmit(event) {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MINOR,
        event
    );
    this._switchToDisplay();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_EVENT,
        UpdateType.MINOR,
        Object.assign({}, this._event, {isFavorite: !this._event.isFavorite}));
  }

  _handleDeleteClick(event) {
    this._changeData(
        UserAction.DELETE_EVENT,
        UpdateType.MINOR,
        event
    );
  }

  _switchToEdit() {
    replace(this._eventEditComponent, this._eventComponent);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _switchToDisplay() {
    replace(this._eventComponent, this._eventEditComponent);
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._switchToDisplay();
    }
  }

  destroy() {
    remove(this._eventComponent);
    remove(this._eventEditComponent);
  }
}
