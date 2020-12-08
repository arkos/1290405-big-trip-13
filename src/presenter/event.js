import TripEventView from '../view/trip-event.js';
import EditEventView from '../view/edit-event.js';
import {isEscEvent} from '../utils/common.js';
import {render, RenderPosition, replace} from '../utils/render.js';

export default class Event {
  constructor(eventListContainer) {
    this._eventListContainer = eventListContainer;
    this._tripEventComponent = null;
    this._tripEventEditComponent = null;
  }

  init(tripEvent) {
    this._tripEvent = tripEvent;

    this._tripEventComponent = new TripEventView(tripEvent);
    this._tripEventEditComponent = new EditEventView(tripEvent);

    const switchToEdit = () => {
      replace(this._tripEventEditComponent, this._tripEventComponent);
    };

    const switchToDisplay = () => {
      replace(this._tripEventComponent, this._tripEventEditComponent);
    };

    const onClickRollupButtonUp = () => {
      switchToDisplay();
      document.removeEventListener(`keydown`, onEscKeyDown);
    };

    const onClickRollupButtonDown = () => {
      switchToEdit();
      document.addEventListener(`keydown`, onEscKeyDown);
    };

    const onEscKeyDown = (evt) => {
      isEscEvent(evt, () => {
        switchToDisplay();
        document.removeEventListener(`keydown`, onEscKeyDown);
      });
    };

    this._tripEventComponent.setClickHandler(onClickRollupButtonDown);

    this._tripEventEditComponent.setClickHandler(onClickRollupButtonUp);

    this._tripEventEditComponent.setFormSubmitHandler(() => {
      switchToDisplay();
      document.removeEventListener(`keydown`, onEscKeyDown);
    });

    render(this._eventListContainer, this._tripEventComponent, RenderPosition.AFTERBEGIN);
  }
}
