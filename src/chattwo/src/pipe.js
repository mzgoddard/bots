class Pipe {
  constructor ({}) {
    this._queue = [];
  }

  available () {
    return this._queue.length;
  }

  write (item) {
    this._queue.push(item);
  }

  read (item) {
    this._queue.shift(item);
  }
}
