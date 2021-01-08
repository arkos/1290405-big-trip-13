import SmartView from '../view/smart.js';

const createStatisticsTemplate = () => {
  return `<section class="statistics statistics--hidden">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item statistics__item--money">
      <canvas class="statistics__chart  statistics__chart--money" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--transport">
      <canvas class="statistics__chart  statistics__chart--transport" width="900"></canvas>
    </div>

    <div class="statistics__item statistics__item--time-spend">
      <canvas class="statistics__chart  statistics__chart--time" width="900"></canvas>
    </div>
  </section>`;
};

export default class Statistics extends SmartView {
  constructor(points) {
    super();

    this._state = {
      points
    };

    this._dateChangeHandler = this._dateChangeHandler.bind(this);

    this._setCharts();
  }

  getTemplate() {
    return createStatisticsTemplate(this._state);
  }

  _dateChangeHandler(dateFrom, dateTo) {
    this.updateData({
      dateFrom,
      dateTo
    });
  }

  _setCharts() {

  }
}
