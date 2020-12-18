import Subject from '../utils/subject.js';

export default class DataList extends Subject {
  constructor() {
    super();
    this._options = new Map();
    this._types = new Map();
    this._destinations = new Map();
  }

  setOptions(options) {
    this._options = new Map(options);
  }

  getOptions() {
    return this._options;
  }

  setTypes(types) {
    this._types = new Map(types);
  }

  getTypes() {
    return this._types;
  }

  setDestinations(destinations) {
    this._destinations = new Map(destinations);
  }

  getDestinations() {
    return this._destinations;
  }
}
