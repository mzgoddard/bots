module.exports = class Queue {
  constructor (handle) {
    this._queue = [];
    this._promise = null;
    this._paused = false;
    this._handle = handle;
  }

  enqueue (item) {
    this._queue.push(item);
    if (!this._paused && this._promise === null) {
      this._promise = Promise.resolve().then(() => this.drain());
    }
  }

  async drain () {
    let item;
    while (item = this._queue.shift()) {
      if (this._paused) {
        this._queue.unshift(item);
        this._promise = null;
        return;
      }
      try {
        await this._handle(item);
      } catch (e) {
        console.error(e);
      }
    }
    this._promise = null;
  }

  pause () {
    this._paused = true;
    if (this._promise) {
      this._promise = null;
    }
  }

  resume () {
    this._paused = false;
    if (this._queue.length) {
      this._promise = Promise.resolve().then(() => this.drain());
    }
  }
};
