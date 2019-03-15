const Source = require('../source');
const Queue = require('../queue');

module.exports = class RTMIn extends Source {
  constructor (slackRtm) {
    this.slackRtm = slackRtm;
    this.ready = false;
    this._listeners = [];
    this._queue = new Queue(this.doJob.bind(this));
    this._queue.pause();

    this.slackRtm.on('message', (message) => {
      // Skip messages that are from a bot or my own user ID
      if (
        (message.subtype && message.subtype === 'bot_message') ||
        (!message.subtype && message.user === this.slackRtm.activeUserId)
      ) {
        return;
      }

      // console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
      this._queue.enqueue(() => this.doJob(Object.assign({}, message)));
    });
  }

  enqueue (job) {
    this._queue.enqueue(job);
  }

  doJob (job) {
    this.send(job);
  }
};
