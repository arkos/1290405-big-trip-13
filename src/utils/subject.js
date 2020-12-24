export default class Subject {
  constructor() {
    this._observers = [];
  }

  attach(observer) {
    this._observers.push(observer);
  }

  detach(observer) {
    this._observers = this._observers.filter((existingObserver) => existingObserver !== observer);
  }

  _notify(event, payload) {
    this._observers.forEach((observer) => observer(event, payload));
  }
}
