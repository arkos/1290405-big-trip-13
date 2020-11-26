import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';

dayjs.extend(duration);

import {humanizeDate} from '../util.js';

const createTripEventOfferTemplate = ({title, price}) => {
  return `<li class="event__offer">
    <span class="event__offer-title">${title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${price}</span>
  </li>`;
};

const createTripEventOffersTemplate = (offers) => {
  return offers.length > 0 ? `<h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
    ${offers.map((offer) => createTripEventOfferTemplate(offer)).join(``)}
  </ul>` : ``;
};

export const createTripEventTemplate = (tripEvent) => {

  const {type, destination, startDate, finishDate, price, offers} = tripEvent;

  const offersTemplate = createTripEventOffersTemplate(offers);

  const durationBetweenDates = dayjs.duration(finishDate.diff(startDate));

  const days = durationBetweenDates.days();
  const hours = durationBetweenDates.hours();
  const minutes = durationBetweenDates.minutes();

  const daysString = String(days).padStart(2, `0`);
  const hoursString = String(hours).padStart(2, `0`);
  const minutesString = String(minutes).padStart(2, `0`);

  let formattedDuration;

  if (days > 0) {
    formattedDuration = `${daysString}D ${hoursString}H ${minutesString}M`;
  } else if (hours > 0) {
    formattedDuration = `${hoursString}H ${minutesString}M`;
  } else {
    formattedDuration = `${minutesString}M`;
  }

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${humanizeDate(startDate, `YYYY-MM-DD`)}">${humanizeDate(startDate, `MMM D`).toUpperCase()}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${type.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${type} ${destination}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${humanizeDate(startDate, `YYYY-MM-DDTHH:mm`)}">${humanizeDate(startDate, `HH:mm`)}</time>
          &mdash;
          <time class="event__end-time" datetime="${humanizeDate(finishDate, `YYYY-MM-DDTHH:mm`)}">${humanizeDate(finishDate, `HH:mm`)}</time>
        </p>
        <p class="event__duration">${formattedDuration}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${price}</span>
      </p>

      ${offersTemplate}

      <button class="event__favorite-btn event__favorite-btn--active" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
