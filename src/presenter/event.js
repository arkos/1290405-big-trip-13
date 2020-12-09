import TripEventView from '../view/trip-event.js';
import EditEventView from '../view/edit-event.js';
import {isEscEvent} from '../utils/common.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

export default class Event {
  constructor(eventListContainer, changeData) {
    this._eventListContainer = eventListContainer;
    this._tripEventComponent = null;
    this._tripEventEditComponent = null;
    this._changeData = changeData;

    this._handleClickRollupButtonUp = this._handleClickRollupButtonUp.bind(this);
    this._handleClickRollupButtonDown = this._handleClickRollupButtonDown.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(tripEvent) {
    this._tripEvent = tripEvent;

    const prevEventComponent = this._tripEventComponent;
    const prevEventEditComponent = this._tripEventEditComponent;

    this._tripEventComponent = new TripEventView(tripEvent);
    this._tripEventEditComponent = new EditEventView(tripEvent);

    this._tripEventComponent.setClickHandler(this._handleClickRollupButtonDown);
    this._tripEventComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._tripEventEditComponent.setClickHandler(this._handleClickRollupButtonUp);
    this._tripEventEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    if ((prevEventComponent === null) || (prevEventEditComponent === null)) {
      render(this._eventListContainer, this._tripEventComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    if (this._eventListContainer.getElement().contains((prevEventComponent.getElement()))) {
      replace(this._tripEventComponent, prevEventComponent);
    }

    if (this._eventListContainer.getElement().contains(prevEventEditComponent.getElement())) {
      replace(this._tripEventEditComponent, prevEventEditComponent);
    }

    remove(prevEventComponent);
    remove(prevEventEditComponent);
  }

  _handleClickRollupButtonUp() {
    this._switchToDisplay();
  }

  _handleClickRollupButtonDown() {
    this._switchToEdit();
  }

  _handleEscKeyDown(evt) {
    isEscEvent(evt, () => this._switchToDisplay());
  }

  _handleFormSubmit() {
    this._switchToDisplay();
  }

  _handleFavoriteClick() {
    this._changeData(Object.assign({}, this._tripEvent, {isFavorite: !this._tripEvent.isFavorite}));
  }

  _switchToEdit() {
    replace(this._tripEventEditComponent, this._tripEventComponent);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
  }

  _switchToDisplay() {
    replace(this._tripEventComponent, this._tripEventEditComponent);
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
  }

  destroy() {
    remove(this._tripEventComponent);
    remove(this._tripEventEditComponent);
  }
}
