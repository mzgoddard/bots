class Source {
  constructor () {
    this._listeners = [];
  }

  send (value) {
    for (let i = 0; i < this._listeners.length; i++) {
      this._listeners[i](value);
    }
  }

  attach (fn) {
    const index = this._listeners.indexOf(fn);
    if (index === -1) {
      this._listeners.push(fn);
    }
  }

  detach (fn) {
    const index = this._listeners.indexOf(fn);
    if (index > -1) {
      this._listeners.splice(index, 1);
    }
  }
}
