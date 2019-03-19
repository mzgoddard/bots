const Source = require('../source');
const Queue = require('../queue');

module.exports = class RTMIn extends Source {
  constructor (slackRtm) {
    super();

    this.slackRtm = slackRtm;
    this.ready = false;
    this._listeners = [];
    this._queue = new Queue(this.doJob.bind(this));
    // this._queue.pause();

    this.slackRtm.on('message', (message) => {
      console.log('slackRtm.message', message);
      // Skip messages that are from a bot or my own user ID
      if (
        (message.subtype && message.subtype === 'bot_message') ||
        (!message.subtype && message.user === this.slackRtm.activeUserId)
      ) {
        return;
      }

      console.log(`(channel:${message.channel}) ${message.user} says: ${message.text}`);
      this._queue.enqueue(Object.assign({}, message));
    });

    this.slackRtm.on('connecting', () => {
      console.log('connecting');
    });

    this.slackRtm.on('authenticated', () => {
      console.log('authenticated');
    });

    this.slackRtm.on('connected', () => {
      console.log('connected');
      // this._queue.resume();
    });

    this.slackRtm.on('disconnected', () => {
      console.log('disconnected');
    });

    this.slackRtm.on('raw_message', (...args) => {
      console.log('raw_message', ...args);
    });

    this.slackRtm.on('error', (...args) => {
      console.log('error', ...args);
    });

    this.slackRtm.on('unable_to_rtm_start', (...args) => {
      console.log('unable_to_rtm_start', ...args);
    });
  }

  enqueue (job) {
    this._queue.enqueue(job);
  }

  doJob (job) {
    console.log('RTMIn.doJob', job);
    this.send(job);
  }
};
