const Source = require('../source');
const Queue = require('../queue');

module.exports = class RTMOut extends Source {
  constructor (slackRtm) {
    super();

    this.slackRtm = slackRtm;
    this.ready = false;
    this._queue = new Queue(this.doJob.bind(this));
    // this._queue.pause();

    this.slackRtm.on('connected', () => {
      // this._queue.resume();
    });
  }

  enqueue (job) {
    this._queue.enqueue(job);
  }

  doJob (job) {
    const {message, conversationId} = job;
    console.log('RTMOut', message, conversationId);
    this.slackRtm.sendMessage(String(message), conversationId)
      .then(response => this.send(Object.assign({}, response)));
  }
};
