import SortView from '../view/sort.js';
import NoEventView from '../view/no-event.js';
import TripInfoView from '../view/trip-info.js';
import TripPriceView from '../view/trip-price.js';
import TripEventListView from '../view/trip-event-list.js';
import {render, RenderPosition} from '../utils/render.js';
import {generateSort} from '../mock/sort.js';
import EventPresenter from '../presenter/event.js';


export default class Trip {
  constructor(tripContainer, eventContainer) {
    this._tripContainer = tripContainer;
    this._eventContainer = eventContainer;

    const sort = generateSort(); // TODO: Replace mock data with real data
    this._sortComponent = new SortView(sort);

    this._noEventComponent = new NoEventView();
    this._tripPriceComponent = new TripPriceView();
    this._eventListComponent = new TripEventListView();
  }

  init(tripEvents) {
    this._tripEvents = tripEvents;

    this._renderTrip();
  }

  _renderSort() {
    render(this._eventContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderEvent(tripEvent) {
    const eventPresenter = new EventPresenter(this._eventListComponent);
    eventPresenter.init(tripEvent);
  }

  _renderEvents() {
    render(this._eventContainer, this._eventListComponent, RenderPosition.BEFOREEND);

    this._tripEvents.forEach((tripEvent) => this._renderEvent(tripEvent));
  }

  _renderEventList() {
    this._renderEvents();
  }

  _renderNoEvents() {
    render(this._eventContainer, new NoEventView(), RenderPosition.AFTERBEGIN);
  }

  _renderTripInfo() {
    const destinations = [];
    this._tripEvents.forEach((evt) => destinations.push(evt.destination));

    const tripInfo = {
      startDate: this._tripEvents[0].startDate,
      finishDate: this._tripEvents[this._tripEvents.length - 1].finishDate,
      destinations
    };

    this._tripInfoComponent = new TripInfoView(tripInfo); // TODO: Need to enable to replace the component on update
    render(this._tripContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
  }

  _renderTripPrice() {
    const totalPriceForEvents = this._tripEvents.reduce((total, event) => {
      const priceForEventOffers = event.offers.reduce((sum, offer) => sum + offer.price, 0);
      return event.price + priceForEventOffers + total;
    }, 0);

    render(this._tripInfoComponent, new TripPriceView(totalPriceForEvents), RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._tripEvents.length === 0) {
      this._renderNoEvents();
      return;
    }

    this._renderTripInfo();
    this._renderTripPrice();
    this._renderSort();
    this._renderEventList(); // TODO: Probably obsolete, need to decide later
  }
}
