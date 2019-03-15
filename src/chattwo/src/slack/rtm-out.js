const Source = require('../source');
const Queue = require('../queue');

class RTMOut extends Source {
  constructor (slackRtm) {
    this.slackRtm = slackRtm;
    this.ready = false;
    this._queue = new Queue(this.doJob.bind(this));
    this._queue.pause();

    this.slackRtm.on('ready', () => {
      this._queue.resume();
    });
  }

  enqueue (job) {
    this._queue.enqueue(job);
  }

  doJob (job) {
    const {message, conversationId} = job;
    this.slackRtm.sendMessage(String(message), conversationId)
      .then(response => this.send(Object.assign({}, response)));
  }
}
