import AbstractView from '../view/abstract.js';

const createNoTaskTemplate = () => {
  return `<p class="trip-events__msg">Click New Event to create your first point</p>`;
};

export default class NoEvent extends AbstractView {
  getTemplate() {
    return createNoTaskTemplate();
  }
}
