const RTMIn = require('../slack/rtm-in');
const RTMOut = require('../slack/rtm-out');

const Bot = require('./bot');

class InMessageCompat {
  constructor (bot, in) {
    this.bot = bot;
    this.in = in;

    this.in.attach(this.enqueue.bind(this));
  }

  enqueue (job) {
    this.bot.onMessage(job);
  }
}

module.exports = class SlackBot extends Bot {
  constructor ({slack, getSlack, name, icon, eventNames, postMessageDelay, ...args}) {
    super(args);

    this.slack = slack;
    this.getSlack = getSlack;
    this.name = name;
    this.icon = icon;
    this.eventNames = eventNames;
    this.postMessageDelay = postMessageDelay;

    this.in = null;
    this.out = null;
  }

  // First, ensure the bot has a "slack" object, then bind event handlers and
  // start the bot.
  login() {
    if (!this.slack) {
      this.slack = this.getSlack();
      if (!this.slack || typeof this.slack !== 'object') {
        throw new TypeError('The "getSlack" function must return an object.');
      }
    }
    const slack = this.slack;
    if (!slack.rtmClient) {
      throw new TypeError('The "slack" object is missing a required "rtmClient" property.');
    }
    // else if (!slack.rtmClient.dataStore) {
    //   throw new TypeError('The "slack" object is missing a required "rtmClient.dataStore" property.');
    // }
    // else if (!slack.webClient) {
    //   throw new TypeError('The "slack" object is missing a required "webClient" property.');
    // }
    // Bind event handlers to the slack rtm client.
    // this.bindEventHandlers(this.eventNames);

    this.in = new RTMIn(this.slack.rtmClient);
    new InMessageCompat(this, this.in);
    this.out = new RTMOut(this.slack.rtmClient);

    // Start the rtm client!
    this.slack.rtmClient.start();
    // Make it chainable.
    return this;
  }
  
};
