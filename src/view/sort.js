const createSortItemsTemplate = (sortItems) => {
  return sortItems.map(([sortName, sortText], index) => `<div class="trip-sort__item  trip-sort__item--${sortName}">
  <input id="sort-${sortName}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort"
    value="sort-${sortName}" ${index === 0 ? `checked` : ``} ${sortName === `event` || sortName === `offer` ? `disabled` : ``}>
  <label class="trip-sort__btn" for="sort-${sortName}">${sortText}</label>
</div>`);
};


export const createSortTemplate = (sort) => {
  const sortItems = Object.entries(sort);
  const sortItemsTemplate = createSortItemsTemplate(sortItems);

  return `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
    ${sortItemsTemplate}
  </form>`;
};

