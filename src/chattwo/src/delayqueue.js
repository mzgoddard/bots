class DelayQueue extends Queue {
  drain () {
    const next = () => {
      if (this._paused) {
        this._promise = null;
        return;
      }
      if (this._queue.length) {
        const item = this._queue.shift();
        return Promise.resolve(() => {
          return handle(item);
        }).then(next);
      }
      this._promise = null;
    };
    return Promise.resolve(next);
  }
}
