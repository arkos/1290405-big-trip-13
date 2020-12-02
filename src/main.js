import MenuView from './view/menu.js';
import TripPriceView from './view/trip-price.js';
import TripInfoView from './view/trip-info.js';
import FilterView from './view/filter.js';
import SortView from './view/sort.js';
import TripEventListView from './view/trip-event-list.js';
import TripEventView from './view/trip-event.js';
import EditEventView from './view/edit-event.js';
import NoEventView from './view/no-event.js';
import {generateEvent} from './mock/event.js';
import {generateFilter} from './mock/filter.js';
import {generateSort} from './mock/sort.js';
import {render, RenderPosition, isEscEvent} from './util.js';

const EVENT_COUNT = 20;
const generatedEvents = new Array(EVENT_COUNT).fill().map(generateEvent);

const renderMainPage = (events) => {

  const tripMainElement = document.querySelector(`.trip-main`);

  const tripEventsElement = document.querySelector(`.trip-events`);

  const tripControlsElement = tripMainElement.querySelector(`.trip-controls`);
  const tripMenuTitleElement = tripControlsElement.querySelector(`h2`);

  render(tripMenuTitleElement, new MenuView().getElement(), RenderPosition.AFTEREND);

  const filter = generateFilter();
  render(tripControlsElement, new FilterView(filter).getElement(), RenderPosition.BEFOREEND);

  if (events.length === 0) {
    render(tripEventsElement, new NoEventView().getElement(), RenderPosition.AFTERBEGIN);
    return;
  }

  const sortedByDateEvents = [...events];
  sortedByDateEvents.sort((a, b) => a.startDate - b.startDate);

  const destinations = [];
  sortedByDateEvents.forEach((evt) => destinations.push(evt.destination));

  const tripInfo = {
    startDate: sortedByDateEvents[0].startDate,
    finishDate: sortedByDateEvents[sortedByDateEvents.length - 1].finishDate,
    destinations
  };

  render(tripMainElement, new TripInfoView(tripInfo).getElement(), RenderPosition.AFTERBEGIN);

  const tripInfoElement = tripMainElement.querySelector(`.trip-info`);

  const totalPriceForEvents = sortedByDateEvents.reduce((total, event) => {
    const priceForEventOffers = event.offers.reduce((sum, offer) => sum + offer.price, 0);
    return event.price + priceForEventOffers + total;
  }, 0);

  render(tripInfoElement, new TripPriceView(totalPriceForEvents).getElement(), RenderPosition.BEFOREEND);

  const sort = generateSort();
  render(tripEventsElement, new SortView(sort).getElement(), RenderPosition.BEFOREEND);

  render(tripEventsElement, new TripEventListView().getElement(), RenderPosition.BEFOREEND);

  const tripEventsListElement = tripEventsElement.querySelector(`.trip-events__list`);

  sortedByDateEvents.forEach((tripEvent) =>
    renderTripEvent(tripEventsListElement, tripEvent));
};


const renderTripEvent = (tripEventListElement, tripEvent) => {
  const tripEventComponent = new TripEventView(tripEvent);
  const tripEventEditComponent = new EditEventView(tripEvent);

  const switchToEdit = () => {
    tripEventListElement.replaceChild(tripEventEditComponent.getElement(), tripEventComponent.getElement());
  };

  const switchToDisplay = () => {
    tripEventListElement.replaceChild(tripEventComponent.getElement(), tripEventEditComponent.getElement());
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

  tripEventComponent.setClickHandler(onClickRollupButtonDown);

  tripEventEditComponent.setClickHandler(onClickRollupButtonUp);

  tripEventEditComponent.setFormSubmitHandler(() => {
    switchToDisplay();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(tripEventListElement, tripEventComponent.getElement(), RenderPosition.AFTERBEGIN);
};

renderMainPage(generatedEvents);
