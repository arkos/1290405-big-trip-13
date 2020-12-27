import PointView from '../view/point.js';
import PointEditView from '../view/point-edit.js';
import {isEscEvent} from '../utils/common.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {UserAction, UpdateType} from '../utils/const.js';

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(pointListContainer, changeData, changeMode) {
    this._pointListContainer = pointListContainer;
    this._pointComponent = null;
    this._pointEditComponent = null;
    this._changeData = changeData;
    this._changeMode = changeMode;
    this._mode = Mode.DEFAULT;

    this._handleClickRollupButtonUp = this._handleClickRollupButtonUp.bind(this);
    this._handleClickRollupButtonDown = this._handleClickRollupButtonDown.bind(this);
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
  }

  init(point, offersModel, destinationsModel) {
    this._point = point;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(point);
    this._pointEditComponent = new PointEditView(this.offersModel.getOffers(), this._destinationsModel.getDestinations(), point);

    this._pointComponent.setRollupButtonClickHandler(this._handleClickRollupButtonDown);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setRollupButtonClickHandler(this._handleClickRollupButtonUp);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if ((prevPointComponent === null) || (prevPointEditComponent === null)) {
      render(this._pointListContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._switchToDisplay();
    }
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  _switchToEdit() {
    replace(this._pointEditComponent, this._pointComponent);
    document.addEventListener(`keydown`, this._handleEscKeyDown);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _switchToDisplay() {
    replace(this._pointComponent, this._pointEditComponent);
    document.removeEventListener(`keydown`, this._handleEscKeyDown);
    this._mode = Mode.DEFAULT;
  }

  _handleClickRollupButtonUp() {
    this._pointEditComponent.reset(this._point);
    this._switchToDisplay();
  }

  _handleClickRollupButtonDown() {
    this._switchToEdit();
  }

  _handleEscKeyDown(evt) {
    isEscEvent(evt, () => {
      this._pointEditComponent.reset(this._point);
      this._switchToDisplay();
    });
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        point
    );
    this._switchToDisplay();
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        Object.assign({}, this._point, {isFavorite: !this._point.isFavorite}));
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }


}
