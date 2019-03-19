module.exports = class Source {
  constructor () {
    this._listeners = [];
  }

  send (value) {
    for (let i = 0; i < this._listeners.length; i++) {
      this._listeners[i](value);
    }
  }

  attach (fn) {
    if (typeof fn === 'object') {
      if (fn.enqueue && !fn.hasOwnProperty('enqueue')) {
        fn.enqueue = fn.enqueue.bind(fn);
        fn = fn.enqueue;
      }
    }
    if (typeof fn !== 'function') {
      throw new Error(`trying to attach non-function ${fn}`);
    }
    const index = this._listeners.indexOf(fn);
    if (index === -1) {
      this._listeners.push(fn);
    }
  }

  detach (fn) {
    if (typeof fn === 'object') {
      fn = fn.enqueue;
    }
    const index = this._listeners.indexOf(fn);
    if (index > -1) {
      this._listeners.splice(index, 1);
    }
  }
};
