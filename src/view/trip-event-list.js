import AbstractView from '../view/abstract.js';

const createTripEventListTemplate = () => {
  return `<ul class="trip-events__list">
  </ul>`;
};

export default class TripEventList extends AbstractView {
  getTemplate() {
    return createTripEventListTemplate();
  }
}
